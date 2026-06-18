import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ThreatAnalysisPage from './pages/ThreatAnalysisPage';
import GraphPage from './pages/GraphPage';
import ResearchPage from './pages/ResearchPage';
import ReportPage from './pages/ReportPage';
import KnowledgePage from './pages/KnowledgePage';
import VivaPage from './pages/VivaPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/console" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analysis" element={<ThreatAnalysisPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="assistant" element={<KnowledgePage />} />
          <Route path="viva" element={<VivaPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

