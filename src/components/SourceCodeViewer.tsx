/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, FileCode, Download, Info } from 'lucide-react';
import { vanillaSourceCode } from '../vanillaSourceCode';

export default function SourceCodeViewer() {
  const [activeTab, setActiveTab] = useState<'html' | 'admin' | 'css' | 'app' | 'adminJs'>('html');
  const [copied, setCopied] = useState(false);

  const files = {
    html: { name: '/index.html', code: vanillaSourceCode.indexHtml, type: 'html' },
    admin: { name: '/admin-demo.html', code: vanillaSourceCode.adminDemoHtml, type: 'html' },
    css: { name: '/css/style.css', code: vanillaSourceCode.styleCss, type: 'css' },
    app: { name: '/js/app.js', code: vanillaSourceCode.appJs, type: 'javascript' },
    adminJs: { name: '/js/admin.js', code: vanillaSourceCode.adminJs, type: 'javascript' }
  };

  const currentFile = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name.substring(currentFile.name.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="source-code-viewer" className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-full min-h-[550px]">
      {/* Code Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg">
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-white">Source Code Explorer</h2>
            <p className="text-xs text-slate-400">Pristine Vanilla HTML5, CSS3 & JavaScript for beginners</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-slate-950 px-2 flex overflow-x-auto border-b border-slate-800/60 scrollbar-none">
        {(Object.keys(files) as Array<keyof typeof files>).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => {
              setActiveTab(tabKey);
              setCopied(false);
            }}
            className={`px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
              activeTab === tabKey
                ? 'border-blue-500 text-blue-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {files[tabKey].name}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div className="relative flex-1 bg-slate-900 p-4 font-mono text-sm overflow-auto max-h-[500px]">
        <pre className="text-xs md:text-sm leading-relaxed text-slate-300">
          <code>{currentFile.code}</code>
        </pre>
      </div>

      {/* Footnote / Education Advice */}
      <div className="bg-slate-950 p-4.5 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">How to use this practice code:</span>
          <p className="mt-1 leading-relaxed">
            Create a local folder, save these 5 files into their corresponding directory paths (e.g. create a <code className="text-slate-300">css</code> folder for <code className="text-slate-300">style.css</code>, and a <code className="text-slate-300">js</code> folder for the scripts), and open <code className="text-slate-300">index.html</code> in any web browser to run this classic experience locally without any compile steps!
          </p>
        </div>
      </div>
    </div>
  );
}
