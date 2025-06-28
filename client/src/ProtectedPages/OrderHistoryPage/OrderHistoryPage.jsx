import { useEffect, useState } from 'react';    // React hooks for tiggering side effects and managing local state
import { useNavigate } from 'react-router-dom'; // Navigation hook for programmatic routing
import axios from 'axios';                      // HTTP client for fetching data from backend

// Core table utilities from tanstack/react-table v8
import {
  useReactTable,          // Main hook to create a table instance            
  getCoreRowModel,        // Gets the basic list of rows to display
  getSortedRowModel,      // Enables sorting logic
  getPaginationRowModel,  // Enables pagination logic
  flexRender,             // Renders JSX cells/headers using column definitions
} from '@tanstack/react-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Icon renderer
import { faSort } from '@fortawesome/free-solid-svg-icons';      // Default sort icon (inactive column)

import { formatTimestampToMDY, 
         formatTimestampToLongDate } from '../../utils/utilityFunctions'; // custom date formatter(s)

import ShopNowButton from '../../PageComponents/cartShopNowButton/cartShopNowButton';
import FooterBottom from '../../PageComponents/footerBottom/footerBottom';

import './OrderHistoryPage.css'; // custom styling


const OrderHistoryPage = () => { //

  const [orders, setOrders]             = useState([]);   // tracks and stores list of user's orders
  const [ordersLength, setOrdersLength] = useState(null); // tracks total number of orders (used for conditional rendering)
  const [sorting, setSorting]           = useState([]);   //useState([{ id: 'placed_at', desc: true }]);  // Tracks active sort column + direction

  const [pagination, setPagination] = useState({ // tracks number of order records/rows per pagination
    pageIndex: 0,  // start on the first page
    pageSize: 5    // default rows per page
  });

  const defaultColumnState = { // Initial state: no column is marked active
    order_details: false, 
    date_details:  false, 
    total_details: false, 
    view_details:  false
  };

  const [activeColumn, setActiveColumn] = useState(defaultColumnState); // Track which column is visually active for sorting

  const handleActive = (column_to_toggle) => { // Handles both toggling sort direction and switching active column

    const isSameColumn = activeColumn[column_to_toggle]; // Checks if this is the currently active column?

    if (isSameColumn) { // If 'isSameColumn' exists and is currently active, find current direction of active sort


      const currentSort = sorting.find(sort => sort.id === column_to_toggle); // Get curr. sorting object for this column from 'sorting' array
      /* Example result: { id: 'total_details', desc: false } */


      /* Get current sort direction for this column. If currentSort is undefined (failsafe), default to false (i.e., ascending).*/
      const currentDir = currentSort?.desc ?? false; // Example: If it's currently descending, currentDir = true; otherwise, false.


      setSorting([ // Set a new sorting array that toggles the direction of the same column (Toggle between asc <-> desc)
        { 
          id: column_to_toggle,   // Set this column as the main sort target again
          desc: !currentDir       // Flip direction: asc → desc OR desc → asc
        },
        ...(  // Add a secondary sort (tiebreaker) by Order ID if the primary column isn't 'order_details'
          column_to_toggle !== 'order_details' 
          ? [{ id: 'order_details', desc: true }] // Always sort Order ID descending (or ascending) as fallback
          : []                                    // If already sorting by Order ID, skip sub-sort
        )
      ]);

    } 
    else { // Otherwise, if column is newly selected from previous column, set that one as active
      setActiveColumn({
        order_details: false,
        date_details:  false,
        total_details: false,
        view_details:  false,
        [column_to_toggle]: true,
      });

      setSorting([
        { id: column_to_toggle, desc: true }, // sets new column as 'desc' sort by default on click
        ...(column_to_toggle !== 'order_details' ?  // user 'order_details' as tie-breaker for sorting in case of same values
           [{ id: 'order_details', desc: true }] : // during tie-breaker, sort 'order_details' as descending
           []) 
      ]);
    }
  };                                                                                                                                      

  const navigate = useNavigate(); // used to enable navigation to an order's details.

  useEffect(() => { // fetch user's order history on mount
    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/orders', { withCredentials: true });
            console.log('User Id: ', response.data.userId);
            setOrdersLength(response.data.orders.length); // Track length of orders for conditional UI
            setOrders(response.data.orders);              // Set data for table
        }
        catch (error) {
            console.log("Failed to load order history:", error);
        }
    }
    fetchOrderHistory(); // Run fetch on mount
  }, []);


  const columns = [   // Defines column metadata for the table
    {
      header: 'Order ID ',           // Display label
      id: 'order_details',           // Logical ID used in sorting state
      accessorKey: 'order_id',       // Field in the data used for sorting/filtering
      enableSorting: true,           // Allow sorting
      cell: info => info.getValue()  // Cell rendering logic
    },
    {
      header: 'Order Date ',
      id: 'date_details',
      accessorKey: 'placed_at',
      enableSorting: true,
      cell: info => (formatTimestampToLongDate(info.getValue()))
    },
    {
      header: 'Total ($) ',
      id: 'total_details',
      accessorKey: 'total',
      enableSorting: true,
      cell: info => `$${parseFloat(info.getValue()).toFixed(2)}`,
    },
    {
      header: 'Details',
      id: 'view_details', // use custom id instead of accessorKey for 'cell'
      enableSorting: false,
      cell: ({ row }) => {
        //console.log("🛠 row object for View column:", row);
        return (
          <span 
            className="view-link" 
            //onClick={() => navigate(`/orders/${row.original.order_id}`)}
            onClick={() => navigate(`/orders/${row.getValue('order_details')}`)}
          >
          View
          </span>
        );
      }
    },
  ];

  const ordersTable = useReactTable({   // Create the table instance using tanstack/react-table
    data: orders,                                    // Table data
    columns,                                         // Column definitions
    state: {
      sorting,                                       // Controlled sorting state 
      pagination                                     // Controlled pagination state     
    },                             
    onSortingChange: setSorting,                     // Update sorting when user changes it
    onPaginationChange: setPagination,               // allow the table to update pagination state
    getCoreRowModel: getCoreRowModel(),              // Generates base rows from data
    getSortedRowModel: getSortedRowModel(),          // Applies sorting to rows
    getPaginationRowModel: getPaginationRowModel(),  // Supports pagination
    manualPagination: false,                         // Let the table handle pagination automatically
  });

  if (ordersLength === 0) {   // Case: no orders at all
    return (
      <div className='order-history-page-wrapper' data-bg-var-repaint>
        <div className="order-history-empty">
          <h2>You’ve currently have no orders.</h2>
          <ShopNowButton emptyCartMessage='Shop to Make an Order' />
        </div>
      </div>
    );
  }

  if (ordersLength > 0) {   // Case: orders exist
    return (
      <>
      <div className='order-history-page-wrapper' data-bg-var-repaint>
      <div className="order-history-page">

        {/***** Section: Title *****/}
        <h1>Your Order History</h1>

        {/***** Section: Page size dropdown (controls rows per page) *****/}
        <div className='controls-container'>
          <div className="table-controls">
            <label>
                Rows per page:{' '}
                <select 
                  id='pagination-select'
                  value={pagination.pageSize}
                  onChange={(event) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(event.target.value), // set new page size
                      pageIndex: 0    // always reset to first page when changing size
                    }))
                  }
                >
                <option value={5}>5</option>
                <option value={10}>10</option>
                </select>
            </label>
          </div>

          {/***** Section: Pagination controls (Previous, Next, Page #) *****/}
          <div className="pagination-controls">
            <button
              onClick={() => ordersTable.previousPage()}   // go to previous page
              disabled={!ordersTable.getCanPreviousPage()} // disable if on first page
            >
              Prev
            </button>
            <span id='current-page-tracker'>
              Page {ordersTable.getState().pagination.pageIndex + 1} {/* pageIndex is zero-based */}
              of {ordersTable.getPageCount()}                        {/* total number of pages */}
            </span>
            <button
              onClick={() => ordersTable.nextPage()}    // go to next page
              disabled={!ordersTable.getCanNextPage()}  // disable if on last page
            >
              Next
            </button>
          </div>
        </div>

        {/***** Section: Table *****/}
        <div className='order-history-wrapper'>
        <table className="order-history-table">

          {/***** Subsection: Table Header with Sort Logic *****/}
          <thead>
          {ordersTable.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                  const canSort = header.column.getCanSort();   // checks if this column sortable?
                  const isSorted = header.column.getIsSorted(); // current sort direction ('asc', 'desc', false)

                  return (
                  <th
                    key={header.id}
                    onClick={() => handleActive(header.id)}  // click toggles sorting and column activation
                    className={`sortable-header ${!canSort ? 'no-sort' : ''}`}
                  >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {/***** Show ▼ / ▲ icon if active column, else show FontAwesome sort icon *****/}
                      {canSort && (
                        <span className="sort-icon">
                          {activeColumn[header.id]
                            ? (isSorted === 'asc' ? '▲' : '▼')
                            : <FontAwesomeIcon icon={faSort} />}
                        </span>
                      )}
                  </th>
                  );
              })}
              </tr>
          ))}
          </thead>

          {/***** Subsection: Table Body with Data Rows + Empty Padding Rows *****/}
          <tbody>
              {/***** Render each visible data row for current page *****/}
              {ordersTable.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                  ))}
                  </tr>
              ))}

               {/***** Render empty filler rows to pad table to full page size (visual consistency) *****/}
              {Array.from({ length: pagination.pageSize - ordersTable.getRowModel().rows.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="empty-row">
                  <td colSpan={columns.length}></td>
                  </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>
      <FooterBottom/>
      </div>
      </>
    );
  }
};

export default OrderHistoryPage;
