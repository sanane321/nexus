import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Globe, 
  User, 
  Send, 
  Bot, 
  ShieldCheck,
  MapPin,
  HeadphonesIcon,
  Clock
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  type: 'support' | 'engineering' | 'enterprise';
  email: string;
  availability: string;
}

const TEAM_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Nexus Alpha Support',
    role: 'Technical Operations',
    type: 'support',
    email: 'support@nexus-iot.io',
    availability: '24/7 Monitoring'
  },
  {
    id: '2',
    name: 'Engineering Hub',
    role: 'Infrastructure Lead',
    type: 'engineering',
    email: 'dev-ops@nexus-iot.io',
    availability: 'Mon-Fri 08:00-18:00'
  },
  {
    id: '3',
    name: 'Enterprise Solutions',
    role: 'Strategic Partnerships',
    type: 'enterprise',
    email: 'partners@nexus-iot.io',
    availability: 'Global Business Hours'
  }
];

export function ContactsView() {
  const [msg, setMsg] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMsg({ subject: '', body: '' });
      alert('Transmission Sent: Message queued for secure delivery.');
    }, 1500);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-16 bg-transparent h-full transition-colors">
      <Helmet>
        <title>Nexus Comm Center | Secure Support</title>
        <meta name="description" content="Direct secure-link high-priority channels to global Nexus operators and deep-infrastructure engineers." />
      </Helmet>
      <header className="space-y-6">
        <div className="flex items-center gap-4 transition-all">
          <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-xl shadow-glow">
            <HeadphonesIcon className="w-6 h-6" />
          </div>
          <h2 className="text-6xl font-bold tracking-tight text-white light:text-slate-900 uppercase leading-none transition-colors font-display">Comm_Center</h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500 font-bold leading-relaxed">
          Direct secure-link high-priority channels to global Nexus operators and deep-infrastructure engineers. 
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM_CONTACTS.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="panel-bg p-8 group transition-all bg-white/[0.02] light:bg-brand-panel border-white/5 light:border-slate-300 hover:border-brand-accent/30 overflow-hidden relative"
              >
                <div className="flex items-center gap-6 mb-8 transition-all">
                  <div className="w-14 h-14 bg-white/[0.03] light:bg-slate-400 border border-white/10 light:border-slate-200 rounded-2xl flex items-center justify-center text-white light:text-slate-900 shadow-glow group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 group-hover:text-brand-accent transition-all">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white light:text-slate-900 text-2xl uppercase tracking-tight leading-none transition-colors font-display">{contact.name}</h4>
                    <p className="font-mono text-[11px] text-slate-500 uppercase tracking-widest font-bold mt-1.5">{contact.role}</p>
                  </div>
                </div>
                <div className="space-y-4 border-t border-white/5 light:border-slate-900/5 pt-6 group-hover:border-brand-accent/20 transition-all">
                   <div className="flex items-center gap-3 text-sm text-slate-300 light:text-slate-700 font-bold transition-colors">
                     <Mail className="w-4 h-4 text-brand-accent opacity-50" />
                     {contact.email}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-500 light:text-slate-600 font-bold uppercase tracking-widest text-[9px] transition-colors">
                     <Clock className="w-4 h-4 text-brand-accent opacity-50" />
                     {contact.availability}
                   </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 blur-3xl rounded-full pointer-events-none" />
              </motion.div>
            ))}

            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               className="panel-bg p-8 border-2 border-dashed border-white/5 light:border-slate-300 rounded-3xl flex flex-col justify-center items-center text-center space-y-6 group hover:border-brand-accent/20 transition-all bg-white/[0.01] light:bg-brand-panel/50"
            >
              <div className="w-14 h-14 bg-white/[0.02] light:bg-slate-400 border border-white/10 light:border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 light:text-slate-400 group-hover:text-brand-accent group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <div className="text-lg font-bold text-white light:text-slate-900 uppercase tracking-tight transition-colors">Global Nodes</div>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-2 font-bold tracking-[0.2em] transition-colors">London // Tokyo // S_Francisco</p>
              </div>
            </motion.div>
          </div>

          <div className="panel-bg p-12 border-white/5 light:border-slate-300 bg-white/[0.02] light:bg-brand-panel rounded-[3rem] flex flex-col md:flex-row items-center gap-12 group hover:border-brand-accent/20 transition-all">
             <div className="w-24 h-24 bg-brand-accent/10 border border-brand-accent/20 rounded-3xl flex items-center justify-center text-brand-accent shadow-glow transition-all group-hover:scale-110">
               <Bot className="w-12 h-12" />
             </div>
             <div className="space-y-4 flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold text-white light:text-slate-900 uppercase tracking-tight leading-none transition-colors font-display">Nexus Intelligence</h3>
                <p className="text-lg text-slate-500 light:text-slate-600 leading-relaxed font-medium transition-colors">
                  Integrated neural agent for sub-second technical queries and secure asset retrieval.
                </p>
             </div>
             <button className="px-10 py-6 bg-brand-accent text-brand-bg rounded-[2rem] font-bold uppercase tracking-[0.2em] text-sm shadow-glow hover:brightness-110 transition-all active:scale-95">
               Wake Intelligence
             </button>
          </div>
        </div>

        <div className="space-y-10">
           <div className="panel-bg p-12 space-y-10 sticky top-32 border-white/5 light:border-slate-300 bg-white/[0.03] light:bg-brand-panel rounded-[3rem] transition-all">
              <div className="space-y-3">
                <h3 className="text-4xl font-bold text-white light:text-slate-900 uppercase tracking-tight leading-none transition-colors font-display">Secure Link</h3>
                <p className="text-[11px] font-mono text-slate-600 light:text-slate-500 uppercase tracking-[0.4em] font-bold transition-colors">End_to_End_Sync</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                   <label className="font-mono text-[9px] text-slate-500 light:text-slate-600 uppercase tracking-widest font-bold">Protocol_Subject</label>
                   <input 
                     required
                     value={msg.subject}
                     onChange={e => setMsg({...msg, subject: e.target.value})}
                     placeholder="HW_FAIL_REPORT..."
                     className="w-full bg-white/[0.03] light:bg-brand-panel/30 border border-white/10 light:border-slate-200 rounded-2xl p-5 text-base text-white light:text-slate-900 focus:outline-none focus:border-brand-accent/50 transition-all font-medium placeholder:text-slate-800 light:placeholder:text-slate-500"
                   />
                </div>
                <div className="space-y-3">
                   <label className="font-mono text-[9px] text-slate-500 light:text-slate-600 uppercase tracking-widest font-bold">Message_Payload</label>
                   <textarea 
                     required
                     value={msg.body}
                     onChange={e => setMsg({...msg, body: e.target.value})}
                     placeholder="Technical parameters..."
                     rows={5}
                     className="w-full bg-white/[0.03] light:bg-brand-panel/30 border border-white/10 light:border-slate-200 rounded-2xl p-5 text-base text-white light:text-slate-900 focus:outline-none focus:border-brand-accent/50 transition-all font-medium resize-none placeholder:text-slate-800 light:placeholder:text-slate-500"
                   />
                </div>
                <button 
                  disabled={sending}
                  className="w-full py-5 bg-brand-accent text-brand-bg rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-glow flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 hover:brightness-110"
                >
                  {sending ? 'Encrypting...' : (
                    <>
                      <Send className="w-5 h-5" />
                      Initialize Send
                    </>
                  )}
                </button>
              </form>

              <div className="pt-8 border-t border-white/5 light:border-slate-200 flex items-center gap-3 justify-center transition-all">
                 <ShieldCheck className="w-5 h-5 text-brand-accent/50 shadow-glow" />
                 <span className="text-[9px] font-mono text-slate-600 light:text-slate-600 uppercase tracking-widest font-bold transition-colors">Quantum_Verified_Path</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
