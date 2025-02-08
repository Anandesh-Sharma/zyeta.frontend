import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IconSidebar } from './components/layout/icon-sidebar';
import { ChatPage } from './pages/chat';
import { BillingPage } from './pages/billing';
import { AgentStorePage } from './pages/agent-store';
import { MyAgentsPage } from './pages/agent-store/my-agents';
import { PublishedAgentsPage } from './pages/agent-store/published';
import { MainLayout } from './components/layout/main-layout';
import { useState, useEffect, useRef } from 'react';
import { useUI } from './lib/hooks/use-ui';
import { useOrganizations } from './lib/hooks/use-organizations/use-organizations';
import { useConversations } from './lib/hooks/use-conversations';
import { Loader } from './components/ui/loader';

function App() {
  const toggleSearch = useUI('isSearchOpen', 'set');
  const { fetchOrganizations } = useOrganizations();
  const { fetchConversations } = useConversations();
  const [isLoading, setIsLoading] = useState(true);
  const initializationRef = useRef<Promise<void>>();

  console.log("App");
  // Initialize app only once
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = (async () => {
        try {
          setIsLoading(true);
          await fetchOrganizations();
          await fetchConversations();
        } catch (err) {
          console.error('Failed to initialize app:', err);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []); // Empty dependency array since we use ref to track initialization

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch(prev => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleSearch]);

  if (isLoading) {
    return <Loader fullScreen size="lg" />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background relative">
        <IconSidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/agent-store" element={<MainLayout><AgentStorePage /></MainLayout>} />
          <Route path="/agent-store/my-agents" element={<MainLayout><MyAgentsPage /></MainLayout>} />
          <Route path="/agent-store/published" element={<MainLayout><PublishedAgentsPage /></MainLayout>} />
          <Route
            path="/billing/*"
            element={
              <MainLayout>
                <BillingPage />
              </MainLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;