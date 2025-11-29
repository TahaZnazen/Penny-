import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LoadingProvider } from "./contexts/LoadingContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ThunderEffect from "./pages/ThunderEffect/ThunderEffect";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home/Home"));
const SlotMachine = lazy(() => import("./pages/SlotMachine/SlotMachine"));

// Simple loading fallback (shows during lazy load)
const PageLoader = () => (
  <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: 'sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #333',
        borderTop: '3px solid #ffd700',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Loading...
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Thunder is the entry/loading page */}
              <Route path="/" element={<ThunderEffect />} />

              {/* Main pages */}
              <Route path="/home" element={<Home />} />
              <Route path="/slot-machine" element={<SlotMachine />} />

              {/* Catch-all redirect to entry */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </LoadingProvider>
    </ErrorBoundary>
  );
}

export default App;
