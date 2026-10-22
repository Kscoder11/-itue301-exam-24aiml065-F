import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const cellStyle = { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' };

function MyTicketsPage() {
  const { auth } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await fetch('/api/v1/tickets/my', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to load your tickets');
        }
        setTickets(await response.json());
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, [auth.token]);

  return (
    <div style={{ padding: '24px' }}>
      <h1>My Tickets</h1>
      {loading && <p>Loading tickets...</p>}
      {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
      {!loading && !error && tickets.length === 0 && <p>You have no tickets yet.</p>}
      {tickets.length > 0 && (
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Event</th>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>Venue</th>
              <th style={cellStyle}>Attendee</th>
              <th style={cellStyle}>Quantity</th>
              <th style={cellStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td style={cellStyle}>{ticket.eventId?.title}</td>
                <td style={cellStyle}>
                  {ticket.eventId ? new Date(ticket.eventId.date).toLocaleDateString() : ''}
                </td>
                <td style={cellStyle}>{ticket.eventId?.venue}</td>
                <td style={cellStyle}>{ticket.attendeeId?.name} ({ticket.attendeeId?.email})</td>
                <td style={cellStyle}>{ticket.quantity}</td>
                <td style={cellStyle}>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyTicketsPage;
