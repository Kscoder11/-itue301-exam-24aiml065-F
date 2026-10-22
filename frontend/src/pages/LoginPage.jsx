import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const pageStyle = { maxWidth: '360px', margin: '48px auto', padding: '0 16px' };
const inputStyle = { width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' };
const buttonStyle = { padding: '8px 16px', cursor: 'pointer' };

function LoginPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Login failed');
      }

      login({ attendee: responseData.attendee, token: responseData.token, role: responseData.role });
      navigate('/events');
    } catch (loginError) {
      setErrorMessage(loginError.message);
    }
  };

  return (
    <div style={pageStyle}>
      <h1>Login to EventHub</h1>
      <form onSubmit={handleLoginSubmit}>
        <input
          style={inputStyle}
          type="email"
          placeholder="Enter your email (use 'organizer' in it for organizer role)"
          value={email}
          onChange={(changeEvent) => setEmail(changeEvent.target.value)}
          required
        />
        <button style={buttonStyle} type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: '#dc2626' }}>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
