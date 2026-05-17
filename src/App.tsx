/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DeviceList } from './components/DeviceList';
import { AssetsView } from './components/AssetsView';
import { BlogView } from './components/BlogView';
import { ServicesView } from './components/ServicesView';
import { ContactsView } from './components/ContactsView';
import { 
  Activity, 
  Cpu, 
  LayoutDashboard, 
  Database, 
  ShieldAlert, 
  BookOpen, 
  Server, 
  Mail, 
  Settings, 
  BarChart3, 
  Terminal,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light';
    }
    return false;
  });

  React.useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const user = {
    displayName: 'A. Jensen',
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    email: 'operator@nexus.io'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'devices': return <DeviceList />;
      case 'assets': return <AssetsView />;
      case 'blog': return <BlogView />;
      case 'services': return <ServicesView />;
      case 'contacts': return <ContactsView />;
      case 'analytics': return <div className="p-20 flex flex-col items-center justify-center space-y-8 opacity-20"><BarChart3 className="w-20 h-20" /><p className="font-mono text-xs uppercase tracking-widest font-bold">Initializing Analytics Pipeline...</p></div>;
      case 'settings': return <div className="p-20 flex flex-col items-center justify-center space-y-8 opacity-20"><Settings className="w-20 h-20" /><p className="font-mono text-xs uppercase tracking-widest font-bold">Accessing Core Config...</p></div>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-brand-bg text-slate-300 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/5 light:bg-black/15 blur-[200px] light:blur-[300px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 light:bg-black/10 blur-[200px] light:blur-[300px] rounded-full pointer-events-none" />

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#050505] light:bg-brand-panel border-r border-white/5 light:border-slate-300 flex flex-col py-10 z-[70] transition-all duration-500 ease-in-out px-4 overflow-y-auto overflow-x-hidden
        lg:static lg:w-64 lg:bg-[#050505]/80 light:lg:bg-brand-panel/80 lg:backdrop-blur-3xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="w-12 h-12 bg-white/[0.03] border border-white/10 flex items-center justify-center rounded-2xl text-brand-accent shadow-glow cursor-pointer shrink-0"
            >
              <Terminal className="w-6 h-6" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-white light:text-slate-900 font-bold tracking-tight text-xl uppercase leading-none transition-colors font-display">Nexus</span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-1">Core_OS v4</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 w-full space-y-2 flex flex-col">
          <SidebarIcon 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard" 
          />
          <SidebarIcon 
            active={activeTab === 'devices'} 
            onClick={() => { setActiveTab('devices'); setIsSidebarOpen(false); }}
            icon={<Activity className="w-5 h-5" />}
            label="Node Fleet" 
          />
          <SidebarIcon 
            active={activeTab === 'assets'} 
            onClick={() => { setActiveTab('assets'); setIsSidebarOpen(false); }}
            icon={<Database className="w-5 h-5" />}
            label="Data Clusters" 
          />
          <div className="mx-4 h-px bg-white/5 my-6" />
          <SidebarIcon 
            active={activeTab === 'analytics'} 
            onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analytics" 
          />
          <SidebarIcon 
            active={activeTab === 'services'} 
            onClick={() => { setActiveTab('services'); setIsSidebarOpen(false); }}
            icon={<Server className="w-5 h-5" />}
            label="Compute" 
          />
          <SidebarIcon 
            active={activeTab === 'blog'} 
            onClick={() => { setActiveTab('blog'); setIsSidebarOpen(false); }}
            icon={<BookOpen className="w-5 h-5" />}
            label="Archives" 
          />
          <div className="mx-4 h-px bg-white/5 my-6" />
          <SidebarIcon 
            active={activeTab === 'contacts'} 
            onClick={() => { setActiveTab('contacts'); setIsSidebarOpen(false); }}
            icon={<Mail className="w-5 h-5" />}
            label="Comm Center" 
          />
          <SidebarIcon 
            active={activeTab === 'settings'} 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            icon={<Settings className="w-5 h-5" />}
            label="Control Panel" 
          />
        </nav>

      <div className={`mt-auto space-y-4 flex flex-col pt-8 border-t border-white/5 light:border-slate-200 w-full`}>
          <button 
            onClick={() => setIsLight(!isLight)}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 light:text-slate-500 hover:text-brand-accent hover:bg-brand-accent/5 rounded-2xl transition-all group mb-4 border border-transparent hover:border-brand-accent/20"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
              {isLight ? 'Dark_Mode' : 'Light_Mode'}
            </span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-2 text-slate-600 light:text-slate-400 hover:text-red-400 light:hover:text-red-500 transition-colors group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest font-bold">Disconnect</span>
          </button>
          
          <div className="flex items-center gap-4 px-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 overflow-hidden border border-white/10 light:border-slate-200 rounded-2xl shadow-xl hover:border-brand-accent/50 transition-all cursor-pointer">
                 <img src={user.photoURL} alt="pfp" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full border-2 border-brand-bg shadow-glow" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white light:text-slate-900 font-bold text-sm truncate uppercase tracking-tight transition-colors">{user.displayName}</span>
              <span className="text-[10px] font-mono text-slate-600 light:text-slate-400 uppercase tracking-widest line-clamp-1 transition-colors">{user.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        <header className="h-20 lg:h-[104px] sticky top-0 bg-transparent light:bg-slate-950 backdrop-blur-2xl light:backdrop-blur-3xl border-b border-white/5 light:border-white/10 flex items-center justify-between px-6 lg:px-16 z-40 transition-all">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white/[0.03] border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-2 uppercase leading-none transition-colors font-display">
                Nexus <span className="text-brand-accent shadow-glow">v4</span>
              </h1>
              <div className="hidden sm:flex items-center gap-3 mt-3">
                <div className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">
                  SID: 0X_F2_99
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-glow" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 lg:space-x-12">
            <div className="hidden md:flex flex-col items-end gap-1">
               <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">Node_Status</span>
               <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-brand-accent uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse shadow-glow"></div>
                SYNCHRONIZED
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/5" />
            <div className="text-right hidden sm:block">
              <div className="text-base lg:text-lg font-bold text-white tracking-tight leading-none uppercase transition-colors font-display">{user.displayName}</div>
              <div className="text-[10px] lg:text-[11px] font-mono text-slate-400 uppercase tracking-[0.3em] mt-2 font-bold italic">L4_ARCHITECT</div>
            </div>
            <div className="sm:hidden w-10 h-10 overflow-hidden border border-white/10 rounded-xl">
               <img src={user.photoURL} alt="pfp" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto relative scroll-smooth thin-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99, y: 10, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.01, y: -10, filter: "blur(12px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarIcon({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 transition-all rounded-2xl relative group ${
        active 
          ? 'text-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/20 shadow-glow' 
          : 'text-slate-500 hover:text-white light:hover:text-slate-900 hover:bg-white/[0.03] light:hover:bg-slate-200/50'
      }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      
      <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-colors ${active ? 'text-white light:text-slate-900' : 'text-slate-400 group-hover:text-slate-200 light:group-hover:text-slate-700'}`}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute right-0 w-1 h-6 bg-brand-accent rounded-l-full shadow-glow"
        />
      )}
    </button>
  );
}

