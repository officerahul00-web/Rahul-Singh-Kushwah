import React from 'react';
import { AlertCircle, BellRing, X, Building2, Droplet, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { activeNotification, dismissNotification } = useApp();

  if (!activeNotification) return null;

  return (
    <div
      id="emergency-push-notification-toast"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-in slide-in-from-top-6 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border-2 border-rose-600 shadow-2xl p-4 text-white">
        
        {/* Animated emergency indicator strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-400 to-rose-600 animate-pulse"></div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-600/40 shrink-0 animate-bounce">
            <BellRing className="w-6 h-6" />
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide bg-rose-600 text-white">
                FCM Push: Emergency SOS
              </span>
              {activeNotification.bloodGroup && (
                <span className="px-1.5 py-0.5 rounded text-xs font-black bg-rose-500/30 text-rose-300 border border-rose-500/40">
                  {activeNotification.bloodGroup}
                </span>
              )}
            </div>

            <h4 className="font-bold text-sm text-neutral-100 mt-1">
              {activeNotification.title}
            </h4>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {activeNotification.body}
            </p>

            {activeNotification.hospital && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 font-medium">
                <Building2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{activeNotification.hospital}</span>
              </div>
            )}
          </div>

          <button
            id="dismiss-notification-btn"
            onClick={dismissNotification}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-400 text-[11px]">
            ⚡ स्वचालित रूप से जिले के पंजीकृत दाताओं को भेजा गया
          </span>
          <button
            onClick={dismissNotification}
            className="text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>विवरण देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
