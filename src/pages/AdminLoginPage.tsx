import React, { useState, useEffect } from 'react';
import { loginStaff, subscribeToStaffAuthState } from '../services/staffAuthService';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already authenticated and authorized
  useEffect(() => {
    const unsubscribe = subscribeToStaffAuthState((_user, profile) => {
      if (profile && profile.active && ['owner', 'admin', 'editor'].includes(profile.role)) {
        onNavigate('/admin');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your staff email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loginStaff(email, password);
      onNavigate('/admin');
    } catch (err: any) {
      console.error('Staff login error:', err);
      let userMsg = 'Invalid email or password. Please verify your credentials.';
      if (err.message?.includes('Access denied') || err.message?.includes('inactive') || err.message?.includes('missing')) {
        userMsg = err.message;
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        userMsg = 'Invalid email or password. Access restricted to authorized Lumora staff.';
      } else if (err.code === 'auth/too-many-requests') {
        userMsg = 'Too many failed attempts. Please wait a moment before trying again.';
      }
      setError(userMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#8C7355] border-t-transparent"></div>
          <p className="text-xs uppercase tracking-widest text-[#665E55] font-medium">Verifying Staff Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F7F3EC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#171513] text-[#F7F3EC] shadow-md mb-2">
          <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
        </div>
        
        <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C7355] bg-[#EBE5DA] px-3 py-1 rounded-full">
          Lumora Atelier Restricted
        </span>
        
        <h1 className="text-2xl sm:text-3xl font-serif text-[#171513] tracking-wide">
          Staff Portal Access
        </h1>
        <p className="text-xs text-[#665E55] max-w-xs mx-auto leading-relaxed">
          Authorized personnel authentication for Lumora owner, admin, and editor management console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 shadow-sm border border-[#E5DFD5] rounded-xl space-y-6">
          {error && (
            <div className="p-4 bg-[#FFF5F5] border-l-4 border-red-500 rounded-r-md text-xs text-red-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#171513] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7355]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tomiwaazeez019@gmail.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs text-[#171513] bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#171513] focus:border-[#171513] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#171513] mb-1.5">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7355]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs text-[#171513] bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#171513] focus:border-[#171513] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-xs uppercase tracking-widest font-semibold text-[#F7F3EC] bg-[#171513] hover:bg-[#2D2926] rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#171513] disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Atelier Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#F0EAE1] text-center">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-[#665E55] hover:text-[#171513] transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Return to Public Atelier Storefront</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-[#8C7355]">
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Protected by Lumora Role-Based Authorization</span>
          </p>
        </div>
      </div>
    </div>
  );
};
