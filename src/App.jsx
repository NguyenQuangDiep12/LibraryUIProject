import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Statistics from './components/Statistics';
import { ToastProvider } from './contexts/ToastContext';
import { Role } from './constants/constants';
import BorrowReturn from './components/borrow-return/BorrowReturn';
import BookManagement from './components/books/BookManagement';
import CategoryManagement from './components/categories/CategoryManagement';
import AuthorManagement from './components/authors/AuthorManagement';
import PublisherManagement from './components/publishers/PublisherManagement';
import ReaderManagement from './components/users/ReaderManagement';
import FineManagement from './components/fines/FineManagement';
import ReservationManagement from './components/reservation/ReservationManagement';
import StaffManagement from './components/users/StaffManagement';
import Profile from './components/profiles/Profile';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>}>
          <Route path="statistics" element={<Statistics/>}/>
          <Route path="borrow" element={<BorrowReturn/>}/>
          <Route path="book-management" element={<BookManagement/>}/>
          <Route path="category" element={<CategoryManagement/>} />
          <Route path="author" element={<AuthorManagement/>} />
          <Route path="publisher" element={<PublisherManagement/>}/>
          <Route path="reader" element={<ReaderManagement/>}/>
          <Route path="fine" element={<FineManagement/>}/>
          <Route path="reservation" element={<ReservationManagement/>}/>
          <Route path="staff" element={<StaffManagement/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </ToastProvider>
  )
}

export default App
