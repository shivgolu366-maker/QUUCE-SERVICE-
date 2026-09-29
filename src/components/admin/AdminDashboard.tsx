import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Partner, Coupon } from '../../types';
import { 
  TrendingUp, 
  Users, 
  HardHat, 
  ShieldAlert, 
  Sliders, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Check, 
  X, 
  DollarSign, 
  ArrowUpRight, 
  Search, 
  Clock, 
  MapPin, 
  FileText, 
  Calendar,
  Layers,
  Smartphone,
  Code2
} from 'lucide-react';
import { FlutterExportView } from '../flutter/FlutterExportView';
import { ArchitectureBlueprint } from '../blueprint/ArchitectureBlueprint';

type AdminTab = 'overview' | 'partners' | 'bookings' | 'pricing' | 'coupons' | 'sos' | 'developer' | 'blueprint';

export const AdminDashboard: React.FC = () => {
  const { 
    partners, 
    bookings, 
    customer, 
    coupons, 
    adminMetrics, 
    updateSurgeMultiplier, 
    updateCommissionRate,
    verifyPartnerKYC,
    addCoupon,
    toggleCoupon,
    emergencyAlerts,
    resolveEmergencyAlert,
    updateJobStatus
  } = useQuickService();

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('developer') || hash.includes('flutter') || hash.includes('apk')) return 'developer';
      if (hash.includes('blueprint')) return 'blueprint';
    }
    return 'overview';
  });
  const [partnerFilter, setPartnerFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [selectedPartnerKYC, setSelectedPartnerKYC] = useState<Partner | null>(null);

  // New coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('20');
  const [newCouponMax, setNewCouponMax] = useState('150');
  const [newCouponMin, setNewCouponMin] = useState('299');

  const pendingKYCPartners = partners.filter(p => p.kycStatus === 'pending' || p.kycDocs.some(d => d.status === 'pending'));

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      description: newCouponDesc.trim() || `Flat ${newCouponPercent}% OFF up to ₹${newCouponMax}`,
      discountPercent: parseInt(newCouponPercent, 10) || 20,
      maxDiscount: parseInt(newCouponMax, 10) || 150,
      minOrder: parseInt(newCouponMin, 10) || 299,
      active: true
    };
    addCoupon(newCoupon);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col min-h-screen">
      
      {/* Top Admin Sub-Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Quick Service Admin Operations
            </h1>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
              SYSTEM LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-service dispatch, regulatory compliance, and dynamic revenue controls
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'partners', label: `Partners (${pendingKYCPartners.length} pending)`, icon: HardHat },
            { id: 'bookings', label: 'Live Bookings', icon: Calendar },
            { id: 'pricing', label: 'Dynamic Pricing', icon: Sliders },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'sos', label: `SOS Alerts (${emergencyAlerts.filter(a => a.status === 'active').length})`, icon: ShieldAlert },
            { id: 'developer', label: 'Developer APK & Source', icon: Smartphone },
            { id: 'blueprint', label: 'Architecture Spec', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        
        {/* KPI Metric Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Platform GMV</span>
            <div className="text-2xl font-bold font-mono text-white">₹{adminMetrics.totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +18.4% vs last week
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Net Platform Take ({Math.round(adminMetrics.platformTakeRate * 100)}%)</span>
            <div className="text-2xl font-bold font-mono text-amber-400">
              ₹{Math.round(adminMetrics.totalRevenue * adminMetrics.platformTakeRate).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Commission after partner payouts</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Online Pros</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {partners.filter(p => p.isOnline).length} / {partners.length}
            </div>
            <div className="text-[10px] text-slate-400">Ready for instant dispatch in 5km</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Avg Doorstep Arrival</span>
            <div className="text-2xl font-bold font-mono text-sky-400">
              11.2 min
            </div>
            <div className="text-[10px] text-slate-400">Within standard 30 min SLA</div>
          </div>
        </div>

        {/* Tab 1: Overview & Recent Activity */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Operations Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Live Bookings Activity
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    {bookings.length} Total Bookings
                  </span>
                </div>

                <div className="space-y-2.5">
                  {bookings.slice(0, 5).map(b => (
                    <div 
                      key={b.id} 
                      className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                          b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {b.category === 'repairs' ? 'REP' : b.category === 'chores' ? 'CHO' : 'MOB'}
                        </div>
                        <div>
                          <div className="font-bold text-white">{b.serviceName}</div>
                          <div className="text-[10px] text-slate-400">
                            {b.customerName} · {b.customerAddress.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-white">₹{b.totalAmount}</div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                          b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Priority KYC Action Box */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Partner Approvals Queue
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {pendingKYCPartners.length} Action Needed
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingKYCPartners.map(partner => (
                    <div key={partner.id} className="p-3 bg-slate-800/60 rounded-xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{partner.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">NEW APPLICANT</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Applied for {partner.categoryName} · {partner.experienceYears} yrs exp
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPartnerKYC(partner);
                          setActiveTab('partners');
                        }}
                        className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        Inspect & Verify Documents
                      </button>
                    </div>
                  ))}
                  {pendingKYCPartners.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">All partner applications verified!</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Partner Verification Management */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPartnerFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${partnerFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  All Partners ({partners.length})
                </button>
                <button
                  onClick={() => setPartnerFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${partnerFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  Pending Review ({pendingKYCPartners.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners
                .filter(p => partnerFilter === 'all' ? true : p.kycStatus === 'pending')
                .map(partner => (
                  <div key={partner.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700">
                          <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{partner.name}</h4>
                          <span className="text-[10px] text-slate-400 block">{partner.categoryName}</span>
                          <span className="text-[10px] text-amber-400 font-mono">★ {partner.rating} · {partner.totalJobs} jobs</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        partner.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {partner.kycStatus}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
                      <div className="text-slate-400 font-semibold">Submitted KYC Documents:</div>
                      {partner.kycDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-slate-300">{doc.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono text-[9px] px-1 rounded ${
                              doc.status === 'verified' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {doc.status}
                            </span>
                            {doc.status === 'pending' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => verifyPartnerKYC(partner.id, doc.type, true)}
                                  className="w-5 h-5 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-[10px]"
                                  title="Approve Document"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => verifyPartnerKYC(partner.id, doc.type, false, 'Document photo blurry')}
                                  className="w-5 h-5 rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-[10px]"
                                  title="Reject Document"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Vehicle: {partner.vehicleInfo || 'None'}</span>
                      <span className="font-mono text-emerald-400">Wallet: ₹{partner.walletBalance}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 3: Live Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">
              All Orders Dispatch Controller
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Assigned Partner</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-amber-400 font-bold">{b.id}</td>
                      <td className="p-3 font-semibold text-white">{b.serviceName}</td>
                      <td className="p-3">{b.customerName}</td>
                      <td className="p-3">{b.partnerName || 'Unassigned'}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">₹{b.totalAmount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {b.status !== 'completed' && b.status !== 'cancelled' ? (
                          <button
                            onClick={() => updateJobStatus(b.id, 'completed')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 border border-slate-700"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">No Action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Dynamic Pricing & Surge Controls */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Surge Multiplier Slider */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Surge Pricing Engine</h3>
                  <p className="text-xs text-slate-400">Applies dynamic multiplier during peak rain or high demand</p>
                </div>
                <span className="text-xl font-bold font-mono text-amber-400">
                  {adminMetrics.surgeMultiplier.toFixed(1)}x
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={adminMetrics.surgeMultiplier}
                  onChange={e => updateSurgeMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Moderate)</span>
                  <span>2.0x (Rain/Storm)</span>
                  <span>2.5x (Max Peak)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                Current Effect: A ₹249 plumbing task will dynamically bill as{' '}
                <strong className="text-amber-400 font-mono">₹{Math.round(249 * adminMetrics.surgeMultiplier)}</strong>.
              </div>
            </div>

            {/* Platform Take Rate / Commission Split */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Platform Take Rate Split</h3>
                  <p className="text-xs text-slate-400">Commission retained by Quick Service per completed job</p>
                </div>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {Math.round(adminMetrics.platformTakeRate * 100)}%
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0.10"
                  max="0.30"
                  step="0.01"
                  value={adminMetrics.platformTakeRate}
                  onChange={e => updateCommissionRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>10% (Low take)</span>
                  <span>18% (Standard)</span>
                  <span>25% (High take)</span>
                  <span>30% (Max)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                Partner payout share: <strong className="text-emerald-400 font-mono">{Math.round((1 - adminMetrics.platformTakeRate) * 100)}%</strong> goes directly into partner wallet on completion.
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Discount Coupons Management */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Coupon Form */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">Create New Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MONSOON25"
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 25% OFF on cleaning"
                    value={newCouponDesc}
                    onChange={e => setNewCouponDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Discount %</label>
                    <input
                      type="number"
                      value={newCouponPercent}
                      onChange={e => setNewCouponPercent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={newCouponMax}
                      onChange={e => setNewCouponMax(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={newCouponMin}
                      onChange={e => setNewCouponMin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-colors"
                >
                  Publish Coupon
                </button>
              </form>
            </div>

            {/* Existing Coupons List */}
            <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">Active Promotional Codes</h3>
              <div className="space-y-3">
                {coupons.map(coupon => (
                  <div key={coupon.code} className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {coupon.code}
                        </span>
                        <span className="text-xs text-white font-semibold">
                          {coupon.discountPercent}% OFF (Up to ₹{coupon.maxDiscount})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {coupon.description} · Min Order ₹{coupon.minOrder}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleCoupon(coupon.code)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        coupon.active 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {coupon.active ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: SOS Emergency Monitor */}
        {activeTab === 'sos' && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>24/7 Rapid Emergency Response Incident Desk</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time GPS coordinate broadcasts and incident resolution tracking
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {emergencyAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.status === 'active' 
                      ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-500/10' 
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          alert.status === 'active' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {alert.status}
                        </span>
                        <span className="text-xs font-bold text-white">{alert.userName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({alert.userPhone})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{alert.location}</span>
                      </div>
                      <p className="text-[11px] text-rose-300 mt-1">{alert.notes}</p>
                    </div>

                    {alert.status === 'active' ? (
                      <button
                        onClick={() => resolveEmergencyAlert(alert.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Developer APK, GitHub CI/CD & Source Code Hub */}
        {activeTab === 'developer' && (
          <div className="-mx-4 sm:-mx-6 -mb-6">
            <FlutterExportView />
          </div>
        )}

        {/* Tab 8: System Architecture & MVP Blueprint */}
        {activeTab === 'blueprint' && (
          <div className="-mx-4 sm:-mx-6 -mb-6">
            <ArchitectureBlueprint />
          </div>
        )}

      </div>

    </div>
  );
};
