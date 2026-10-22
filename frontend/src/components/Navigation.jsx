import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  padding: '12px 24px',
  background: '#1e293b',
};
const linkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' };
const buttonStyle = { marginLeft: 'auto', padding: '6px 12px', cursor: 'pointer' };

function Navigation() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>EventHub</span>
      {!auth.token && <Link style={linkStyle} to="/">Login</Link>}
      {auth.token && <Link style={linkStyle} to="/events">Events</Link>}
      {auth.token && <Link style={linkStyle} to="/my-tickets">My Tickets</Link>}
      {auth.role === 'organizer' && <Link style={linkStyle} to="/organizer">Organizer Panel</Link>}
      {auth.token && (
        <>
          <span style={{ color: '#cbd5e1', marginLeft: 'auto' }}>
            {auth.attendee?.email} ({auth.role})
          </span>
          <button style={{ ...buttonStyle, marginLeft: 0 }} onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navigation;
