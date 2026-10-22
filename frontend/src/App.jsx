import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import MyTicketsPage from './pages/MyTicketsPage.jsx';

// Loaded only when the /organizer route is visited (code splitting)
const OrganizerPanel = lazy(() => import('./pages/OrganizerPanel.jsx'));

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute requiredRole="organizer">
              <Suspense fallback={<p style={{ padding: '24px' }}>Loading organizer panel...</p>}>
                <OrganizerPanel />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
