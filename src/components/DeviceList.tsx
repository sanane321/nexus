import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, SYSTEM_USER_ID } from '../lib/firebase';
import { Device, DeviceType } from '../types';
import { Plus, Trash2, Cpu, Signal, SignalLow, SignalHigh, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState<{ name: string; type: DeviceType }>({
    name: '',
    type: 'temperature'
  });

  useEffect(() => {
    const q = query(
      collection(db, 'devices'),
      where('ownerId', '==', SYSTEM_USER_ID)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Device[];
      setDevices(deviceData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'devices'), {
        ...newDevice,
        status: 'online',
        ownerId: SYSTEM_USER_ID,
        lastSeen: new Date().toISOString(),
        latestValues: {},
        metadata: {
          location: 'Main Office',
          vendor: 'Nexus Hardware'
        }
      });
      setShowAddModal(false);
      setNewDevice({ name: '', type: 'temperature' });
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (confirm('Are you sure you want to decommission this device?')) {
      await deleteDoc(doc(db, 'devices', id));
    }
  };

  if (loading) return <div className="p-8 font-mono text-sm animate-pulse">Scanning Network...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-16 bg-transparent h-full">
      <Helmet>
        <title>Nexus Node Fleet | Network Inventory</title>
        <meta name="description" content="Manage and provision industrial IoT nodes. Global asset tracking with high-latency secure protocols." />
      </Helmet>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-bold tracking-tight text-white light:text-slate-900 mb-2 uppercase leading-none transition-colors font-display">Node Fleet</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500 font-bold">
            Network_Topology // Provisioned_Nodes: {devices.length}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 bg-brand-accent text-brand-bg px-10 py-5 rounded-2xl font-bold font-sans text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-glow active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Provision Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} onDelete={() => handleDeleteDevice(device.id)} />
        ))}
        {devices.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 light:border-slate-900/5 rounded-[2rem] text-slate-600 transition-all">
            <Cpu className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold">No active nodes detected in local subnet</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="panel-bg p-12 max-w-lg w-full bg-[#0a0a0a] border-white/10"
          >
            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent shadow-glow transition-all">
                 <Cpu className="w-7 h-7" />
               </div>
               <div>
                 <h3 className="text-4xl font-bold text-white light:text-slate-900 uppercase tracking-tight italic transition-colors font-display">Provisioning</h3>
                 <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold mt-1">Initializing secure handshake</p>
               </div>
            </div>
            
            <form onSubmit={handleAddDevice} className="space-y-8">
              <div className="space-y-3">
                <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-400 font-bold">Node Identifier</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="w-full bg-white/[0.03] light:bg-slate-900/[0.03] border border-white/10 light:border-slate-900/10 rounded-2xl p-5 text-base text-white light:text-slate-900 focus:outline-none focus:border-brand-accent/50 transition-all font-medium placeholder:text-slate-700"
                  placeholder="E.G. ALPHA_CORE_01"
                />
              </div>
              <div className="space-y-3">
                <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-400 font-bold">Hardware Profile</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value as DeviceType })}
                  className="w-full bg-white/[0.03] light:bg-slate-900/[0.03] border border-white/10 light:border-slate-900/10 rounded-2xl p-5 text-base text-white light:text-slate-900 focus:outline-none focus:border-brand-accent/50 appearance-none cursor-pointer font-medium transition-all"
                >
                  <option value="temperature" className="bg-brand-bg">Thermo-Sensor V4</option>
                  <option value="humidity" className="bg-brand-bg">Hydro-Monitor Pro</option>
                  <option value="power" className="bg-brand-bg">Kilowatt Sentinel</option>
                  <option value="motion" className="bg-brand-bg">Kinetic Relay</option>
                </select>
              </div>
              <div className="flex gap-6 pt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl border border-white/10 light:border-slate-300 text-slate-400 light:text-slate-600 font-bold font-sans text-xs uppercase tracking-widest hover:bg-white/5 light:hover:bg-slate-200 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-accent text-brand-bg py-5 rounded-2xl font-bold font-sans text-xs uppercase tracking-widest hover:brightness-110 shadow-glow transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const DeviceCard: React.FC<{ device: Device; onDelete: () => void | Promise<void> }> = ({ device, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      className="panel-bg p-8 flex flex-col group relative transition-all bg-white/[0.02] light:bg-brand-panel border-white/5 light:border-slate-300 hover:border-brand-accent/30 overflow-hidden transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
          device.status === 'online' 
            ? 'bg-brand-accent/10 text-brand-accent shadow-glow border border-brand-accent/20' 
            : 'bg-white/5 light:bg-slate-400 text-slate-600 border border-white/5 light:border-slate-400'
        }`}>
          <Cpu className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold">
          <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-brand-accent animate-pulse shadow-glow' : 'bg-red-500'}`} />
          <span className={device.status === 'online' ? 'text-brand-accent' : 'text-red-500'}>{device.status}</span>
        </div>
      </div>

      <h4 className="text-4xl font-bold tracking-tight text-white light:text-slate-900 mb-2 truncate uppercase transition-colors font-display">{device.name}</h4>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500 mb-10 font-bold">{device.type} // {device.id.slice(0, 8)}</p>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-600 light:text-slate-400 font-bold">Latency</p>
          <div className="flex items-center gap-2">
            <SignalHigh className="w-4 h-4 text-brand-accent opacity-50" />
            <span className="font-mono text-sm text-slate-300 light:text-slate-700 font-bold transition-colors">12ms</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-600 light:text-slate-400 font-bold">Uptime</p>
          <span className="font-mono text-sm text-slate-300 light:text-slate-700 font-bold transition-colors">99.9%</span>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 light:border-slate-900/5 flex justify-between items-center group-hover:border-brand-accent/20 transition-all">
        <button className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 light:text-slate-500 font-bold hover:text-white light:hover:text-slate-900 transition-colors">
          <Info className="w-5 h-5 text-brand-accent/40" />
          Analytics
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-slate-700 light:text-slate-400 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-brand-accent/10 transition-all" />
    </motion.div>
  );
}
