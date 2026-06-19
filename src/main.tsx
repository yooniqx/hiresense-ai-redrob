import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';

// Import route components
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import CandidateDetails from './pages/CandidateDetails';
import Analytics from './pages/Analytics';
import JobDescription from './pages/JobDescription';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetails />} />
          <Route path="/add-candidate" element={<AddCandidate />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/job-description" element={<JobDescription />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

