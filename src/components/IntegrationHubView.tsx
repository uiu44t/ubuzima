import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Zap,
  ShieldCheck,
  Building,
  CreditCard,
  MessageSquare,
  Plane,
  FlaskConical,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { MOCK_INTEGRATIONS } from '../data/mockRwandaNationalData';
import { NationalIntegration } from '../types';
import { useHospital } from '../context/HospitalContext';

export const IntegrationHubView: React.FC = () => {
  const { showToast } = useHospital();
  const [integrations, setIntegrations] = useState<NationalIntegration[]>(MOCK_INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Zipline Drone Modal
  const [showZiplineModal, setShowZiplineModal] = useState<boolean>(false);
  const [droneCargo, setDroneCargo] = useState<string>('2 Units O- Negative Emergency Blood + Snake Antivenom');
  const [destinationFacility, setDestinationFacility] = useState<string>('Nyagatare Hospital ED');
  const [droneDispatched, setDroneDispatched] = useState<boolean>(false);

  const filtered = integrations.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const handlePing = (id: string, name: string) => {
    setPingingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'CONNECTED',
                last_ping_ms: Math.floor(25 + Math.random() * 45),
                last_sync: 'Just now',
              }
            : item
        )
      );
      setPingingId(null);
      showToast({
        title: 'Integration Handshake OK',
        message: `${name} responded with 200 OK (Latency < 45ms).`,
        type: 'success',
      });
    }, 800);
  };

  const handleLaunchZipline = (e: React.FormEvent) => {
    e.preventDefault();
    setDroneDispatched(true);
    showToast({
      title: 'Zipline Drone In Flight',
      message: `ZIP-RW-09 flight launched towards ${destinationFacility}. ETA: 18 minutes.`,
      type: 'success',
    });
    setTimeout(() => {
      setDroneDispatched(false);
      setShowZiplineModal(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  National Healthcare Integration Gateway (RHIE)
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    HL7 / FHIR R4 Ready
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Federated interoperability hub connecting NIDA, RSSB, MINISANTE RHIE, MTN MoMo, Zipline Autonomous Drones, and RBC Reference Laboratories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="zipline-drone-dispatch-btn"
              onClick={() => setShowZiplineModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-900/40"
            >
              <Plane className="w-3.5 h-3.5" />
              Emergency Zipline Drone Dispatch
            </button>
          </div>
        </div>

        {/* Integration Categories Filter */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              All Hubs ({integrations.length})
            </button>
            <button
              onClick={() => setSelectedCategory('GOVERNMENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'GOVERNMENT'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              🏛️ Government & RHIE
            </button>
            <button
              onClick={() => setSelectedCategory('PAYMENTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'PAYMENTS'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              💳 Payment Gateways
            </button>
            <button
              onClick={() => setSelectedCategory('LOGISTICS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'LOGISTICS'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              🛸 Autonomous Logistics (Zipline)
            </button>
            <button
              onClick={() => setSelectedCategory('COMMUNICATION')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'COMMUNICATION'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              📲 SMS & WhatsApp Gateways
            </button>
            <button
              onClick={() => setSelectedCategory('EXTERNAL_LABS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === 'EXTERNAL_LABS'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              🔬 Reference Labs (RBC/NRL)
            </button>
          </div>
        </div>
      </div>

      {/* Integration Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isConnected = item.status === 'CONNECTED';
          const isDegraded = item.status === 'DEGRADED';
          const isPinging = pingingId === item.id;

          return (
            <div
              key={item.id}
              id={`integration-card-${item.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{item.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.provider}</div>
                  </div>

                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isDegraded
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{item.description}</p>

                {/* Technical telemetry */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="font-mono text-[11px] text-cyan-300 truncate max-w-[160px]">
                      {item.endpoint_url}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Round-trip Latency:</span>
                    <span className="font-mono text-emerald-400 font-bold">{item.last_ping_ms} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Success Rate:</span>
                    <span className="font-semibold text-slate-200">{item.success_rate_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Synced:</span>
                    <span className="text-slate-300">{item.last_sync}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  id={`ping-integration-${item.id}`}
                  disabled={isPinging}
                  onClick={() => handlePing(item.id, item.name || item.display_name)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPinging ? 'animate-spin' : ''}`} />
                  {isPinging ? 'Testing Handshake...' : 'Ping Endpoint & Verify API'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zipline Drone Dispatch Modal */}
      {showZiplineModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Plane className="w-5 h-5 animate-bounce" />
                <h3 className="text-base font-bold text-slate-100">Zipline Autonomous Drone Emergency Launch</h3>
              </div>
              <button
                onClick={() => setShowZiplineModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {droneDispatched ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-100">Zipline Drone Air-Dropped & Telemetry Active</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Flight ZIP-RW-09 launched from Muhanga Distribution Nest. Cargo will parachute at{' '}
                  <strong className="text-slate-200">{destinationFacility}</strong> dropzone.
                </p>
                <div className="text-[11px] font-mono text-cyan-400 bg-slate-800 p-2.5 rounded-xl">
                  Speed: 101 km/h • Flight Altitude: 120m AGL • ETA: 18 Minutes
                </div>
              </div>
            ) : (
              <form onSubmit={handleLaunchZipline} className="space-y-4 text-xs">
                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Distribution Center</div>
                  <div className="text-sm font-bold text-slate-200">Muhanga Zipline Nest (Southern Hub)</div>
                  <div className="text-xs text-slate-400 mt-0.5">Cold-chain certified blood & anti-venom repository</div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Emergency Medical Cargo</label>
                  <input
                    type="text"
                    required
                    value={droneCargo}
                    onChange={(e) => setDroneCargo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Facility Dropzone</label>
                  <input
                    type="text"
                    required
                    value={destinationFacility}
                    onChange={(e) => setDestinationFacility(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowZiplineModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    id="submit-drone-launch"
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-md shadow-rose-900/40"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    Authorize & Launch Drone Flight
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
