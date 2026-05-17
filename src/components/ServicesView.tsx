import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Truck, 
  Sprout, 
  Droplets, 
  Building, 
  Thermometer, 
  ChevronRight,
  ShieldCheck,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Settings,
  Activity,
  Code,
  Layers
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'active' | 'beta' | 'planning';
  details: string;
  features: string[];
}

const SERVICES: Service[] = [
  {
    id: 'smart-energy',
    title: 'Smart Energy Consumption',
    description: 'Real-time monitoring of power usage with peak load alerting and automated reduction protocols.',
    icon: <Zap className="w-6 h-6" />,
    category: 'Utilities',
    status: 'active',
    details: 'The Smart Energy module integrates directly with industrial smart meters to provide sub-second visibility into power consumption. It includes automated load-balancing algorithms that can shed non-critical loads during peak tariff periods.',
    features: ['Real-time KWh monitoring', 'Peak load prediction', 'Automated load shedding', 'Carbon footprint analysis']
  },
  {
    id: 'fleet-mgmt',
    title: 'Fleet & Asset Tracking',
    description: 'High-precision GPS tracking with geofencing and real-time engine diagnostics for entire logistics fleets.',
    icon: <Truck className="w-6 h-6" />,
    category: 'Logistics',
    status: 'active',
    details: 'Advanced telematics for moving assets. Nexus Fleet provides not just coordinates, but deep mechanical health data via OBD-II integration, driver behavior analysis, and route optimization using real-time traffic telemetry.',
    features: ['OBD-II Diagnostics', 'Route Optimization', 'Geofencing Alerts', 'Driver Safety Scoring']
  },
  {
    id: 'smart-agri',
    title: 'Smart Agriculture',
    description: 'Soil moisture, pH, and environmental monitoring to optimize irrigation and crop yield via telemetry.',
    icon: <Sprout className="w-6 h-6" />,
    category: 'Environment',
    status: 'beta',
    details: 'Precision farming powered by the Nexus Mesh. Deploy thousands of low-power soil nodes that communicate via LoRaWAN to provide a topographical map of field health. Integration with weather APIs enables automated irrigation control.',
    features: ['Soil pH & Moisture Map', 'LoRaWAN Mesh Support', 'Automated Irrigation', 'Yield Forecasting']
  },
  {
    id: 'tank-monitoring',
    title: 'Remote Tank Monitoring',
    description: 'Level and pressure sensing for chemical, fuel, and water storage in mission-critical environments.',
    icon: <Droplets className="w-6 h-6" />,
    category: 'Industrial',
    status: 'active',
    details: 'Ultrasonic and pressure sensor integration for bulk storage. This service provides highly accurate volume calculations with temperature compensation, preventing overflows and ensuring supply chain continuity.',
    features: ['Ultrasonic Level Sensing', 'Temp Compensation', 'Leak Detection', 'Refill Scheduling']
  },
  {
    id: 'smart-buildings',
    title: 'HVAC & Facility Control',
    description: 'Centralized management of air quality, temperature, and occupancy sensors for high-rise buildings.',
    icon: <Building className="w-6 h-6" />,
    category: 'Structural',
    status: 'active',
    details: 'Digital twin integration for modern structures. Monitor CO2 levels, occupancy patterns, and thermal comfort across multiple floors. Nexus HVAC autonomously adjusts setpoints to save energy in unoccupied zones.',
    features: ['Digital Twin Integration', 'Air Quality (VOC/CO2)', 'Occupancy Tracking', 'HVAC Automation']
  },
  {
    id: 'predictive-maint',
    title: 'Predictive Analytics',
    description: 'ML models that analyze hardware vibration and thermal stress to predict failure signatures.',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'Intelligence',
    status: 'beta',
    details: 'The intelligence layer of the Nexus platform. Utilizing deep learning, this service scans high-frequency vibration data from motors and pumps to identify the acoustic signatures of bearing failure weeks before they occur.',
    features: ['Acoustic Signature Analysis', 'Thermal Stress Modeling', 'MTBF Estimation', 'Anomaly Notification']
  }
];

export function ServicesView() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (selectedService) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 max-w-6xl mx-auto space-y-16"
      >
        <button 
          onClick={() => setSelectedService(null)}
          className="flex items-center gap-3 text-slate-400 hover:text-white p-2 transition-all font-mono text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Catalog_Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <header className="space-y-8">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-brand-accent/10 border border-brand-accent/20 rounded-[2rem] flex items-center justify-center text-brand-accent shadow-glow transition-all">
                  {React.cloneElement(selectedService.icon as React.ReactElement, { size: 32 })}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-6xl font-bold text-white light:text-slate-900 tracking-tight uppercase leading-none transition-colors font-display">{selectedService.title}</h2>
                    <span className={`font-mono text-[11px] uppercase tracking-widest px-3 py-1 border rounded-full font-bold transition-all ${
                      selectedService.status === 'active' ? 'border-brand-accent/50 text-brand-accent bg-brand-accent/5' : 
                      'border-amber-500/50 text-amber-500 bg-amber-500/5'
                    }`}>
                      {selectedService.status}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-600 font-bold">
                    DOMAIN: {selectedService.category} // SERIAL: {selectedService.id.toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            <div className="space-y-8">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-400 light:text-slate-600 font-bold">Technical Summary</h3>
              <p className="text-slate-200 light:text-slate-800 text-3xl leading-relaxed font-light transition-colors font-display">
                {selectedService.details}
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-slate-400 light:text-slate-600 font-bold">Core Modules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedService.features.map((feature, i) => (
                  <div key={i} className="panel-bg p-8 flex items-center gap-4 border-white/5 light:border-slate-300 bg-white/[0.02] light:bg-brand-panel transition-all">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full shadow-glow" />
                    <span className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-widest transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="panel-bg p-10 border-white/5 light:border-slate-300 space-y-10 sticky top-32 bg-white/[0.02] light:bg-brand-panel transition-all">
              <div className="space-y-8">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold">Hardware_Auth</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] border-b border-white/5 light:border-slate-200 pb-3">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Protocol</span>
                    <span className="text-brand-accent font-mono font-bold">L4_SECURE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-b border-white/5 light:border-slate-200 pb-3">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Latency</span>
                    <span className="text-white light:text-slate-900 font-mono font-bold font-black transition-colors">&lt;15MS</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Mesh_Sync</span>
                    <span className="text-white light:text-slate-900 font-mono font-bold font-black transition-colors">ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 light:border-slate-900/5 space-y-4">
                 <button className="w-full py-5 bg-brand-accent text-brand-bg rounded-2xl font-bold uppercase tracking-widest text-xs shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                   Provision Node
                   <Activity className="w-4 h-4" />
                 </button>
                 <button className="w-full py-5 rounded-2xl border border-white/10 light:border-slate-900/10 text-white light:text-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-white/5 light:hover:bg-slate-900/5 transition-all">
                   Full Specs
                 </button>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] font-mono text-slate-600 uppercase leading-relaxed text-center font-bold tracking-widest">
                  Initializing node will partition 128MB of protected L3 cache and reserve hardware priority interrupts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-20 transition-colors">
      <header className="space-y-6">
        <div className="flex items-center gap-4 transition-all">
          <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-6xl font-bold tracking-tight text-white light:text-slate-900 uppercase leading-none transition-colors font-display">Service Modules</h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500 light:text-slate-600 font-bold leading-relaxed">
          Provision specialized Micro-Services into your physical environment. Standardized API endpoints for high-throughput sensor telemetry.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedService(service)}
            className="panel-bg p-10 group relative overflow-hidden cursor-pointer border-white/5 light:border-slate-300 bg-white/[0.02] light:bg-brand-panel hover:border-brand-accent/30 flex flex-col transition-all"
          >
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-all text-white light:text-slate-900 group-hover:scale-110 group-hover:-rotate-12 transition-all">
               {React.cloneElement(service.icon as React.ReactElement, { size: 160 })}
            </div>
            
            <div className="flex justify-between items-start mb-10 transition-all">
              <div className="w-16 h-16 bg-white/[0.03] light:bg-brand-panel/30 border border-white/10 light:border-slate-200 flex items-center justify-center text-white light:text-slate-900 rounded-2xl group-hover:text-brand-accent group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                {service.icon}
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 border rounded-full font-bold transition-all ${
                service.status === 'active' ? 'border-brand-accent/40 text-brand-accent' : 
                service.status === 'beta' ? 'border-amber-500/40 text-amber-500' : 
                'border-slate-800 text-slate-600'
              }`}>
                {service.status}
              </span>
            </div>

            <h3 className="text-4xl font-bold text-white light:text-slate-900 mb-2 uppercase tracking-tight transition-colors font-display">{service.title}</h3>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600 mb-8 font-bold">{service.category} // PROTOCOL_V1</div>
            
            <p className="text-lg text-slate-500 light:text-slate-600 leading-relaxed mb-12 line-clamp-3 font-medium transition-colors">
              {service.description}
            </p>

            <button className="mt-auto w-full py-5 rounded-2xl border border-white/5 bg-white/[0.03] light:bg-brand-panel/30 font-bold font-mono text-[10px] uppercase tracking-[0.3em] text-white light:text-slate-900 hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent transition-all flex items-center justify-center gap-3 transition-all">
              Provision
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-16 border-2 border-dashed border-white/5 light:border-slate-300 rounded-[3rem] flex flex-col md:flex-row items-center justify-center gap-12 group hover:border-white/10 light:hover:border-slate-300 transition-all bg-white/[0.01] light:bg-brand-panel/50">
        <div className="w-24 h-24 bg-white/[0.02] light:bg-slate-400 border border-white/5 light:border-slate-200 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110">
          <Code className="w-10 h-10 text-slate-700 light:text-slate-400 group-hover:text-brand-accent" />
        </div>
        <div className="text-center md:text-left space-y-4 max-w-lg transition-all">
          <h4 className="text-4xl font-bold text-white light:text-slate-900 uppercase tracking-tight leading-none transition-colors font-display">Logic Architect?</h4>
          <p className="text-slate-500 text-xl leading-relaxed font-medium">Develop custom industrial micro-services for the Nexus protocol using our hardware abstraction library.</p>
          <button className="text-slate-400 light:text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold hover:text-brand-accent transition-colors flex items-center gap-3 decoration-brand-accent/30 underline underline-offset-8 transition-colors">
            Access SDK Environment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
