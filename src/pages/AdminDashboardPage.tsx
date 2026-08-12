import React, { useState, useEffect } from 'react';
import { subscribeToStaffAuthState, logoutStaff } from '../services/staffAuthService';
import { StaffUser } from '../types';
import {
  ShieldCheck,
  LogOut,
  UserCheck,
  Package,
  Layers,
  Inbox,
  Clock,
  Sparkles,
  Lock,
  Building2,
  CheckCircle2,
  FileText,
  Scissors
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToStaffAuthState((_user, profile) => {
      if (profile && profile.active && ['owner', 'admin', 'editor'].includes(profile.role)) {
        setStaff(profile);
        setLoading(false);
      } else {
        setStaff(null);
        setLoading(false);
        onNavigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [onNavigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutStaff();
      onNavigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#8C7355] border-t-transparent"></div>
          <p className="text-xs uppercase tracking-widest text-[#665E55] font-medium">Verifying Staff Profile & Authorization...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return null; // Will redirect via useEffect
  }

  const roleColors: Record<string, string> = {
    owner: 'bg-[#171513] text-[#D4AF37] border-[#D4AF37]/30',
    admin: 'bg-[#2D2926] text-[#F7F3EC] border-[#8C7355]/40',
    editor: 'bg-[#EBE5DA] text-[#171513] border-[#8C7355]/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F7F3EC] min-h-[85vh]">
      {/* Top Staff Navigation Header */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#171513] text-[#F7F3EC] flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif text-[#171513]">{staff.name}</h1>
              <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${roleColors[staff.role] || roleColors.editor}`}>
                {staff.role}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Active Staff
              </span>
            </div>
            <p className="text-xs text-[#665E55] mt-1 flex items-center gap-2">
              <span>{staff.email}</span>
              <span className="text-[#C5BCB0]">•</span>
              <span className="font-mono text-[11px] text-[#8C7355]">UID: {staff.uid}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#F0EAE1]">
          <button
            onClick={() => onNavigate('/admin/catalog')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F3EC] bg-[#171513] hover:bg-[#2D2926] border border-[#171513] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Manage Catalog</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg transition-colors flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Public Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Security Status Banner */}
      <div className="bg-[#171513] text-[#F7F3EC] p-5 rounded-xl shadow-sm border border-[#2D2926] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2D2926] rounded-lg text-[#D4AF37]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F7F3EC] flex items-center gap-2">
              Lumora Atelier Protected Area
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </h3>
            <p className="text-xs text-[#A8A095] mt-0.5">
              Verified Firebase Auth token + Firestore role Authorization (`/users/{staff.uid}`).
            </p>
          </div>
        </div>
        <div className="text-[11px] text-[#D4AF37] bg-[#2D2926] px-3 py-1.5 rounded-lg border border-[#3D3833] font-mono">
          STATUS: AUTHENTICATED & AUTHORIZED
        </div>
      </div>

      {/* Staff Workspace Summary Grid */}
      <div className="grid grid-[#171513] grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 border border-[#E5DFD5] rounded-xl shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[#171513]">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7355]">Catalog Items</span>
              <Package className="w-5 h-5 text-[#8C7355]" />
            </div>
            <div className="text-2xl font-serif text-[#171513]">Products & Textiles</div>
            <p className="text-xs text-[#665E55] leading-relaxed">
              Manage garments, raw textiles, and editorial collections stored in Firestore with draft/published controls.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/catalog')}
            className="w-full mt-2 py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Open Catalog Manager</span>
          </button>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5DFD5] rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#171513]">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7355]">Customer Submissions</span>
            <Inbox className="w-5 h-5 text-[#8C7355]" />
          </div>
          <div className="text-2xl font-serif text-[#171513]">Restricted Streams</div>
          <p className="text-xs text-[#665E55] leading-relaxed">
            Product inquiries, bespoke sewing requests, and contact forms are accessible to staff roles only.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5DFD5] rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#171513]">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7355]">Role Permissions</span>
            <UserCheck className="w-5 h-5 text-[#8C7355]" />
          </div>
          <div className="text-2xl font-serif text-[#171513] capitalize">{staff.role} Privilege</div>
          <p className="text-xs text-[#665E55] leading-relaxed">
            Authorized to manage atelier records and staff workflows according to your assigned role.
          </p>
        </div>
      </div>

      {/* Staff Management Overview Info */}
      <div className="bg-[#FFFFFF] p-6 border border-[#E5DFD5] rounded-xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#171513] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#8C7355]" />
          Staff Authorization Matrix Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg space-y-1">
            <div className="font-semibold text-[#171513]">Owner Role</div>
            <p className="text-[#665E55] text-[11px]">Full atelier administrative and staff account rights.</p>
          </div>
          <div className="p-4 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg space-y-1">
            <div className="font-semibold text-[#171513]">Admin Role</div>
            <p className="text-[#665E55] text-[11px]">Full catalog and customer inquiry management access.</p>
          </div>
          <div className="p-4 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg space-y-1">
            <div className="font-semibold text-[#171513]">Editor Role</div>
            <p className="text-[#665E55] text-[11px]">Catalog collection content & status editing capabilities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
