/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewType } from './types';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import SourceCodeViewer from './components/SourceCodeViewer';
import { ShieldCheck, Code, Settings, Server, Terminal } from 'lucide-react';

export default function App() {
  // Simple router detecting window.location.pathname
  const [view, setView] = useState<ViewType>('login');
  const [showNotification, setShowNotification] = useState(false);

  // Initialize view from URL path
  useEffect(() => {
    const path = window.location.pathname;
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';

    if (path === '/cipher') {
      if (isAuth) {
        setView('admin');
      } else {
        setView('login');
        window.history.replaceState({ view: 'login' }, '', '/');
      }
    } else if (path === '/code') {
      setView('code');
    } else {
      setView('login');
    }

    // Set up popstate listener for back/forward navigation
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const currentAuth = localStorage.getItem('admin_authenticated') === 'true';

      if (currentPath === '/cipher') {
        if (currentAuth) {
          setView('admin');
        } else {
          setView('login');
          window.history.replaceState({ view: 'login' }, '', '/');
        }
      } else if (currentPath === '/code') {
        setView('code');
      } else {
        setView('login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update view and modify browser URL dynamically without full page reload
  const navigateTo = (newView: ViewType) => {
    setView(newView);
    const targetPath = newView === 'admin' ? '/cipher' : newView === 'code' ? '/code' : '/';
    window.history.pushState({ view: newView }, '', targetPath);
  };

  const handleLoginSuccess = () => {
    // Plain login success handler with no unrequested notifications or logs displayed
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-text-primary bg-bg-app">


      {/* Primary Workspace View Area */}
      <main className="flex-1 flex flex-col">
        {view === 'login' && (
          <LoginView 
            onSuccess={handleLoginSuccess} 
            onNavigate={(targetView) => navigateTo(targetView)} 
          />
        )}
        
        {view === 'admin' && (
          <AdminDashboard 
            onBack={() => navigateTo('login')} 
          />
        )}

        {view === 'code' && (
          <div className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full h-full my-auto">
              <div className="mb-6 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  <span className="font-bold text-sm tracking-tight text-white">Vanilla JavaScript Practice Files</span>
                </div>
                <button
                  onClick={() => navigateTo('login')}
                  className="text-xs text-slate-400 hover:text-white underline font-semibold"
                >
                  Return to interactive form
                </button>
              </div>
              <SourceCodeViewer />
            </div>
          </div>
        )}
      </main>

      {/* Global Sandbox Footer */}
      <footer className="bg-bg-footer border-t border-border-footer py-6 px-6 text-center text-xs text-text-secondary flex items-center justify-center gap-6 select-none font-sans mt-auto">
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors hover:underline">Privacy</a>
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors hover:underline">Terms</a>
        <a href="https://support.google.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors hover:underline">Help</a>
        <a href="https://about.google" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors hover:underline">About</a>
      </footer>
    </div>
  );
}
