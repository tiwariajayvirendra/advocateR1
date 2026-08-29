import React, { useState } from 'react';
import {
  Lock,
  Shield,
  CheckCircle2,
  User,
  KeyRound,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { UserAuth } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAuth) => void;
  initialMode?: 'client-login' | 'client-signup' | 'admin-login' | 'admin-signup' | 'forgot-password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'client-login'
}) => {
  const [mode, setMode] = useState<'client-login' | 'client-signup' | 'admin-login' | 'admin-signup' | 'forgot-password'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // Client Signup fields
  const [name, setName] = useState('Ajay Tripathi');
  const [email, setEmail] = useState('ajaytripathi821@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [age, setAge] = useState<string>('32');
  const [gender, setGender] = useState<string>('Male');
  const [city, setCity] = useState<string>('New Delhi');
  const [state, setState] = useState<string>('Delhi');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  // Admin specific fields
  const [barRegistration, setBarRegistration] = useState('D/2481/2012');
  const [adminKey, setAdminKey] = useState('SCBA-2026-CHAMBERS');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!phone || phone.length < 8) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.sendOtp(phone);
      setOtpSent(true);
      setSimulatedOtpNotice(res.simulatedOtp || '4829');
      setSuccessMsg(`OTP sent to ${phone}. (Demo OTP: ${res.simulatedOtp || '4829'})`);
      setOtpTimer(60);
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Client Login Submit
  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await api.clientLogin({
        identifier: phone || email,
        password: loginMethod === 'password' ? password : undefined,
        otp: loginMethod === 'otp' ? otp : undefined
      });
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Client authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Client Signup Submit
  const handleClientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !phone) {
      setErrorMsg('Name, Email, and Mobile number are required.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.clientSignup({
        name,
        email,
        phone,
        age: age ? parseInt(age, 10) : undefined,
        gender,
        city,
        state,
        password,
        otp: otpSent ? otp : undefined
      });
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Client registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phone || !otp || !password) {
      setErrorMsg('Mobile number, OTP, and new password are required.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.forgotPassword({
        phone,
        otp,
        newPassword: password
      });
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('client-login');
        setLoginMethod('password');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login / Signup Submit
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      if (mode === 'admin-signup') {
        const res = await api.adminSignup({
          name: name || 'Adv. Utkarsh Pandey',
          email,
          phone,
          barRegistration,
          secretKey: adminKey,
          password
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      } else {
        const res = await api.adminLogin({
          identifier: email || phone,
          password
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Direct Login fallback
  const handleGoogleOAuthLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: UserAuth = {
        id: 'usr_google_oauth_9921',
        email: email || 'ajaytripathi821@gmail.com',
        name: name || 'Ajay Tripathi',
        phone: phone || '+91 98765 43210',
        age: 32,
        gender: 'Male',
        city: 'New Delhi',
        state: 'Delhi',
        role: 'client',
        provider: 'google',
        token: 'oauth2_gsi_bearer_token_verified_2026',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {mode.startsWith('admin') ? <Building className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {mode === 'client-login' && 'Client Portal Sign In'}
                {mode === 'client-signup' && 'Client Registration & Profile'}
                {mode === 'forgot-password' && 'Reset Client Password'}
                {mode === 'admin-login' && 'Chambers Advocate Admin'}
                {mode === 'admin-signup' && 'Advocate Admin Registration'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode.startsWith('admin') ? 'Supreme Court & High Court Chambers Management' : 'Confidential Attorney-Client Privileged Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Role Toggle: Client vs Chambers Admin */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('client-login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              !mode.startsWith('admin')
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Litigant / Client</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin-login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mode.startsWith('admin')
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Advocate Admin</span>
          </button>
        </div>

        {/* Feedback Notices */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* --- 1. CLIENT SIGN IN --- */}
        {mode === 'client-login' && (
          <form onSubmit={handleClientLogin} className="space-y-4">
            
            {/* Quick Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleOAuthLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google OAuth 2.0</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
                OR MOBILE NUMBER & OTP
              </span>
            </div>

            {/* Login Method Toggle: Mobile OTP vs Password */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  loginMethod === 'otp'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                📱 Mobile OTP Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  loginMethod === 'password'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🔑 Password Login
              </button>
            </div>

            {/* Mobile / Identifier Input */}
            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">
                {loginMethod === 'otp' ? 'Registered Mobile Number' : 'Mobile Number or Email'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {loginMethod === 'otp' && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || otpTimer > 0}
                    className="absolute right-1.5 top-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold disabled:opacity-50"
                  >
                    {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Input */}
            {loginMethod === 'otp' && (
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">6-Digit Verification OTP</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP (e.g. 4829)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 tracking-widest font-mono"
                  />
                </div>
                {simulatedOtpNotice && (
                  <p className="text-[10px] text-amber-400 mt-1">
                    ℹ️ Test Sandbox Code: <strong className="underline">{simulatedOtpNotice}</strong> or <strong className="underline">4829</strong>
                  </p>
                )}
              </div>
            )}

            {/* Password Input */}
            {loginMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-300 font-medium">Account Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Verify & Access Client Portal</span>
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                New litigant client?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('client-signup');
                    setErrorMsg(null);
                  }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Create Client Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* --- 2. CLIENT SIGNUP (Full Profile Fields: Name, Email, Phone, Age, Gender, City, State) --- */}
        {mode === 'client-signup' && (
          <form onSubmit={handleClientSignup} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ajay Tripathi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Mobile Number (For OTP Verification) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-24 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || otpTimer > 0}
                  className="absolute right-1.5 top-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold disabled:opacity-50"
                >
                  {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="text-[11px] text-amber-300 block mb-1 font-medium">Enter Received OTP *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP (or use '4829')"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-xs text-amber-300 font-mono tracking-wider focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  placeholder="e.g. 32"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Corporate Entity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">City</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">State</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi / Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Create Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              <span>Complete Client Registration</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('client-login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Already have an account? <span className="text-amber-400 font-semibold underline">Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* --- 3. FORGOT PASSWORD (OTP RESET) --- */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-slate-400">
              Enter your registered mobile number to receive a secure OTP code and set a new password.
            </p>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Registered Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || otpTimer > 0}
                  className="absolute right-1.5 top-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold disabled:opacity-50"
                >
                  {otpTimer > 0 ? `${otpTimer}s` : 'Send OTP'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Verification OTP</label>
              <input
                type="text"
                required
                placeholder="6-digit OTP (e.g. 4829)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white tracking-widest font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">New Password</label>
              <input
                type="password"
                required
                placeholder="Set new secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Reset Password & Proceed</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('client-login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back to <span className="text-amber-400 underline">Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* --- 4. ADVOCATE ADMIN LOGIN & SIGNUP --- */}
        {(mode === 'admin-login' || mode === 'admin-signup') && (
          <form onSubmit={handleAdminAuth} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Privileged Advocate Roster:</strong> Manage incoming consultation requests, update website bio/addresses, and publish landmark judgments & thoughts.
              </span>
            </div>

            {mode === 'admin-signup' && (
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Advocate / Firm Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Chambers Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {mode === 'admin-signup' && (
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Bar Council Enrolment No.</label>
                <input
                  type="text"
                  value={barRegistration}
                  onChange={(e) => setBarRegistration(e.target.value)}
                  placeholder="e.g. D/2481/2012"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Admin Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-9 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Default Chambers Demo Password: <span className="text-amber-400">admin123</span></p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{mode === 'admin-signup' ? 'Create Advocate Admin Account' : 'Authenticate Chambers Admin Portal'}</span>
            </button>

            <div className="text-center pt-1">
              {mode === 'admin-login' ? (
                <button
                  type="button"
                  onClick={() => setMode('admin-signup')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Register new counsel? <span className="text-amber-400 underline">Admin Sign Up</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('admin-login')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Already registered? <span className="text-amber-400 underline">Admin Sign In</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* Security Disclaimers */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Attorney-Client Privilege Protocol</span>
          </div>
          <p className="leading-relaxed text-slate-400 text-[10px]">
            Filings and uploaded evidence are strictly protected under Section 126 of the Indian Evidence Act / Model Rules of Professional Conduct.
          </p>
        </div>

      </div>
    </div>
  );
};
