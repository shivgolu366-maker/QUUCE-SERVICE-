import React, { useState, useRef, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { X, Send, ShieldCheck, Sparkles } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { 
    chatBookingId, 
    closeChat, 
    messages, 
    sendMessage, 
    bookings, 
    viewMode,
    customer,
    activePartner
  } = useQuickService();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentBooking = bookings.find(b => b.id === chatBookingId);
  const bookingMessages = messages.filter(m => m.bookingId === chatBookingId);

  const quickReplies = viewMode === 'partner' 
    ? [
        "I am 5 mins away.",
        "I'm at the society security gate.",
        "Please provide floor & flat number.",
        "Job started, examining issue now."
      ]
    : [
        "Gate pass code is #4012.",
        "Tower 4, 12th Floor, Flat 1204.",
        "Please ring bell twice.",
        "I have kept the tools area cleared."
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bookingMessages.length]);

  if (!chatBookingId || !currentBooking) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    const sender = viewMode === 'partner' ? 'partner' : 'customer';
    sendMessage(chatBookingId, text.trim(), sender);
    if (!textToSend) setInputText('');
  };

  const otherPersonName = viewMode === 'partner' ? currentBooking.customerName : (currentBooking.partnerName || 'Service Partner');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[580px] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-amber-500/40">
              <img 
                src={viewMode === 'partner' 
                  ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=AaravMalhotra' 
                  : (currentBooking.partnerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshVerma')
                } 
                alt={otherPersonName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight leading-none mb-1">
                {otherPersonName}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Masked Chat · Booking #{currentBooking.id}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={closeChat}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60 no-scrollbar">
          {/* Security Notice */}
          <div className="text-center my-1">
            <span className="text-[10px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 inline-block">
              🔒 In-app conversation recorded for quality and safety.
            </span>
          </div>

          {bookingMessages.map((msg) => {
            const isMe = (viewMode === 'partner' && msg.sender === 'partner') || (viewMode !== 'partner' && msg.sender === 'customer');
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-md' 
                      : 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/60'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
