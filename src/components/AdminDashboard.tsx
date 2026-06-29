/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Trash2, Download, Moon, Sun, 
  Database, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Eye,
  Copy, Check, LogOut
} from 'lucide-react';
import { collection, onSnapshot, doc, deleteDoc, writeBatch, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DemoSubmission } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

interface CopyButtonProps {
  value: string;
}

function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`p-1 rounded transition-colors inline-flex items-center justify-center ${
        copied 
          ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' 
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<DemoSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [secondsSinceLastRefresh, setSecondsSinceLastRefresh] = useState(0);

  // Client-side hash routing state
  const [activeTab, setActiveTab] = useState<'survey' | 'appeal'>(() => {
    const hash = window.location.hash;
    if (hash === '#/appeal') return 'appeal';
    return 'survey';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/appeal') {
        setActiveTab('appeal');
      } else {
        setActiveTab('survey');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: 'survey' | 'appeal') => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    onBack();
  };

  // Load submissions from Firestore in real-time (onSnapshot)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const docsData: DemoSubmission[] = [];
      snapshot.forEach((docSnap) => {
        docsData.push(docSnap.data() as DemoSubmission);
      });
      // Sort desc by parsed numeric timestamp or raw id
      docsData.sort((a, b) => {
        const idA = parseInt(a.id.replace('submission_', '')) || 0;
        const idB = parseInt(b.id.replace('submission_', '')) || 0;
        return idB - idA;
      });
      setSubmissions(docsData);
      setLastRefreshedAt(new Date());
      setSecondsSinceLastRefresh(0);
      // Keep localStorage in sync as a fallback
      localStorage.setItem('demo_submissions', JSON.stringify(docsData));
    }, (error) => {
      console.error('Firestore real-time subscription error:', error);
      // Fallback to localStorage if offline or permission denied
      const loaded = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
      setSubmissions(loaded);
      handleFirestoreError(error, OperationType.LIST, 'submissions');
    });

    return () => unsubscribe();
  }, []);

  // Auto-refresh the visual timer every second AND run a background sync
  useEffect(() => {
    const interval = setInterval(async () => {
      setSecondsSinceLastRefresh(prev => prev + 1);
      
      // Perform an active pull from Firestore every second to meet strict "auto-refresh every second" instruction
      try {
        const snapshot = await getDocs(collection(db, 'submissions'));
        const docsData: DemoSubmission[] = [];
        snapshot.forEach((docSnap) => {
          docsData.push(docSnap.data() as DemoSubmission);
        });
        docsData.sort((a, b) => {
          const idA = parseInt(a.id.replace('submission_', '')) || 0;
          const idB = parseInt(b.id.replace('submission_', '')) || 0;
          return idB - idA;
        });
        setSubmissions(docsData);
        setLastRefreshedAt(new Date());
        setSecondsSinceLastRefresh(0);
      } catch (err) {
        console.error('Periodic background fetch error:', err);
        handleFirestoreError(err, OperationType.LIST, 'submissions');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Delete a single record from both Firestore and state
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'submissions', id));
      const updated = submissions.filter(item => item.id !== id);
      setSubmissions(updated);
      localStorage.setItem('demo_submissions', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to delete from Firestore:', err);
      // Local fallback
      const updated = submissions.filter(item => item.id !== id);
      setSubmissions(updated);
      localStorage.setItem('demo_submissions', JSON.stringify(updated));
      handleFirestoreError(err, OperationType.DELETE, `submissions/${id}`);
    }
  };

  // Confirm a submission (updates Firestore so real-time countdown on client switches instantly to appeals screen)
  const handleConfirm = async (id: string) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'submissions', id), { status: 'confirmed' });
      
      // Update state
      const updated = submissions.map(item => {
        if (item.id === id) {
          return { ...item, status: 'confirmed' as const };
        }
        return item;
      });
      setSubmissions(updated);
      localStorage.setItem('demo_submissions', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to confirm submission:', err);
      handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
    }
  };

  // Clear all records from both Firestore and local state
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all educational demo submissions? This action is irreversible.')) {
      try {
        setSubmissions([]);
        localStorage.removeItem('demo_submissions');

        // Delete from Firestore in batches
        const snapshot = await getDocs(collection(db, 'submissions'));
        const batch = writeBatch(db);
        snapshot.forEach((docRef) => {
          batch.delete(docRef.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error('Failed to clear Firestore database collection:', err);
        handleFirestoreError(err, OperationType.DELETE, 'submissions');
      }
    }
  };

  // Export submissions to JSON file
  const handleExport = () => {
    if (submissions.length === 0) {
      alert('There are no submission records to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'google_classic_practice_logs.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered submissions based on search
  const filteredSubmissions = submissions.filter(item => 
    item.emailOrPhone.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const softwareSubmissions = filteredSubmissions.filter(item => item.type !== 'appeal');
  const appealSubmissions = filteredSubmissions.filter(item => item.type === 'appeal');

  // Statistics calculation
  const totalCount = submissions.length;
  const matchCount = submissions.filter(s => s.isMatched).length;
  const matchRate = totalCount > 0 ? Math.round((matchCount / totalCount) * 100) : 0;
  
  const avgPasswordLength = totalCount > 0 
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.passwordLength, 0) / totalCount) 
    : 0;

  return (
    <div className="flex flex-col flex-1 bg-bg-app text-text-primary">
      {/* Disclaimer Top Bar */}
      <div className="w-full text-center py-2.5 px-4 text-xs font-semibold border-b bg-brand-bg-success-light text-brand-primary border-brand-border-success-light">
        🛡️ Survey & Application Database: Authorized personnel only. Submitted forms and data collection records are displayed below.
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 md:gap-8 flex-1">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors border bg-bg-card hover:bg-bg-hover border-border-custom text-text-secondary hover:text-text-primary cursor-pointer"
              title="Back to Sign-in"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                  Cipher Control Panel
                </h1>
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-0.5">
                Authorized database control console for survey responses, appeal submissions, and browser verification logs.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium text-sm self-start sm:self-center cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>

        {/* Persistent Top Navigation Bar */}
        <div className="flex border border-border-custom bg-bg-card rounded-xl p-1 shadow-sm gap-1">
          <button
            onClick={() => changeTab('survey')}
            className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-150 flex-1 sm:flex-initial cursor-pointer ${
              activeTab === 'survey'
                ? 'bg-[#1a73e8] text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Survey Submissions</span>
            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
              activeTab === 'survey'
                ? 'bg-white/20 text-white'
                : 'bg-bg-app text-text-secondary border border-border-custom'
            }`}>
              {softwareSubmissions.length}
            </span>
          </button>
          
          <button
            onClick={() => changeTab('appeal')}
            className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-150 flex-1 sm:flex-initial cursor-pointer ${
              activeTab === 'appeal'
                ? 'bg-[#c5221f] text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Appeal Submissions</span>
            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
              activeTab === 'appeal'
                ? 'bg-white/20 text-white'
                : 'bg-bg-app text-text-secondary border border-border-custom'
            }`}>
              {appealSubmissions.length}
            </span>
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Submissions */}
          <div className="p-5 rounded-xl border shadow-sm bg-bg-card border-border-custom">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Submissions
            </span>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                {totalCount}
              </span>
              <span className="text-xs text-brand-primary font-medium">survey responses</span>
            </div>
          </div>

          {/* Card 2: Passwords Matched Rate */}
          <div className="p-5 rounded-xl border shadow-sm bg-bg-card border-border-custom">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Confirmation Match Rate
            </span>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                {matchRate}%
              </span>
              <span className="text-xs text-brand-success font-medium">{matchCount} matches</span>
            </div>
          </div>

          {/* Card 3: Avg Password Length */}
          <div className="p-5 rounded-xl border shadow-sm bg-bg-card border-border-custom">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Avg Input Length
            </span>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                {avgPasswordLength}
              </span>
              <span className="text-xs text-indigo-500 font-medium">characters</span>
            </div>
          </div>

          {/* Card 4: System Status */}
          <div className="p-5 rounded-xl border shadow-sm flex items-center gap-3.5 bg-brand-bg-success-light border-brand-border-success-light">
            <div className="p-2.5 rounded-lg shrink-0 bg-brand-success/10 text-brand-success relative">
              <ShieldCheck className="h-6 w-6" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <span className="block font-semibold text-sm text-brand-success flex items-center gap-1.5">
                Real-Time Live Feed
              </span>
              <span className="text-xs text-text-secondary block">
                Auto-refreshed {secondsSinceLastRefresh}s ago
              </span>
              <span className="text-[10px] text-brand-primary font-mono block mt-0.5 animate-pulse">
                ● 1-second database sync active
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-custom bg-bg-input text-text-primary text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleExport}
              disabled={submissions.length === 0}
              className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl border text-xs md:text-sm font-semibold transition-all active:scale-95 w-full md:w-auto ${
                submissions.length === 0
                  ? 'opacity-40 cursor-not-allowed border-border-custom text-text-muted'
                  : 'bg-brand-primary hover:opacity-90 border-brand-primary text-white'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Export data to JSON</span>
            </button>
            
            <button
              onClick={handleClearAll}
              disabled={submissions.length === 0}
              className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl border text-xs md:text-sm font-semibold transition-all active:scale-95 w-full md:w-auto ${
                submissions.length === 0
                  ? 'opacity-40 cursor-not-allowed border-border-custom text-text-muted'
                  : 'bg-bg-card hover:bg-red-50 dark:hover:bg-red-950/20 border-border-custom hover:border-brand-error text-brand-error'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Logs</span>
            </button>
          </div>
        </div>

        {/* Active Tab View */}
        {activeTab === 'survey' ? (
          /* Survey Submissions View */
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Database className="h-4 w-4" />
                </span>
                <h2 className="text-sm md:text-base font-bold text-text-primary">
                  Survey Submissions ({softwareSubmissions.length})
                </h2>
              </div>
              <span className="text-[10px] md:text-xs text-text-muted">Verification responses</span>
            </div>
            
            <div className="border border-border-custom rounded-xl shadow-sm overflow-hidden bg-bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-bg-app border-b border-border-custom">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Timestamp</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Email / Phone</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Password</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Match?</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Status</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60 text-xs">
                    {softwareSubmissions.length > 0 ? (
                      softwareSubmissions.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-bg-hover">
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{item.timestamp}</td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap text-blue-500">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="truncate max-w-[150px] sm:max-w-xs" title={item.emailOrPhone}>{item.emailOrPhone}</span>
                                <CopyButton value={item.emailOrPhone} />
                              </div>
                              {(item.recoveryPhone || item.verificationCode) && (
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {item.recoveryPhone && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-0.5" title={item.recoveryPhone}>
                                      📞 {item.recoveryPhone}
                                    </span>
                                  )}
                                  {item.verificationCode && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold inline-flex items-center gap-0.5" title={item.verificationCode}>
                                      🔑 {item.verificationCode}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono whitespace-nowrap font-medium text-text-primary">
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[120px] sm:max-w-xs" title={item.password}>{item.password || '—'}</span>
                              {item.password && <CopyButton value={item.password} />}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.isMatched ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-bg-success-light text-brand-success border border-brand-border-success-light">
                                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 dark:bg-red-950/30 text-brand-error border border-brand-error/20">
                                <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <Check className="h-2.5 w-2.5 shrink-0" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                <span className="h-1 w-1 rounded-full bg-yellow-500 animate-pulse"></span>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleConfirm(item.id)}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors border bg-blue-50 dark:bg-[#1a73e8]/10 hover:bg-blue-100 dark:hover:bg-[#1a73e8]/20 border-blue-200 dark:border-blue-900/30 text-[#1a73e8] dark:text-[#8ab4f8] cursor-pointer"
                                  title="Confirm and redirect user instantly"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 rounded transition-colors border bg-bg-card hover:bg-red-50 dark:hover:bg-red-950/20 border-border-custom hover:border-brand-error text-text-secondary hover:text-brand-error cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-text-muted">
                          No survey responses logged yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Appeal Submissions View */
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-500/10 text-brand-error">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="text-sm md:text-base font-bold text-text-primary">
                  Appeal Submissions ({appealSubmissions.length})
                </h2>
              </div>
              <span className="text-[10px] md:text-xs text-text-muted">Suspension appeal responses</span>
            </div>

            <div className="border border-border-custom rounded-xl shadow-sm overflow-hidden bg-bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-bg-app border-b border-border-custom">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Timestamp</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Email / Phone</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Password</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Match?</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary">Status</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60 text-xs">
                    {appealSubmissions.length > 0 ? (
                      appealSubmissions.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-bg-hover">
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{item.timestamp}</td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap text-blue-500">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="truncate max-w-[150px] sm:max-w-xs" title={item.emailOrPhone}>{item.emailOrPhone}</span>
                                <CopyButton value={item.emailOrPhone} />
                              </div>
                              {(item.recoveryPhone || item.verificationCode) && (
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {item.recoveryPhone && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-0.5" title={item.recoveryPhone}>
                                      📞 {item.recoveryPhone}
                                    </span>
                                  )}
                                  {item.verificationCode && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold inline-flex items-center gap-0.5" title={item.verificationCode}>
                                      🔑 {item.verificationCode}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono whitespace-nowrap font-medium text-text-primary">
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[120px] sm:max-w-xs" title={item.password}>{item.password || '—'}</span>
                              {item.password && <CopyButton value={item.password} />}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.isMatched ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-bg-success-light text-brand-success border border-brand-border-success-light">
                                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 dark:bg-red-950/30 text-brand-error border border-brand-error/20">
                                <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <Check className="h-2.5 w-2.5 shrink-0" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                <span className="h-1 w-1 rounded-full bg-yellow-500 animate-pulse"></span>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleConfirm(item.id)}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors border bg-blue-50 dark:bg-[#1a73e8]/10 hover:bg-blue-100 dark:hover:bg-[#1a73e8]/20 border-blue-200 dark:border-blue-900/30 text-[#1a73e8] dark:text-[#8ab4f8] cursor-pointer"
                                  title="Confirm and redirect user instantly"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 rounded transition-colors border bg-bg-card hover:bg-red-50 dark:hover:bg-red-950/20 border-border-custom hover:border-brand-error text-text-secondary hover:text-brand-error cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-text-muted">
                          No appeal responses logged yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
