import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Unlink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../../services/api';

interface WhatsAppDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (connected: boolean, phoneNumber?: string) => void;
}

export const WhatsAppDeviceModal: React.FC<WhatsAppDeviceModalProps> = ({
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [status, setStatus] = useState<'DISCONNECTED' | 'INITIALIZING' | 'QR_READY' | 'CONNECTED'>('DISCONNECTED');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; msg: string; success?: boolean } | null>(null);
  const [pollInterval, setPollInterval] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.getWhatsAppStatus();
      if (res.success && res.data) {
        setStatus(res.data.status);
        if (res.data.phoneNumber) setPhoneNumber(res.data.phoneNumber);
        if (res.data.qrCodeDataUrl) setQrCodeDataUrl(res.data.qrCodeDataUrl);
        if (onStatusChange) {
          onStatusChange(res.data.status === 'CONNECTED', res.data.phoneNumber);
        }
      }
    } catch (err) {
      console.error('Failed to get WhatsApp status:', err);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await api.connectWhatsApp();
      if (res.success && res.data) {
        setStatus(res.data.status);
        if (res.data.qrCodeDataUrl) setQrCodeDataUrl(res.data.qrCodeDataUrl);
      }
    } catch (err: any) {
      console.error('Failed to initiate WhatsApp pairing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to unlink this WhatsApp device? Automated campaigns will be paused until re-linked.')) {
      return;
    }
    setIsLoading(true);
    try {
      await api.disconnectWhatsApp();
      setStatus('DISCONNECTED');
      setPhoneNumber(null);
      setQrCodeDataUrl(null);
      if (onStatusChange) onStatusChange(false);
    } catch (err: any) {
      alert(err.message || 'Failed to disconnect.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim()) return;

    setTestStatus({ loading: true, msg: 'Dispatching test message...' });
    try {
      const res = await api.testSendWhatsApp(testPhone.trim());
      if (res.success) {
        setTestStatus({ loading: false, msg: '✅ Test message delivered to your WhatsApp!', success: true });
        setTimeout(() => setTestStatus(null), 5000);
      }
    } catch (err: any) {
      setTestStatus({ loading: false, msg: err.message || 'Failed to send test message.', success: false });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      // Poll every 2.5 seconds when modal is open and awaiting scan
      const interval = setInterval(fetchStatus, 2500);
      setPollInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (pollInterval) clearInterval(pollInterval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1C130D] border border-white/[0.12] shadow-2xl text-stone-100 overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Restaurant WhatsApp Device
                {status === 'CONNECTED' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-500/20 text-stone-400 border border-stone-500/30">
                    Not Linked
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                Send campaign messages from your restaurant’s own number
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {status === 'CONNECTED' ? (
            /* Connected State */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-bold text-emerald-300">
                    WhatsApp Connected as {phoneNumber || 'Restaurant Number'}
                  </p>
                  <p className="text-emerald-400/80 mt-1 leading-relaxed">
                    Automated AI & custom campaigns will be sent safely through this device at scheduled intervals.
                  </p>
                </div>
              </div>

              {/* Test Message Form */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Verify with a Test Message
                </h4>
                <p className="text-[11px] text-stone-400">
                  Send a sample verification message to ensure your phone dispatches correctly:
                </p>
                <form onSubmit={handleSendTest} className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone (e.g. 9876543210)"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.12] text-xs text-white placeholder:text-stone-500 focus:border-brand-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={testStatus?.loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Test
                  </button>
                </form>
                {testStatus && (
                  <p className={`text-[11px] font-semibold ${testStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {testStatus.msg}
                  </p>
                )}
              </div>

              {/* Disconnect Action */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-stone-500 text-[11px]">
                  Want to use a different phone?
                </span>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Unlink Device
                </button>
              </div>
            </div>
          ) : (
            /* Pairing / QR Code State */
            <div className="space-y-5">
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Meta docs or GST needed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sent from your restaurant number</span>
                </div>
              </div>

              {qrCodeDataUrl ? (
                <div className="flex flex-col items-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                  <div className="p-3 bg-white rounded-2xl shadow-xl">
                    <img
                      src={qrCodeDataUrl}
                      alt="WhatsApp Web Pairing QR"
                      className="w-52 h-52 object-contain"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Scan this QR code with WhatsApp
                    </p>
                    <p className="text-[11px] text-stone-400 max-w-xs">
                      Open WhatsApp on phone → <strong>Linked Devices</strong> → <strong>Link a Device</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="text-[11px] text-[#FF9E58] hover:text-[#FFB87E] flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh QR code
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Link Your Restaurant's WhatsApp</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                    Connect any phone number (personal or WhatsApp Business) with a one-time QR scan. Automated customer campaign messages will be sent automatically from your number.
                  </p>
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50 inline-flex items-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating QR Code...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        Generate Connection QR
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step by step guide */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2 text-xs text-stone-300">
                <p className="font-bold text-stone-200 flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  How to link on your phone:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-400 pl-1 leading-relaxed">
                  <li>Open <strong>WhatsApp</strong> on the restaurant's phone</li>
                  <li>Tap <strong>Settings</strong> (iOS) or <strong>⋮ 3 Dots</strong> (Android)</li>
                  <li>Select <strong>Linked Devices</strong>, then tap <strong>Link a Device</strong></li>
                  <li>Scan the QR code displayed above</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
