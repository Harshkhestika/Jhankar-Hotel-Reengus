import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correct import

const CustomerDetailsPanel = () => {
  const { customers } = useData();
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNo.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  // Toggle dropdown for customer expenses
  const toggleExpenses = (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setExpandedCustomerId(customerId);
    }
  };

  // --- PDF Handlers ---

  // Download full report
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Customer Report", 14, 16);

    const tableHead = [
      ["ID", "Name", "Room", "Check-in", "Check-out", "Subtotal", "GST", "Total Bill", "Status"] // <-- NEW COLUMN
    ];
    const tableBody = filteredCustomers.map(c => [
      c.id,
      c.customerName,
      c.roomNo,
      c.checkInDate,
      c.checkOutDate,
      "Rs. " + c.subtotal.toLocaleString(),
      "Rs. " + c.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      "Rs. " + c.totalBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      c.paymentStatus, // <-- NEW DATA
    ]);

    autoTable(doc, {
      startY: 22,
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] } // Amber-600 color
    });

    doc.save('customer-report.pdf');
    showNotification('Customer report downloaded!', 'success');
  };

  return (
    <div id="customer-details-panel">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Details</h2>
      
      {/* Search and Download Bar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, room, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
          />
          <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
        </div>
        <button
          onClick={handleDownloadReport}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <i className="fas fa-file-pdf mr-2"></i> Download PDF Report
        </button>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">All Customer Details</h3>
          <span className="text-gray-600">
            Total Customers: <span className="font-bold">{filteredCustomers.length}</span>
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {/* min-w-[1000px] added to ensure table scrolls on medium screens */}
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Charges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Charges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST (18%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th> {/* <-- NEW COLUMN */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  isExpanded={expandedCustomerId === customer.id}
                  onToggleExpand={() => toggleExpenses(customer.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Customer Row (UPDATED) ---
const CustomerRow = ({ customer, isExpanded, onToggleExpand }) => {
  const { updateCustomerPaymentStatus } = useData();
  const { showNotification } = useNotification();

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateCustomerPaymentStatus(customer.id, newStatus);
    showNotification(`Status for ${customer.customerName} updated to ${newStatus}`, 'success');
  };

  // Helper for status colors
  const getStatusColorClasses = (status) => {
    return status === 'Complete' 
      ? 'bg-green-100 text-green-800 ring-green-600/20' 
      : 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
  };

  return (
    <>
      {/* Main Row */}
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
          <div className="text-sm text-gray-500">{customer.id}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">Room {customer.roomNo}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{customer.checkInDate}</div>
          <div className="text-sm text-gray-500">{customer.stayDuration} days</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">₹{customer.roomCharges.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">₹{customer.foodCharges.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowGrap">
          <div className="text-sm text-gray-900 font-medium">₹{customer.subtotal.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">₹{customer.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-bold text-amber-700">₹{customer.totalBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </td>
        {/* --- NEW COLUMN: Editable Payment Status --- */}
        <td className="px-6 py-4 whitespace-nowrap">
          <select 
            value={customer.paymentStatus}
            onChange={handleStatusChange}
            className={`text-sm font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 border-none ${getStatusColorClasses(customer.paymentStatus)}`}
          >
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
          </select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button onClick={onToggleExpand} className="text-amber-600 hover:text-amber-800">
            <i className="fas fa-chevron-down"></i>
          </button>
        </td>
      </tr>
      {/* Expanded Dropdown Row */}
      {isExpanded && (
        <tr>
          <td colSpan="10" className="p-0"> {/* <-- ColSpan updated to 10 */}
            <CustomerExpenseDropdown customer={customer} />
          </td>
        </tr>
      )}
    </>
  );
};

// --- Sub-Component: Customer Expense Dropdown (UPDATED) ---
const CustomerExpenseDropdown = ({ customer }) => {
  const { getCustomerExpenses, orders } = useData(); // Get orders to find descriptions

  // Rework getCustomerExpenses to be simpler
  const roomCharge = customer.roomCharges;
  const foodOrders = orders
    .filter(o => o.roomNo === customer.roomNo)
    .map(o => ({
      date: o.date,
      desc: `Food Order #${o.id} (${o.foodItems})`,
      amount: o.totalAmount,
      quantity: o.quantity, // Added for receipt
    }));

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const { customerName, id, roomNo, checkInDate, checkOutDate, stayDuration, paymentStatus } = customer;

    // --- Receipt Header ---
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Jhankar Hotel", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Riico industrial area, Reengus, Rajasthan, India", 105, 26, { align: 'center' });
    doc.text("Phone: +91 11 1234 5678 | Email: info@Jhankar@gmail.com", 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Guest Folio / Receipt", 14, 45);
    
    // --- Guest Info ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Guest Name:", 14, 55);
    doc.text("Customer ID:", 14, 60);
    doc.text("Room No:", 14, 65);
    doc.text("Stay Dates:", 14, 70);
    doc.text("Payment Status:", 14, 75); // <-- NEW FIELD

    doc.setFont('helvetica', 'normal');
    doc.text(customerName, 50, 55);
    doc.text(id, 50, 60);
    doc.text(roomNo, 50, 65);
    doc.text(`${checkInDate} to ${checkOutDate} (${stayDuration} nights)`, 50, 70);
    
    // --- NEW: Payment status with color ---
    doc.setFont('helvetica', 'bold');
    if (paymentStatus === 'Complete') {
      doc.setTextColor(0, 128, 0); // Green
      doc.text(paymentStatus, 50, 75);
    } else {
      doc.setTextColor(217, 119, 6); // Amber
      doc.text(paymentStatus, 50, 75);
    }
    doc.setTextColor(0, 0, 0); // Reset color
    

    // --- Line Items Table ---
    const tableHead = [["Date", "Description", "Amount (INR)"]];
    const tableBody = [];
    
    tableBody.push([
      checkInDate, 
      `Room Charges (${stayDuration} nights @ Rs. ${(roomCharge / (stayDuration || 1)).toLocaleString()})`,
      "Rs. " + roomCharge.toLocaleString()
    ]);

    foodOrders.forEach(order => {
      tableBody.push([
        order.date,
        order.desc,
        "Rs. " + order.amount.toLocaleString()
      ]);
    });

    autoTable(doc, {
      startY: 85, // Adjusted Y position
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99] }, // gray-600
      foot: [
        ['', 'Subtotal', "Rs. " + customer.subtotal.toLocaleString()],
        // --- THIS IS THE FIX ---
        ['', 'GST (18%)', "Rs. " + customer.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
        ['', { content: 'Total Bill', styles: { fontStyle: 'bold' } }, { content: "Rs. " + customer.totalBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold' } }],
      ],
      footStyles: { fillColor: [243, 244, 246], textColor: [0,0,0] },
      didDrawCell: (data) => {
        if (data.section === 'body' || data.section === 'foot') {
          if (data.column.index === 2) {
            data.cell.styles.halign = 'right';
          }
        }
      }
    });

    // --- Footer ---
    doc.setFontSize(10);
    doc.text("Thank you for staying with us!", 105, doc.lastAutoTable.finalY + 15, { align: 'center' });

    doc.save(`receipt-${customer.id}-${customerName}.pdf`);
  };

  return (
    <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
      <h4 className="font-bold text-gray-800 mb-2">Detailed Bill for {customer.customerName} (Room {customer.roomNo})</h4>
      <div className="max-h-48 overflow-y-auto pr-2">
        <ul className="space-y-1">
          {/* Room Charges */}
          <li className="flex justify-between">
            <span className="text-gray-700">Room Charges ({customer.stayDuration} nights)</span>
            <span className="font-medium text-gray-800">₹{customer.roomCharges.toLocaleString()}</span>
          </li>
          
          <li className="font-semibold text-gray-800 pt-2">Food Charges:</li>
          {foodOrders.length > 0 ? (
            foodOrders.map(order => (
              <li key={order.id} className="flex justify-between pl-4">
                <span className="text-gray-600">{order.date} - {order.desc} (x{order.quantity})</span>
                <span className="font-medium text-gray-700">₹{order.amount.toLocaleString()}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 pl-4">No food orders found.</li>
          )}
        </ul>
      </div>

      {/* --- Total Section --- */}
      <div className="border-t border-amber-300 mt-3 pt-3 space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Subtotal</span>
          <span className="font-semibold text-gray-800">₹{customer.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">GST (18%)</span>
          <span className="font-semibold text-gray-800">₹{customer.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-bold text-gray-900">Total Bill</span>
          <span className="font-bold text-amber-700">₹{customer.totalBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="text-right mt-3">
        <button
          onClick={handleDownloadReceipt}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
        >
          <i className="fas fa-file-invoice mr-2"></i>Download Receipt
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailsPanel;