import React, { useState } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { SubscriptionPlan, ServicePackage } from '../../types';
import { 
  Sparkles, 
  Calendar, 
  Layers, 
  Check, 
  Clock, 
  Percent, 
  Tag, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  RotateCw
} from 'lucide-react';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-cleaning-weekly',
    name: 'Weekly Pristine House Deep Cleaning',
    serviceId: 'srv-cleaning',
    serviceName: 'Deep Home & Bathroom Cleaning',
    category: 'chores',
    frequency: 'weekly',
    visitsPerMonth: 4,
    monthlyPrice: 1399,
    originalMonthlyPrice: 1996,
    discountPercent: 30,
    popularTag: 'Most Popular Pass',
    perks: [
      '4 Scheduled Weekend or Weekday Deep Clean Visits',
      'Free Sofa & Cushion Vacuum Sanitization ($300 value)',
      'Dedicated Top-Rated 4.9★ Cleaner Assigned',
      'Free Rescheduling up to 2 hours before slot'
    ]
  },
  {
    id: 'sub-cook-daily',
    name: 'Daily Chef & Home Cook Monthly Plan',
    serviceId: 'srv-cook',
    serviceName: 'On-Demand Cook & Private Chef',
    category: 'chores',
    frequency: 'monthly',
    visitsPerMonth: 24,
    monthlyPrice: 5999,
    originalMonthlyPrice: 8376,
    discountPercent: 28,
    popularTag: 'Best Value',
    perks: [
      '24 Home-Cooked Fresh Meal Visits per month',
      'Personalized spice, oil & dietary preference',
      'Weekly grocery ingredient planning support',
      'Immediate substitute chef guarantee if regular chef on leave'
    ]
  },
  {
    id: 'sub-mandi-errand',
    name: 'Weekly Sabji Mandi & Kirana Shopping Pass',
    serviceId: 'srv-sabji-mandi',
    serviceName: 'Sabji Mandi / Fresh Vegetables',
    category: 'mobility',
    frequency: 'weekly',
    visitsPerMonth: 4,
    monthlyPrice: 449,
    originalMonthlyPrice: 796,
    discountPercent: 44,
    popularTag: 'Family Essential',
    perks: [
      '4 Priority Mandi / Kirana / Pharmacy Runs',
      'Live Item Checklist ticking with verified cash memos',
      'Direct doorstep hand-delivery in insulated crates',
      'Zero surge pricing during peak morning hours'
    ]
  },
  {
    id: 'sub-driver-commute',
    name: 'Executive Chauffeur Commute Pass (10 Hrs)',
    serviceId: 'srv-driver',
    serviceName: 'On-Demand Chauffeur Driver',
    category: 'mobility',
    frequency: 'monthly',
    visitsPerMonth: 5,
    monthlyPrice: 1999,
    originalMonthlyPrice: 2990,
    discountPercent: 33,
    perks: [
      '10 Hours of manual or automatic car driving credits',
      'Night party return drops & highway certified drivers',
      'Priority instant matching in under 10 minutes',
      'Unused hours roll over to next month'
    ]
  }
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-move-in',
    name: 'Move-In Deep Refresh & Diagnostics',
    category: 'repairs',
    description: 'Complete inspection and deep cleaning for moving into a new flat or annual deep maintenance.',
    bundledPrice: 1899,
    originalPrice: 2697,
    savingsAmount: 798,
    validityDays: 60,
    badge: 'SAVE ₹798',
    popularTag: 'All-in-One Care',
    includedServices: [
      { serviceId: 'srv-cleaning', name: 'Full Home Deep Cleaning & Descaling', visits: 1 },
      { serviceId: 'srv-electrician', name: 'Full Switchboard, MCB & Light Diagnostics', visits: 1 },
      { serviceId: 'srv-plumber', name: 'Pipe Pressure Test & Faucet Leak Fix', visits: 1 }
    ]
  },
  {
    id: 'pkg-festive-care',
    name: 'Festive Season All-Rounder Care Pack',
    category: 'chores',
    description: 'Get your entire home guest-ready with deep cleaning, sofa shampoo, and a party chef.',
    bundledPrice: 2299,
    originalPrice: 3147,
    savingsAmount: 848,
    validityDays: 45,
    badge: 'FESTIVE SPECIAL',
    includedServices: [
      { serviceId: 'srv-cleaning', name: 'Kitchen Degrease + 2 Bathrooms Descale', visits: 1 },
      { serviceId: 'srv-cleaning', name: 'Sofa & Carpet Upholstery Shampooing', visits: 1 },
      { serviceId: 'srv-cook', name: 'Party Cooking (Multi-Dish Celebration Meal)', visits: 1 }
    ]
  },
  {
    id: 'pkg-elderly-assist',
    name: 'Senior Citizen Helper & Errand Care Pack',
    category: 'mobility',
    description: 'Dedicated trustworthy assistance for domestic chores, daily cleaning, and weekly medicine/mandi runs.',
    bundledPrice: 1499,
    originalPrice: 2195,
    savingsAmount: 696,
    validityDays: 30,
    badge: 'FAMILY CARE',
    includedServices: [
      { serviceId: 'srv-maid', name: 'Domestic Helper Assistance (2 Hours)', visits: 2 },
      { serviceId: 'srv-pharmacy', name: 'Medicine & Pharmacy Pickup with Memo', visits: 2 },
      { serviceId: 'srv-sabji-mandi', name: 'Sabji Mandi Fresh Vegetable Run', visits: 2 }
    ]
  }
];

