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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-hive" element={<CreateHivePage />} />
          <Route path="/hive/:id" element={<HiveDetailPage />} />
          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/view-transactions" element={<PersonalJarPage />} />
          <Route path="/hive/:hiveId/add-expense" element={<AddExpensePage />} />
          <Route path="/hive/:hiveId/add-payment" element={<AddPaymentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;