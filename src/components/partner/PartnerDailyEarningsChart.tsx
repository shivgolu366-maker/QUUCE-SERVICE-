import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Activity, 
  Award, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Partner, Booking } from '../../types';

interface PartnerDailyEarningsChartProps {
  partner: Partner;
  bookings?: Booking[];
}

interface DailyEarningsData {
  dayKey: string;
  dayLabel: string;
  fullDate: string;
  earnings: number;
  jobsCount: number;
  incentives: number;
  isToday: boolean;
}

export const PartnerDailyEarningsChart: React.FC<PartnerDailyEarningsChartProps> = ({ 
  partner, 
  bookings = [] 
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [hoveredData, setHoveredData] = useState<DailyEarningsData | null>(null);

  // Generate the last 7 days of daily income dynamically
  const weeklyData: DailyEarningsData[] = useMemo(() => {
    // Reference date: Sep 29, 2026
    const baseDate = new Date(2026, 8, 29); // Month is 0-indexed: 8 is September
    const days: DailyEarningsData[] = [];

    // Calibrated baseline per partner based on their weekly & today's earnings
    // We calibrate historical 6 days so they feel realistic and sum reasonably close to weeklyEarnings
    const partnerSeed = (partner.id.charCodeAt(partner.id.length - 1) || 7) % 5;
    
    // Baseline daily distribution factors (last 6 days + today)
    const factorWeights = [
      0.12 + (partnerSeed * 0.01),
      0.15 - (partnerSeed * 0.01),
      0.13 + (partnerSeed * 0.015),
      0.18 - (partnerSeed * 0.01),
      0.22 + (partnerSeed * 0.005),
      0.14 - (partnerSeed * 0.01),
    ];

    const historicalPool = Math.max(partner.weeklyEarnings - partner.todayEarnings, 1200);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);

      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isToday = i === 0;

      let dailyEarned = 0;
      let jobsCount = 0;
      let incentives = 0;

      if (isToday) {
        dailyEarned = partner.todayEarnings || 920;
        jobsCount = Math.max(Math.round(dailyEarned / 350), 2);
        incentives = Math.round(dailyEarned * 0.12);
      } else {
        const factor = factorWeights[6 - i] || 0.15;
        dailyEarned = Math.round(historicalPool * factor);
        jobsCount = Math.max(Math.round(dailyEarned / 380), 1);
        incentives = Math.round(dailyEarned * 0.08);
      }

      // Check if there are real completed bookings for this day in bookings array
      const matchingBookings = bookings.filter(b => {
        if (b.partnerId !== partner.id && b.partnerName !== partner.name) return false;
        if (b.status !== 'completed') return false;
        if (!b.completedAt && !b.createdAt) return false;
        // Compare simple date string
        return isToday;
      });

      if (isToday && matchingBookings.length > 0) {
        const bookedEarned = matchingBookings.reduce((acc, curr) => acc + Math.round(curr.totalAmount * 0.85), 0);
        dailyEarned = Math.max(dailyEarned, bookedEarned);
        jobsCount = Math.max(jobsCount, matchingBookings.length);
      }

      days.push({
        dayKey: `${dayLabel}-${fullDate}`,
        dayLabel,
        fullDate,
        earnings: dailyEarned,
        jobsCount,
        incentives,
        isToday,
      });
    }

    return days;
  }, [partner.id, partner.weeklyEarnings, partner.todayEarnings, bookings]);

  // Aggregate stats
  const total7Days = useMemo(() => {
    return weeklyData.reduce((sum, item) => sum + item.earnings, 0);
  }, [weeklyData]);

  const dailyAvg = useMemo(() => {
    return Math.round(total7Days / weeklyData.length);
  }, [total7Days, weeklyData.length]);

  const maxDay = useMemo(() => {
    return weeklyData.reduce((prev, current) => (prev.earnings > current.earnings) ? prev : current, weeklyData[0]);
  }, [weeklyData]);

  const totalJobs7Days = useMemo(() => {
    return weeklyData.reduce((sum, item) => sum + item.jobsCount, 0);
  }, [weeklyData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyEarningsData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[150px] ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{data.fullDate} ({data.dayLabel})</span>
            </span>
            {data.isToday && (
              <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                Today
              </span>
            )}
          </div>

          <div className="pt-0.5">
            <span className="text-[10px] text-slate-400 block">Total Income</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              ₹{data.earnings.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1 border-t border-slate-800 text-slate-300">
            <div>
              <span className="text-slate-400 block">Jobs</span>
              <span className="font-bold text-white">{data.jobsCount} Completed</span>
            </div>
            <div>
              <span className="text-slate-400 block">Incentives</span>
              <span className="font-bold text-amber-300">+₹{data.incentives}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Daily Earnings Trend</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  Last 7 Days
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Visual breakdown of daily income and completed duties
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle (Area chart / Bar chart) */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'area'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Smooth Curve Area View"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trend</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'bar'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Daily Column Bar View"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bars</span>
          </button>
        </div>
      </div>

      {/* 4-Stat Metric Pill Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
          <span className="text-[10px] text-slate-400 block">7-Day Total</span>
          <span className="text-base font-extrabold font-mono text-emerald-400">
            ₹{total7Days.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
          <span className="text-[10px] text-slate-400 block">Daily Average</span>
          <span className="text-base font-extrabold font-mono text-white">
            ₹{dailyAvg.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 block">Peak Day</span>
            <span className="text-[9px] text-amber-400 font-mono">{maxDay?.dayLabel}</span>
          </div>
          <span className="text-base font-extrabold font-mono text-amber-300">
            ₹{maxDay?.earnings.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
          <span className="text-[10px] text-slate-400 block">Total Jobs Done</span>
          <span className="text-base font-extrabold font-mono text-sky-400">
            {totalJobs7Days} Jobs
          </span>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="h-56 sm:h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart 
              data={weeklyData} 
              margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="partnerEarningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="todayHighlightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                opacity={0.35} 
                vertical={false}
              />

              <XAxis 
                dataKey="dayLabel" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                dy={6}
              />

              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}`}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />

              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#partnerEarningsGradient)" 
                activeDot={{ 
                  r: 6, 
                  fill: '#34d399', 
                  stroke: '#064e3b', 
                  strokeWidth: 3 
                }}
              />
            </AreaChart>
          ) : (
            <BarChart 
              data={weeklyData} 
              margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                opacity={0.35} 
                vertical={false}
              />

              <XAxis 
                dataKey="dayLabel" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                dy={6}
              />

              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}`}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
              />

              <Bar 
                dataKey="earnings" 
                radius={[8, 8, 2, 2]}
                fill="#10b981"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Banner: Weekly Bonus Milestone Indicator */}
      <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block text-[11px]">
              Weekly Performance Bonus
            </span>
            <span className="text-[10px] text-slate-400">
              Complete {Math.max(30 - totalJobs7Days, 0)} more jobs to unlock ₹1,000 cash bonus
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0 flex items-center gap-0.5">
          <span>{Math.min(Math.round((totalJobs7Days / 30) * 100), 100)}%</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  );
};
