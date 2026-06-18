import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import DetailBookPage from './pages/DetailBookPage';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ComplaintPolicy from './pages/ComplainPolicy';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy load feature containers for clean separation
const StatisticsContent = lazy(() => import('./components/StatisticsContent'));
const BorrowContainer = lazy(() => import('./features/borrow/BorrowContainer'));
const BookContainer = lazy(() => import('./features/books/BookContainer'));
const CategoryContainer = lazy(() => import('./features/categories/CategoryContainer'));
const AuthorContainer = lazy(() => import('./features/authors/AuthorContainer'));
const PublisherContainer = lazy(() => import('./features/publishers/PublisherContainer'));
const ReaderContainer = lazy(() => import('./features/readers/ReaderContainer'));
const FineContainer = lazy(() => import('./features/fines/FineContainer'));
const ReservationContainer = lazy(() => import('./features/reservations/ReservationContainer'));
const StaffContainer = lazy(() => import('./features/staff/StaffContainer'));
const ProfileContainer = lazy(() => import('./features/profiles/ProfileContainer'));
const NotificationContainer = lazy(() => import('./features/notifications/NotificationContainer'));

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<DetailBookPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/complain" element={<ComplaintPolicy />} />
        
        {/* Protected Dashboard Layout and Subroutes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
          <Route index element={<StatisticsContent />} />
          <Route path="statistics" element={<StatisticsContent />} />
          <Route path="borrow" element={<BorrowContainer />} />
          <Route path="books" element={<BookContainer />} />
          <Route path="category" element={<CategoryContainer />} />
          <Route path="author" element={<AuthorContainer />} />
          <Route path="publisher" element={<PublisherContainer />} />
          <Route path="reader" element={<ReaderContainer />} />
          <Route path="fine" element={<FineContainer />} />
          <Route path="reservation" element={<ReservationContainer />} />
          <Route path="notifications" element={<NotificationContainer />} />
          <Route path="staff" element={<StaffContainer />} />
          <Route path="profile" element={<ProfileContainer />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
