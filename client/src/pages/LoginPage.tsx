import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { api } from '../services/api';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  onLoginSuccess: (data: { token: string; restaurant: any; manager: any }) => void;
  onGoToRegister: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBackToLanding,
}) => {
  const [username, setUsername] = useState('demo_manager');
  const [pin, setPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Pre-warm server as soon as login page is loaded
  React.useEffect(() => {
    api.pingServer();
  }, []);

  // Show cold-start wake up message if login takes longer than 2.5 seconds
  React.useEffect(() => {
    let timer: any;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsWakingUp(true);
      }, 2500);
    } else {
      setIsWakingUp(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPin = pin.trim();

    if (!cleanUser || !cleanPin) {
      setErrorMsg('Please enter both username and PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login({ username: cleanUser, pin: cleanPin });
      if (res.success) {
        localStorage.setItem('swaad_token', res.token);
        if (res.restaurant) localStorage.setItem('swaad_restaurant', JSON.stringify(res.restaurant));
        if (res.manager) localStorage.setItem('swaad_manager', JSON.stringify(res.manager));
        onLoginSuccess({
          token: res.token,
          restaurant: res.restaurant,
          manager: res.manager
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#1B120C] text-[#FFF7ED] flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo variant="stacked" theme="dark" size={56} showTagline={false} />
        <p className="text-xs text-[#FF9E58] font-bold uppercase tracking-widest mt-3">
          Restaurant Manager Sign In
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#251A12] border border-white/[0.12] rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="e.g. demo_manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1">Manager PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  inputMode="numeric"
                  autoComplete="current-password"
                  maxLength={10}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs tracking-widest placeholder:text-stone-500 focus:border-brand-500 outline-none text-center font-bold text-lg"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {isWakingUp && (
                <div className="mt-2.5 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[11px] text-center flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping shrink-0" />
                  <span>Cloud server is waking up from sleep mode (~20-30s). Please hold on...</span>
                </div>
              )}
            </div>
          </form>

          {/* Demo account quick login helper */}
          <div className="mt-5 pt-5 border-t border-white/[0.08] text-center">
            <p className="text-[11px] text-stone-400">
              Demo Manager Credentials pre-filled:
            </p>
            <p className="text-xs font-mono font-bold text-[#FF9E58] mt-1">
              Username: demo_manager • PIN: 1234
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-stone-400">
            <button
              onClick={onBackToLanding}
              className="text-stone-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
            <button
              onClick={onGoToRegister}
              className="text-[#FF9E58] font-bold hover:underline transition-colors"
            >
              Register New Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
