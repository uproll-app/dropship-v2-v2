import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { X, Send, Sparkles, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string; // Support WhatsApp number with country code, e.g. '919876543210'
  storeName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '919876543210',
  storeName = 'Dropified'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  // Prompt the mini greeting pill after 4 seconds on initial load if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const quickQuestions = [
    { label: '📦 Track My COD Order', text: `Hi ${storeName} Team! I need help tracking my recent Cash on Delivery order.` },
    { label: '💵 How COD Works?', text: `Hi ${storeName} Team! Can you confirm if I can pay 100% in cash only when my parcel arrives at my door?` },
    { label: '📏 Size & Fit Advice', text: `Hello ${storeName}! I want assistance with choosing the right size and fit before ordering.` },
    { label: '🚚 Delivery Time to my PIN', text: `Hi! How many days does delivery usually take to my area?` },
  ];

  const handleOpenChat = (queryText?: string) => {
    const defaultText = `Hello ${storeName} Customer Support! I have a question about products and Cash on Delivery shipping. Could you please assist me?`;
    const message = (queryText || customQuery).trim() || defaultText;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {/* Popover Support Card */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[330px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center p-2 text-white">
                    <WhatsAppIcon className="w-full h-full fill-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#128C7E] rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5 leading-tight">
                    <span>{storeName} Support</span>
                    <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Official</span>
                  </div>
                  <div className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Typically replies within 5 mins</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ECE5DD]/40 space-y-3">
            
            {/* Chat bubble message */}
            <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-200/60 max-w-[90%]">
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                👋 Namaste! Welcome to <strong>{storeName}</strong>. How can we help you today with your order or product inquiries?
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> 100% Cash on Delivery
                </span>
                <span>• Express Dispatch</span>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                Frequently Asked:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenChat(q.text)}
                    className="text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 font-medium transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span>{q.label}</span>
                    <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom question input */}
            <div className="pt-2">
              <div className="flex items-center bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 p-1 shadow-2xs">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleOpenChat();
                  }}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => handleOpenChat()}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Floating Trigger Button with Optional Greeting Tooltip */}
      <div className="pointer-events-auto flex items-center gap-3">
        
        {/* Subtle greeting bubble before user opens chat */}
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-all hover:scale-102 animate-in fade-in slide-in-from-right-3 duration-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Need help? Chat with us</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded ml-1"
              aria-label="Dismiss message"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat on WhatsApp for customer support"
          title="Chat on WhatsApp for customer support"
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
        >
          {/* Active online pulse ring */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />

          {isOpen ? (
            <X className="w-6 h-6 transition-transform rotate-0 group-hover:rotate-90 duration-200" />
          ) : (
            <WhatsAppIcon className="w-7 h-7 fill-current drop-shadow-xs transition-transform group-hover:scale-110 duration-200" />
          )}
        </button>

      </div>

    </div>
  );
};
