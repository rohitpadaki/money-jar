import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateHivePage from './pages/CreateHivePage';
import HiveDetailPage from './pages/HiveDetailPage';
import AddTransactionPage from './pages/AddTransactionPage';
import PersonalJarPage from './pages/PersonalJarPage';
import AddExpensePage from './pages/AddExpensePage';
import AddPaymentPage from './pages/AddPaymentPage';
import SettleUpPage from './pages/SettleUpPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/create-hive" element={
            <ProtectedRoute>
              <CreateHivePage />
            </ProtectedRoute>
          } />
          <Route path="/hive/:id" element={
            <ProtectedRoute>
              <HiveDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/add-transaction" element={
            <ProtectedRoute>
              <AddTransactionPage />
            </ProtectedRoute>
          } />
          <Route path="/view-transactions" element={
            <ProtectedRoute>
              <PersonalJarPage />
            </ProtectedRoute>
          } />
          <Route path="/hive/:hiveId/add-expense" element={
            <ProtectedRoute>
              <AddExpensePage />
            </ProtectedRoute>
          } />
          <Route path="/hive/:hiveId/add-payment" element={
            <ProtectedRoute>
              <AddPaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/hive/:id/settle-up" element={
            <ProtectedRoute>
              <SettleUpPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;