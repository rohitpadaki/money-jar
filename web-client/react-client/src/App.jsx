import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateHivePage from './pages/CreateHivePage';
import HiveDetailPage from './pages/HiveDetailPage';
import AddExpensePage from './pages/AddExpensePage';

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
          <Route path="/hive/:id/add-expense" element={<AddExpensePage />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;