import { useEffect, useState } from 'react';

const cellStyle = { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' };

function OrganizerPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/events');
        if (!response.ok) {
          throw new Error('Failed to load events');
        }
        setEvents(await response.json());
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const totalTicketsRemaining = events.reduce((sum, eventItem) => sum + eventItem.ticketsAvailable, 0);
  const soldOutCount = events.filter((eventItem) => eventItem.ticketsAvailable === 0).length;

  return (
    <div style={{ padding: '24px' }}>
      <h1>Organizer Panel</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
      {!loading && !error && (
        <>
          <p>Total events: {events.length}</p>
          <p>Total tickets remaining: {totalTicketsRemaining}</p>
          <p>Sold-out events: {soldOutCount}</p>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={cellStyle}>Title</th>
                <th style={cellStyle}>Category</th>
                <th style={cellStyle}>Venue</th>
                <th style={cellStyle}>Tickets Available</th>
              </tr>
            </thead>
            <tbody>
              {events.map((eventItem) => (
                <tr key={eventItem._id}>
                  <td style={cellStyle}>{eventItem.title}</td>
                  <td style={cellStyle}>{eventItem.category}</td>
                  <td style={cellStyle}>{eventItem.venue}</td>
                  <td style={cellStyle}>{eventItem.ticketsAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default OrganizerPanel;
