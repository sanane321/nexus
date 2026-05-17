import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db, SYSTEM_USER_ID } from '../lib/firebase';
import { Device, TelemetryPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, Cpu, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Devices for stats
    const qDevices = query(
      collection(db, 'devices'),
      where('ownerId', '==', SYSTEM_USER_ID)
    );

    const unsubDevices = onSnapshot(qDevices, (snapshot) => {
      setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Device));
    });

    // Mock initial telemetry for chart
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      time: i + ':00',
      value: Math.floor(20 + Math.random() * 10),
      hum: Math.floor(40 + Math.random() * 20),
    }));
    setTelemetry(mockData);

    return () => unsubDevices();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSimulating && devices.length > 0) {
      interval = setInterval(() => {
        setTelemetry(prev => {
          const last = prev[prev.length - 1];
          const newValue = Math.max(15, Math.min(35, last.value + (Math.random() * 4 - 2)));
          const newHum = Math.max(30, Math.min(80, last.hum + (Math.random() * 6 - 3)));
          return [...prev.slice(1), { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            value: parseFloat(newValue.toFixed(1)),
            hum: parseFloat(newHum.toFixed(1))
          }];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, devices]);

  const runAnalysis = async () => {
    if (devices.length === 0) return;
    setAnalyzing(true);
    try {
      // Simulate sending real-time stream state
      const telemetryContext = telemetry.slice(-5);
      const response = await fetch('/api/analyze-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          deviceData: devices.map(d => ({ name: d.name, type: d.type })),
          recentTelemetry: telemetryContext
        }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const alertCount = devices.filter(d => d.status === 'alert').length;

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto relative bg-transparent transition-colors">
      <div className="flex justify-between items-end relative z-10">
        <div>
          <h2 className="text-6xl font-bold tracking-tight text-white light:text-slate-900 mb-2 uppercase leading-none transition-colors font-display">Command Dash</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500 font-bold">
            Nexus_Core // System_Pulse: Active
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={runAnalysis}
             disabled={analyzing || devices.length === 0}
             className="flex items-center gap-2 px-8 py-3.5 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent font-mono text-[11px] uppercase tracking-widest hover:bg-brand-accent/20 transition-all disabled:opacity-30 shadow-glow"
           >
             <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
             Initialize Analysis
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard 
          label="Provisioned" 
          value={devices.length.toString()} 
          icon={<Cpu className="w-5 h-5 text-slate-400 light:text-slate-500" />} 
        />
        <StatCard 
          label="Live Stream" 
          value={onlineCount.toString()} 
          icon={<TrendingUp className="w-5 h-5 text-brand-accent" />} 
          status="operational"
        />
        <StatCard 
          label="S_Alerts" 
          value={alertCount.toString()} 
          icon={<AlertCircle className="w-5 h-5 text-red-400" />} 
          status={alertCount > 0 ? "warning" : "nominal"}
        />
        <div className="panel-bg p-8 flex flex-col justify-between group hover:border-brand-accent/30 transition-all bg-white/[0.02] light:bg-brand-panel">
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 font-bold">Simulation</span>
            <Activity className={`w-6 h-6 transition-colors ${isSimulating ? 'text-brand-accent animate-pulse' : 'text-slate-600 light:text-slate-400'}`} />
          </div>
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`w-full py-4 rounded-2xl font-mono text-[11px] uppercase tracking-[0.2em] transition-all border ${isSimulating ? 'bg-brand-accent text-brand-bg font-bold border-brand-accent shadow-glow' : 'bg-transparent text-slate-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 border-white/5 light:border-slate-900/5 hover:border-white/10 light:hover:border-slate-900/10 hover:bg-white/5 light:hover:bg-slate-900/5'}`}
          >
            {isSimulating ? 'Kill Loop' : 'Sync Stream'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 panel-bg p-10 bg-white/[0.01] light:bg-brand-panel transition-all">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="font-bold text-2xl uppercase tracking-tight text-white light:text-slate-900 italic underline underline-offset-8 decoration-brand-accent/30 transition-colors font-display">Network Flow</h3>
              <p className="text-[11px] font-mono text-slate-500 uppercase mt-4 tracking-[0.2em]">Real-time telemetry stream</p>
            </div>
            <div className="flex gap-8">
               <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-brand-accent font-black">
                 <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" /> Stream_A
               </div>
               <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-slate-600 light:text-slate-400">
                 <div className="w-2 h-2 rounded-full bg-slate-800 light:bg-slate-200" /> Stream_B
               </div>
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--color-chart-axis)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                  dy={10}
                />
                <YAxis 
                  stroke="var(--color-chart-axis)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-tooltip-bg)', 
                    border: '1px solid var(--color-tooltip-border)', 
                    color: 'var(--color-brand-text)',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: 'var(--color-brand-accent)' }}
                  cursor={{ stroke: 'var(--color-brand-accent)', strokeWidth: 2, strokeOpacity: 0.2 }}
                />
                <Line 
                  type="natural" 
                  dataKey="value" 
                  stroke="var(--color-chart-line)" 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={1500}
                />
                <Line 
                  type="natural" 
                  dataKey="hum" 
                  stroke="var(--color-chart-line-subtle)" 
                  strokeWidth={2} 
                  dot={false}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="panel-bg p-10 flex flex-col bg-white/[0.02] light:bg-brand-panel transition-all">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent rounded-2xl shadow-glow transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-2xl uppercase tracking-tight text-white light:text-slate-900 italic transition-colors font-display">Neural Logic</h3>
          </div>

          <div className="flex-1 space-y-8">
             {analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-sans text-2xl text-slate-200 light:text-slate-800 leading-tight font-medium border-l-2 border-brand-accent pl-8 py-2 relative transition-colors"
                >
                  <div className="absolute top-0 left-[-4px] w-2 h-2 bg-brand-accent rounded-full" />
                  {analysis}
                </motion.div>
             ) : (
               <div className="space-y-10">
                 <p className="text-xs font-mono text-slate-500 light:text-slate-600 uppercase leading-relaxed tracking-[0.2em] font-medium">
                   Neural engine standby. Synchronizing telemetry nodes...
                 </p>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase tracking-widest">
                         <span className="text-slate-400 light:text-slate-500">Node_Process</span>
                         <span className="text-brand-accent">32%</span>
                       </div>
                       <div className="h-1 bg-white/5 light:bg-slate-300 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: '32%' }}
                           className="h-full bg-brand-accent shadow-glow" 
                         />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase tracking-widest">
                         <span className="text-slate-400 light:text-slate-500">Mem_Bank_Usage</span>
                         <span className="text-white light:text-slate-900 transition-colors">68%</span>
                       </div>
                       <div className="h-1 bg-white/5 light:bg-slate-300 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: '68%' }}
                           className="h-full bg-white/20 light:bg-brand-accent/40" 
                         />
                       </div>
                    </div>
                 </div>
               </div>
             )}
          </div>

          <button 
            onClick={runAnalysis}
            disabled={analyzing || devices.length === 0}
            className="w-full bg-brand-accent text-brand-bg py-5 rounded-2xl font-bold font-sans text-xs uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 shadow-glow mt-12"
          >
            {analyzing ? 'Processing...' : 'Sync Neural Core'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, status }: { label: string, value: string, icon: React.ReactNode, status?: "operational" | "warning" | "nominal" }) {
  return (
    <div className="stat-card flex flex-col justify-between h-56 bg-white/[0.02] light:bg-brand-panel transition-all">
      <div className="flex justify-between items-start mb-6">
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
        <div className="p-2.5 bg-white/[0.03] light:bg-slate-400 rounded-xl transition-all">{icon}</div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-7xl font-bold tracking-tighter text-white light:text-slate-900 leading-none transition-colors font-display">{value}</span>
        {status && (
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${
              status === 'operational' ? 'bg-brand-accent shadow-glow' : 
              status === 'warning' ? 'bg-red-500' : 'bg-slate-600 light:bg-slate-400'
            }`} />
            <span className={`text-[11px] font-mono uppercase tracking-[0.2em] font-bold transition-colors ${
              status === 'operational' ? 'text-brand-accent' : 
              status === 'warning' ? 'text-red-400' : 'text-slate-500 light:text-slate-600'
            }`}>
              {status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
