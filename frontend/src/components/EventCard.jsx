const cardStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '16px',
  width: '260px',
  background: 'white',
};
const soldOutBadgeStyle = {
  display: 'inline-block',
  background: '#dc2626',
  color: 'white',
  fontWeight: 'bold',
  padding: '6px 12px',
  borderRadius: '4px',
};
const bookButtonStyle = {
  background: '#16a34a',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
};

function EventCard({ title, category, date, venue, ticketsAvailable, onSelect }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      <p style={{ margin: '4px 0' }}>Category: {category}</p>
      <p style={{ margin: '4px 0' }}>Date: {new Date(date).toLocaleDateString()}</p>
      <p style={{ margin: '4px 0' }}>Venue: {venue}</p>
      <p style={{ margin: '4px 0' }}>Tickets available: {ticketsAvailable}</p>
      {ticketsAvailable === 0 ? (
        <span style={soldOutBadgeStyle}>Sold Out</span>
      ) : (
        <button style={bookButtonStyle} onClick={onSelect}>Book</button>
      )}
    </div>
  );
}

export default EventCard;
