import React, { useState, useEffect, useRef } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Activity,
  BedDouble,
  Clock,
  UserPlus,
  RefreshCw,
  Flame,
  Sparkles,
  Building2,
  Bell,
  User,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { ActiveNavTab, UserRole } from '../types';

interface HeaderProps {
  onOpenRegisterModal: () => void;
  onOpenTriageModal: () => void;
  onNavigateTab: (tab: ActiveNavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegisterModal,
  onOpenTriageModal,
  onNavigateTab,
}) => {
  const {
    patients,
    beds,
    emergencyCases,
    resetAllData,
    branches,
    currentBranchId,
    setCurrentBranchId,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
  } = useHospital();

  const [time, setTime] = useState<string>('');
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const emergencyCount = emergencyCases.filter((c) => c.status !== 'admitted').length;
  const highUrgencyCount = emergencyCases.filter(
    (c) => c.status !== 'admitted' && (c.esiLevel === 1 || c.esiLevel === 2)
  ).length;

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const activeBranch = branches.find((b) => b.id === currentBranchId) || branches[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Hospital Brand & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => onNavigateTab('dashboard')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 shrink-0 cursor-pointer"
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  onClick={() => onNavigateTab('dashboard')}
                  className="font-bold text-base sm:text-lg tracking-tight text-slate-100 flex items-center gap-1.5 truncate cursor-pointer"
                >
                  Metropolitan Hospital System
                </h1>
                {/* Branch Selector Dropdown */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] text-cyan-300">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <select
                    value={currentBranchId}
                    onChange={(e) => setCurrentBranchId(e.target.value)}
                    className="bg-transparent text-[11px] font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400 hidden lg:block truncate">
                Level 1 Trauma Center • Cardiology, Radiology & Blood Bank Core
              </p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden xl:flex items-center gap-3 text-xs">
            {/* Bed Occupancy */}
            <button
              onClick={() => onNavigateTab('wards')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/60 transition-colors"
              title="Click to view Wards & Beds"
            >
              <BedDouble className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300 font-medium">Beds:</span>
              <span className="font-mono font-bold text-white">
                {occupiedBeds}/{totalBeds} ({occupancyRate}%)
              </span>
            </button>

            {/* Emergency Live Triage */}
            <button
              onClick={() => onNavigateTab('emergency')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                highUrgencyCount > 0
                  ? 'bg-rose-950/40 border-rose-700/50 hover:bg-rose-900/40 text-rose-200 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-700/60 text-slate-300'
              }`}
              title="Click to view Emergency Queue"
            >
              <Flame className={`w-4 h-4 ${highUrgencyCount > 0 ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className="font-medium">Emergency:</span>
              <span className="font-mono font-bold">{emergencyCount}</span>
              {highUrgencyCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                  {highUrgencyCount} STAT
                </span>
              )}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Patient Portal Shortcut */}
            <button
              id="header-btn-patient-portal"
              onClick={() => onNavigateTab('patient_portal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 font-medium text-xs transition-colors whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Patient</span> Portal
            </button>

            {/* Quick Emergency Intake */}
            <button
              id="header-btn-emergency-intake"
              onClick={onOpenTriageModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">Emergency</span> Intake
            </button>

            {/* Register Patient */}
            <button
              id="header-btn-register-patient"
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Register</span> Patient
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                id="header-btn-notifications"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Notifications & SMS Broadcasts"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-xs space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      Ubutumwa & Imimenyeshereze
                    </span>
                    <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          n.isRead
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-cyan-800/50 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.sentAt}</span>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-300 leading-tight">{n.message}</p>
                        <div className="text-[9px] text-cyan-400 mt-1 uppercase font-semibold">
                          To: {n.recipientName || n.recipientType || 'All Staff'} ({n.channel})
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      onNavigateTab('system_settings');
                    }}
                    className="w-full py-1.5 text-center text-xs font-bold text-cyan-400 hover:underline"
                  >
                    Fungura SMS Broadcast Center →
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <Shield className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1" />
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none pr-1"
                title="Current System Role"
              >
                <option value="super_admin" className="bg-slate-900">Admin</option>
                <option value="doctor" className="bg-slate-900">Doctor</option>
                <option value="nurse" className="bg-slate-900">Nurse</option>
                <option value="pharmacist" className="bg-slate-900">Pharmacist</option>
                <option value="lab_technician" className="bg-slate-900">Lab Tech</option>
                <option value="radiologist" className="bg-slate-900">Radiology</option>
                <option value="accountant" className="bg-slate-900">Accountant</option>
                <option value="patient" className="bg-slate-900">Patient</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
