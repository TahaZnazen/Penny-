import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingProvider } from "./contexts/LoadingContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import ThunderEffect from "./pages/ThunderEffect/ThunderEffect";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home/Home"));
const SlotMachine = lazy(() => import("./pages/SlotMachine/SlotMachine"));

// Preload components in the background after initial render
const preloadComponents = () => {
  // Preload Home after a short delay to not block initial render
  setTimeout(() => {
    import("./pages/Home/Home");
    import("./pages/SlotMachine/SlotMachine");
  }, 1000);
};

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

// Animated Routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Thunder is the entry/loading page */}
        <Route path="/" element={
          <PageTransition>
            <ThunderEffect />
          </PageTransition>
        } />

        {/* Main pages */}
        <Route path="/home" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/slot-machine" element={
          <PageTransition>
            <SlotMachine />
          </PageTransition>
        } />

        {/* Catch-all redirect to entry */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Preload other pages in background after initial mount
  useEffect(() => {
    preloadComponents();
  }, []);

  return (
    <ErrorBoundary>
      <LoadingProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </Router>
      </LoadingProvider>
    </ErrorBoundary>
  );
}

export default App;
