import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, Volume2, ShieldCheck, UserCheck } from 'lucide-react';
import { Donor } from '../../types';

interface CallModalProps {
  donor: Donor;
  isMasked: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ donor, isMasked, onClose }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'RINGING' | 'CONNECTED'>('CONNECTING');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setCallStatus('RINGING'), 1200);
    const t2 = setTimeout(() => setCallStatus('CONNECTED'), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="call-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 text-white shadow-2xl text-center flex flex-col items-center">
        
        {/* Masked status badge */}
        {isMasked ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>गोपनीय कॉल (DPDP Masked Number Active)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 mb-4">
            <UserCheck className="w-3.5 h-3.5" />
            <span>सत्यापित स्वैच्छिक रक्तदाता</span>
          </div>
        )}

        {/* Profile Avatar */}
        <div className="relative my-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-rose-400">
            {donor.fullName.charAt(0)}
          </div>
          <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-neutral-800 border border-rose-500 text-xs font-extrabold text-rose-400">
            {donor.bloodGroup}
          </span>
        </div>

        {/* Donor Name & Location */}
        <h3 className="text-xl font-bold tracking-tight text-neutral-100">{donor.fullName}</h3>
        <p className="text-sm text-neutral-400 mt-0.5">{donor.city}, {donor.district}</p>

        {/* Display phone number or virtual mask */}
        <div className="mt-2 text-xs font-mono text-neutral-300 bg-neutral-800/80 px-3 py-1 rounded-md">
          {isMasked ? '+91 1800-AMBA-01 (Virtual Relay)' : donor.phone}
        </div>

        {/* Call state / timer */}
        <div className="mt-4 mb-6">
          {callStatus === 'CONNECTING' && (
            <span className="text-sm text-amber-400 font-medium animate-pulse">नेटवर्क से कनेक्ट हो रहा है...</span>
          )}
          {callStatus === 'RINGING' && (
            <span className="text-sm text-sky-400 font-medium animate-pulse">घंटी बज रही है (Ringing)...</span>
          )}
          {callStatus === 'CONNECTED' && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-mono font-bold text-emerald-400">{formatTime(callDuration)}</span>
              <span className="text-xs text-neutral-400 mt-0.5">कॉल जारी है (Secure Call In Progress)</span>
            </div>
          )}
        </div>

        {/* Call In-progress waveform */}
        {callStatus === 'CONNECTED' && (
          <div className="flex items-center gap-1.5 h-6 mb-6">
            <span className="w-1 bg-emerald-500 rounded-full h-3 animate-bounce"></span>
            <span className="w-1 bg-emerald-500 rounded-full h-5 animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1 bg-emerald-500 rounded-full h-2 animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-1 bg-emerald-500 rounded-full h-6 animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-1 bg-emerald-500 rounded-full h-4 animate-bounce [animation-delay:0.25s]"></span>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4 w-full px-2 mb-6">
          <button
            id="call-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
              isMuted ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Mic className="w-5 h-5 mb-1" />
            <span className="text-xs">{isMuted ? 'अनम्यूट' : 'म्यूट'}</span>
          </button>

          <button
            id="call-speaker-btn"
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
              isSpeaker ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Volume2 className="w-5 h-5 mb-1" />
            <span className="text-xs">स्पीकर</span>
          </button>

          <button
            id="call-info-btn"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700"
          >
            <ShieldCheck className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="text-xs">सुरक्षित</span>
          </button>
        </div>

        {/* Hangup button */}
        <button
          id="call-hangup-btn"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" />
          <span>कॉल समाप्त करें (End Call)</span>
        </button>

      </div>
    </div>
  );
};
