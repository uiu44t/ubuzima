import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { ActiveNavTab } from '../types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BedDouble,
  Flame,
  Pill,
  Receipt,
  UserCheck,
  Sparkles,
  HeartPulse,
  FlaskConical,
  FileScan,
  Droplet,
  Siren,
  ShieldCheck,
  ShieldAlert,
  User,
  Activity,
  Baby,
  Smile,
  ShoppingBag,
  BookOpen,
  BarChart3,
  Scissors,
  MapPin,
  Globe,
  Lock,
  Cpu,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const {
    emergencyCases,
    beds,
    pharmacy,
    labOrders,
    radiologyOrders,
    bloodInventory,
    ambulances,
    currentRole,
  } = useHospital();

  const emergencyCount = emergencyCases.filter((c) => c.status !== 'admitted').length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const lowStockCount = pharmacy.filter((p) => p.stock <= p.minThreshold).length;
  const pendingLabs = labOrders.filter((l) => l.sampleStatus === 'Ordered' || l.sampleStatus === 'Processing').length;
  const pendingScans = radiologyOrders.filter((r) => r.status === 'Requested').length;
  const dispatchedAmbulances = ambulances.filter((a) => a.currentStatus === 'Dispatched' || a.currentStatus === 'In-Transit').length;
  const lowBloodCount = bloodInventory.filter((b) => b.unitsAvailable <= b.minThreshold).length;

  interface NavItem {
    id: ActiveNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: React.ReactNode;
    badgeColor?: string;
    special?: boolean;
  }

  const nationalNav: NavItem[] = [
    { id: 'dashboard', label: 'National Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'rwanda_national_id', label: 'Rwanda National ID & RHIE', icon: ShieldCheck, badge: 'NIDA', badgeColor: 'bg-emerald-500 text-slate-950 font-bold', special: true },
    { id: 'emergency_locator', label: 'Emergency Facility Locator', icon: MapPin, badge: 'Live GPS', badgeColor: 'bg-rose-500 text-white', special: true },
    { id: 'bed_exchange', label: 'Real-Time Bed Exchange', icon: BedDouble, badge: 'Live Beds', badgeColor: 'bg-sky-500 text-white' },
    { id: 'patient_portal', label: 'Patient Portal (Umurwayi)', icon: User, badge: 'Portal', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
  ];

  const clinicalNav: NavItem[] = [
    { id: 'patients', label: 'Patients & EMR', icon: Users, badge: null },
    { id: 'emergency', label: 'Emergency & Triage', icon: Flame, badge: emergencyCount > 0 ? emergencyCount : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'wards', label: 'Wards & Beds', icon: BedDouble, badge: `${occupiedBeds}/${beds.length}`, badgeColor: 'bg-sky-600 text-white' },
    { id: 'surgery', label: 'Surgery & Operating (OT)', icon: Scissors, badge: null },
    { id: 'maternity', label: 'Maternity & Neonatal', icon: Baby, badge: null },
    { id: 'dental', label: 'Dental Medicine', icon: Smile, badge: null },
    { id: 'chronic_disease', label: 'Chronic Disease Care', icon: HeartPulse, badge: '7 Cohorts', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'immunization', label: 'Immunization (Inkingo)', icon: Baby, badge: 'EPI', badgeColor: 'bg-pink-500 text-white' },
    { id: 'medical_travel', label: 'International Medical Travel', icon: Globe, badge: 'Visa', badgeColor: 'bg-indigo-500 text-white' },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays, badge: null },
  ];

  const diagnosticNav: NavItem[] = [
    { id: 'laboratory', label: 'Laboratory (Laboratwari)', icon: FlaskConical, badge: pendingLabs > 0 ? pendingLabs : null, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
    { id: 'radiology', label: 'Radiology / Imaging', icon: FileScan, badge: pendingScans > 0 ? pendingScans : null, badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
    { id: 'blood_bank', label: 'Blood Bank (Amaraso)', icon: Droplet, badge: lowBloodCount > 0 ? `${lowBloodCount} low` : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'ambulances', label: 'Ambulances & Dispatch', icon: Siren, badge: dispatchedAmbulances > 0 ? `${dispatchedAmbulances} active` : null, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { id: 'e_prescription', label: 'E-Prescription & Safety', icon: FileText, badge: 'RX Safe', badgeColor: 'bg-purple-500 text-white' },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, badge: lowStockCount > 0 ? `${lowStockCount} low` : null, badgeColor: 'bg-amber-500 text-slate-900 font-bold' },
  ];

  const enterpriseNav: NavItem[] = [
    { id: 'billing', label: 'Billing & Cashier', icon: Receipt, badge: null },
    { id: 'accounting', label: 'Accounting & Ledger', icon: BookOpen, badge: null },
    { id: 'procurement', label: 'Procurement & Supply', icon: ShoppingBag, badge: null },
    { id: 'insurance', label: 'Insurance & Claims', icon: ShieldCheck, badge: 'RAMA/MMI', badgeColor: 'bg-emerald-950 text-emerald-300' },
    { id: 'analytics', label: 'Hospital Analytics', icon: BarChart3, badge: null },
    { id: 'staff', label: 'Medical Staff', icon: UserCheck, badge: null },
    { id: 'integration_hub', label: 'RHIE Hub & Drones', icon: Cpu, badge: 'Zipline', badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
    { id: 'security_center', label: 'Security & Compliance', icon: Lock, badge: 'Law 058', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'system_settings', label: 'Enterprise Admin & Audit', icon: ShieldAlert, badge: currentRole.toUpperCase(), badgeColor: 'bg-indigo-950 text-indigo-300' },
    { id: 'ai_assistant', label: 'AI Clinical Assistant', icon: Sparkles, badge: 'Gemini 3', badgeColor: 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white', special: true },
  ];

  const renderNavSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : item.special
                ? 'bg-slate-800/60 hover:bg-slate-800 text-cyan-200 border border-cyan-800/40'
                : 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : item.special
                    ? 'text-cyan-400'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge && (
              <span
                className={`ml-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-700 text-slate-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0">
      <nav className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {renderNavSection('National Network & RHIE', nationalNav)}
        {renderNavSection('Clinical & Specialized Care', clinicalNav)}
        {renderNavSection('Diagnostics & Ancillary', diagnosticNav)}
        {renderNavSection('Enterprise & Governance', enterpriseNav)}
      </nav>

      {/* Hospital System Status Badge */}
      <div className="mt-auto p-3.5 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400 inline" />
              HMS Enterprise 2026
            </div>
            <div className="text-[10px] text-slate-400">Active Role: {currentRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
