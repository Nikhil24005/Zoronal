import { Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCompanyPage from './pages/AddCompanyPage';
import CompanyListPage from './pages/CompanyListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-6 sm:pb-10">
        <Routes>
          <Route path="/" element={<Navigate to="/companies" replace />} />
          <Route path="/companies" element={<CompanyListPage />} />
          <Route path="/add-company" element={<AddCompanyPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-ink">Page Not Found</h1>
                <p className="mt-3 text-sm text-slate-600">
                  The page you’re looking for does not exist or has been moved.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