export const PackagesAndSubscriptions: React.FC = () => {
  const { customer, addWalletMoney } = useQuickService();
  const [subTab, setSubTab] = useState<'subscriptions' | 'packages' | 'my_active'>('subscriptions');
  const [purchasedPlanId, setPurchasedPlanId] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setPurchasedPlanId(plan.id);
    setTimeout(() => {
      setPurchasedPlanId(null);
      setSubTab('my_active');
    }, 1500);
  };

  const handleBuyPackage = (pkg: ServicePackage) => {
    setPurchasedPlanId(pkg.id);
    setTimeout(() => {
      setPurchasedPlanId(null);
      setSubTab('my_active');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Subscriptions & Packages
            </h2>
            <p className="text-[11px] text-slate-400">
              Save up to 40% with recurring passes and bundled multi-service packs
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setSubTab('subscriptions')}
          className={`py-2 rounded-lg font-semibold transition-all ${
            subTab === 'subscriptions' 
              ? 'bg-amber-500 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Subscriptions
        </button>

        <button
          onClick={() => setSubTab('packages')}
          className={`py-2 rounded-lg font-semibold transition-all ${
            subTab === 'packages' 
              ? 'bg-amber-500 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bundled Packs
        </button>

        <button
          onClick={() => setSubTab('my_active')}
          className={`py-2 rounded-lg font-semibold transition-all ${
            subTab === 'my_active' 
              ? 'bg-amber-500 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Passes (1)
        </button>
      </div>

      {/* TAB 1: Recurring Subscriptions */}
      {subTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <RotateCw className="w-4 h-4" />
              <span>Weekly & Monthly Auto-Dispatches</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">
              Cancel Anytime
            </span>
          </div>

          <div className="space-y-3">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl space-y-3 shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">
                        {plan.name}
                      </h3>
                      {plan.popularTag && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                          {plan.popularTag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {plan.visitsPerMonth} Scheduled Visits / Month · {plan.frequency.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 line-through">
                        ₹{plan.originalMonthlyPrice}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-mono">
                      SAVE {plan.discountPercent}%
                    </span>
                  </div>
                </div>

                {/* Perks list */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  {plan.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Subscribe Action */}
                <button
                  type="button"
                  onClick={() => handleSubscribe(plan)}
                  disabled={purchasedPlanId === plan.id}
                  className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 transition-all"
                >
                  {purchasedPlanId === plan.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>Subscribed! Activating recurring schedule...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Subscribe Now (₹{plan.monthlyPrice}/mo)</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bundled Service Packages */}
      {subTab === 'packages' && (
        <div className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sky-400">
              <Layers className="w-4 h-4" />
              <span>Bundled Multi-Need Service Packages</span>
            </div>
            <span className="text-[10px] text-sky-300 font-mono font-bold">
              Shared Family Wallet
            </span>
          </div>

          <div className="space-y-3">
            {SERVICE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">
                        {pkg.name}
                      </h3>
                      {pkg.badge && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-sm font-bold font-mono text-amber-400">
                        ₹{pkg.bundledPrice}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 line-through">
                        ₹{pkg.originalPrice}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">
                      Valid {pkg.validityDays} Days
                    </span>
                  </div>
                </div>

                {/* Included Services breakdown */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    What's Included in this Pack:
                  </span>
                  <div className="space-y-1.5">
                    {pkg.includedServices.map((inc, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{inc.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                          {inc.visits} visit
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  type="button"
                  onClick={() => handleBuyPackage(pkg)}
                  disabled={purchasedPlanId === pkg.id}
                  className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  {purchasedPlanId === pkg.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>Package Added! Credits available in wallet.</span>
                    </>
                  ) : (
                    <>
                      <span>Buy Package (Save ₹{pkg.savingsAmount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: My Active Passes */}
      {subTab === 'my_active' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-xs font-bold text-white">
                  Active Recurring Plan
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                AUTO-RENEW ON
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Weekly House Deep Cleaning Pass</span>
                <span className="font-mono text-amber-400 font-bold">3 of 4 visits left</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Next visit auto-scheduled for <strong>Saturday, 10:00 AM</strong>. Assigned Pro: Anita Devi (4.88★).
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Renews on Oct 28, 2026 (₹1,399/mo)</span>
                <span className="text-amber-400 underline cursor-pointer">Modify Slot</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Auto-Renewal Billing</span>
              <button
                type="button"
                onClick={() => setAutoRenew(!autoRenew)}
                className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-colors ${
                  autoRenew ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {autoRenew ? 'ACTIVE (Save 30%)' : 'PAUSED'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
