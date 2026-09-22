import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Doctor } from '../types';
import {
  UserCheck,
  Stethoscope,
  Phone,
  Mail,
  Clock,
  Search,
  Filter,
  Users,
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { doctors, toggleDoctorStatus, patients } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || doc.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(doctors.map((d) => d.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Medical Staff & Physician Roster
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono font-medium border border-slate-700">
              {doctors.filter((d) => d.status === 'on_duty').length} On Duty
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Attending physicians, surgical specialists, on-call schedules, and department coverage.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by physician name, specialty, or department..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => {
          const assignedPatients = patients.filter((p) => p.attendingDoctorId === doc.id);

          return (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-md hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center font-bold text-white shadow-md text-base shrink-0">
                      {doc.name
                        .replace('Dr. ', '')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{doc.name}</h3>
                      <p className="text-xs text-cyan-300 font-medium">{doc.specialty}</p>
                      <span className="text-[10px] text-slate-400">{doc.department}</span>
                    </div>
                  </div>

                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => toggleDoctorStatus(doc.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      doc.status === 'on_duty'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : doc.status === 'on_call'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                    title="Click to toggle status"
                  >
                    {doc.status.replace('_', ' ').toUpperCase()}
                  </button>
                </div>

                {/* Details */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400">{doc.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px] text-slate-400">Shift: {doc.shift || doc.schedule}</span>
                  </div>
                </div>
              </div>

              {/* Inpatients Assigned Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Assigned Census:
                </span>
                <span className="font-mono font-bold text-white">
                  {assignedPatients.length} Patients
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
