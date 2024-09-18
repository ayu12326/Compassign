// import React, { useEffect, useState } from 'react';
// import './KanbanBoard.css';


// // src/KanbanBoard.js


// const KanbanBoard = () => {
//     const [tickets, setTickets] = useState([]);
//     const [grouping, setGrouping] = useState('status');
//     const [sortOption, setSortOption] = useState('priority');

//     useEffect(() => {
//         fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
//             .then((response) => response.json())
//             .then((data) => setTickets(data))
//             .catch((error) => console.error('Error fetching data:', error));
//     }, []);

//     return (
//         <div>
//             <div className="controls">
//                 <label>Group By:</label>
//                 <select onChange={(e) => setGrouping(e.target.value)} value={grouping}>
//                     <option value="status">Status</option>
//                     <option value="user">User</option>
//                     <option value="priority">Priority</option>
//                 </select>
                
//                 <label>Sort By:</label>
//                 <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
//                     <option value="priority">Priority</option>
//                     <option value="title">Title</option>
//                 </select>
//             </div>
            
//             <div className="kanban-board">
//                 {/* Your grouped and sorted tickets displayed here */}
//             </div>
//         </div>
//     );
// };

// export default KanbanBoard;


import React, { useEffect, useState } from 'react';
import './KanbanBoard.css';

// src/KanbanBoard.js

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status');
    const [sortOption, setSortOption] = useState('priority');

    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.tickets)) {
                    setTickets(data.tickets);
                } else {
                    console.error('Expected tickets array but received:', data);
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Function to group tickets by a specified property
    const groupTickets = (tickets, grouping) => {
        if (!Array.isArray(tickets)) return {}; // Ensure tickets is an array

        return tickets.reduce((groups, ticket) => {
            const key = ticket[grouping];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(ticket);
            return groups;
        }, {});
    };

    // Function to sort tickets by a specified property
    const sortTickets = (tickets, sortOption) => {
        if (!Array.isArray(tickets)) return []; // Ensure tickets is an array

        return tickets.slice().sort((a, b) => {
            if (sortOption === 'priority') {
                return b.priority - a.priority; // Assuming priority is a number
            } else if (sortOption === 'title') {
                return a.title.localeCompare(b.title); // Sorting alphabetically
            }
            return 0;
        });
    };

    // Apply grouping and sorting
    const groupedTickets = groupTickets(tickets, grouping);
    const sortedTickets = Object.values(groupedTickets).map(group => sortTickets(group, sortOption));

    return (
        <div>
            <div className="controls">
                <label>Group By:</label>
                <select onChange={(e) => setGrouping(e.target.value)} value={grouping}>
                    <option value="status">Status</option>
                    <option value="userId">User</option>
                    <option value="priority">Priority</option>
                </select>
                
                <label>Sort By:</label>
                <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
            </div>
            
            <div className="kanban-board">
                {Object.keys(groupedTickets).length === 0 ? (
                    <p>No tickets available</p>
                ) : (
                    Object.keys(groupedTickets).map((groupKey) => (
                        <div key={groupKey} className="group">
                            <h2>{groupKey}</h2>
                            {sortedTickets.map((ticketGroup, index) => (
                                <div key={index} className="ticket-group">
                                    {ticketGroup.map((ticket) => (
                                        <div key={ticket.id} className="ticket">
                                            <h3>{ticket.title}</h3>
                                            <p>Priority: {ticket.priority}</p>
                                            <p>Status: {ticket.status}</p>
                                            <p>User: {ticket.userId}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KanbanBoard;

