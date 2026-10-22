import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const pageStyle = { padding: '24px' };
const gridStyle = { display: 'flex', flexWrap: 'wrap', gap: '16px' };
const formStyle = { border: '2px solid #2563eb', borderRadius: '8px', padding: '16px', margin: '16px 0', maxWidth: '360px' };

function EventsPage() {
  const { auth } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingFailed, setBookingFailed] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/v1/events');
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookingSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setBookingMessage('');
    setBookingFailed(false);

    try {
      const response = await fetch('/api/v1/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ eventId: selectedEvent._id, quantity: Number(quantity) }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Booking failed');
      }

      setBookingMessage(`Booked ${quantity} ticket(s) for ${selectedEvent.title}`);
      setSelectedEvent(null);
      setQuantity(1);
      await fetchEvents();
    } catch (bookingError) {
      setBookingFailed(true);
      setBookingMessage(bookingError.message);
    }
  };

  // Client-side filtering on every render: no extra API request is made.
  const filteredEvents = events.filter((eventItem) =>
    eventItem.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={pageStyle}>
      <h1>Events</h1>

      <input
        style={{ padding: '8px', width: '280px', marginBottom: '16px' }}
        type="text"
        placeholder="Search events by title"
        value={searchText}
        onChange={(changeEvent) => setSearchText(changeEvent.target.value)}
      />

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: '#dc2626', fontWeight: 'bold' }}>Error: {error}</p>}
      {bookingMessage && (
        <p style={{ color: bookingFailed ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>{bookingMessage}</p>
      )}

      {selectedEvent && (
        <form style={formStyle} onSubmit={handleBookingSubmit}>
          <h3>Book: {selectedEvent.title}</h3>
          <label>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(changeEvent) => setQuantity(changeEvent.target.value)}
              required
            />
          </label>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <button type="submit">Confirm Booking</button>
            <button type="button" onClick={() => setSelectedEvent(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div style={gridStyle}>
        {!loading && !error && filteredEvents.length === 0 && <p>No events match your search.</p>}
        {filteredEvents.map((eventItem) => (
          <EventCard
            key={eventItem._id}
            title={eventItem.title}
            category={eventItem.category}
            date={eventItem.date}
            venue={eventItem.venue}
            ticketsAvailable={eventItem.ticketsAvailable}
            onSelect={() => {
              setSelectedEvent(eventItem);
              setQuantity(1);
              setBookingMessage('');
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
