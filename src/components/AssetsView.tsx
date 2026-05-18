import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, SYSTEM_USER_ID } from '../lib/firebase';
import { Asset } from '../types';
import { Plus, Database, MapPin, Building2, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'assets'), where('ownerId', '==', SYSTEM_USER_ID));
    const unsub = onSnapshot(q, (snapshot) => {
      setAssets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Asset[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddAsset = async () => {
    const name = prompt('Asset Name?');
    if (!name) return;
    await addDoc(collection(db, 'assets'), {
      name,
      description: 'Newly provisioned asset group',
      ownerId: SYSTEM_USER_ID
    });
  };

  if (loading) return <div className="p-8 font-mono text-sm animate-pulse">Loading Assets...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-16 bg-transparent h-full transition-colors">
      <Helmet>
        <title>Nexus Data Clusters | Industrial Intelligence</title>
        <meta name="description" content="Explore high-throughput data hierarchy. Active clusters providing real-time telemetry analytics." />
      </Helmet>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-bold tracking-tight text-white light:text-slate-900 mb-2 uppercase leading-none transition-colors font-display">Clusters</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500 font-bold">
            Data_Hierarchy // Active_Clusters: {assets.length}
          </p>
        </div>
        <button
          onClick={handleAddAsset}
          className="flex items-center gap-3 bg-brand-accent text-brand-bg px-10 py-5 rounded-2xl font-bold font-sans text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-glow active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Initialize Cluster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {assets.map((asset) => (
          <div key={asset.id} className="panel-bg p-10 flex flex-col group transition-all bg-white/[0.02] light:bg-brand-panel border-white/5 light:border-slate-300 hover:border-brand-accent/30 cursor-pointer overflow-hidden relative">
            <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent p-4 w-fit rounded-xl shadow-glow mb-8 transition-all group-hover:scale-110">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-3xl font-bold tracking-tight text-white light:text-slate-900 mb-3 uppercase leading-none transition-colors font-display">{asset.name}</h4>
            <p className="text-lg text-slate-500 light:text-slate-600 mb-10 leading-relaxed font-medium transition-colors">{asset.description}</p>
            <div className="mt-auto pt-8 border-t border-white/5 light:border-slate-900/5 flex items-center gap-8 group-hover:border-brand-accent/20 transition-all">
               <div className="flex items-center gap-2">
                 <Building2 className="w-3.5 h-3.5 text-brand-accent/40" />
                 <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500">Tier_4</span>
               </div>
               <div className="flex items-center gap-2">
                 <Package className="w-3.5 h-3.5 text-brand-accent/40" />
                 <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500">12_NODES</span>
               </div>
            </div>
            {/* Background decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-accent/5 blur-3xl rounded-full pointer-events-none group-hover:bg-brand-accent/10 transition-all" />
          </div>
        ))}

        {assets.length === 0 && (
          <button 
            onClick={handleAddAsset}
            className="border-2 border-dashed border-white/5 light:border-slate-400 p-12 rounded-[2rem] flex flex-col items-center justify-center gap-6 text-slate-600 light:text-slate-600 hover:border-brand-accent/30 hover:text-slate-400 light:hover:text-slate-700 transition-all group bg-white/[0.01] light:bg-brand-panel/50"
          >
            <div className="w-20 h-20 rounded-2xl border border-white/5 light:border-slate-200 flex items-center justify-center group-hover:border-brand-accent/20 group-hover:bg-brand-accent/5 transition-all text-slate-700 light:text-slate-500 group-hover:text-brand-accent">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Initalize first cluster</span>
          </button>
        )}
      </div>
    </div>
  );
}
