import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { api } from '../services/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !pin) {
      setErrorMsg('Please enter both username and PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login({ username: username.trim(), pin });
      if (res.success) {
        localStorage.setItem('swaad_token', res.token);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-3xl shadow-glow mx-auto mb-3">
          🍛
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Swaad Sevak
        </h2>
        <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mt-0.5">
          Restaurant Manager Sign In
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. demo_manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Manager PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs tracking-widest placeholder:text-slate-600 focus:border-orange-500 outline-none text-center font-bold text-lg"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-glow transition-all disabled:opacity-50"
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
            </div>
          </form>

          {/* Demo account quick login helper */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Manager Credentials pre-filled:
            </p>
            <p className="text-xs font-mono font-bold text-amber-400 mt-1">
              Username: demo_manager • PIN: 1234
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onBackToLanding}
              className="text-slate-400 hover:text-slate-200"
            >
              ← Back to Home
            </button>
            <button
              onClick={onGoToRegister}
              className="text-orange-400 font-bold hover:underline"
            >
              Register New Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
