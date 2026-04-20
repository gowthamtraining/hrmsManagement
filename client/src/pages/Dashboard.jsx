import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileCheck, Calendar, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';


const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="card">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
            <ArrowUpRight size={12} className="mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-text-secondary text-xs font-semibold mb-1 uppercase tracking-wider">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalWorkforce: 0,
        attendanceToday: 0,
        aiResumesScreened: 0,
        employeeNps: '0',
        openPostings: 0,
        chartData: []
    });
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/dashboard`)
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleAISummary = async () => {
        setIsAiLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/ai/dashboard-summary`, { stats });
            setAiSummary(res.data.summary);
            setShowAiModal(true);
        } catch (err) {
            alert('Failed to generate AI summary. Ensure your Gemini API Key is configured.');
        }
        setIsAiLoading(false);
    };

    return (
        <div className="w-full relative">
            {/* Decorative background glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="flex justify-between items-center mb-10 relative z-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">HR Insights <span className="gradient-text">Overview</span></h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <p className="text-text-secondary font-semibold text-xs uppercase tracking-widest">Live System Analytics • Q2 2026</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline border-white/10 hover:bg-white/5">
                        <Calendar size={18} className="mr-2" /> Schedule Report
                    </button>
                    <button 
                        className="btn btn-primary shadow-lg shadow-primary/30"
                        onClick={handleAISummary}
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? <Sparkles className="animate-spin mr-2" size={18} /> : <Sparkles size={18} className="mr-2" />}
                        {isAiLoading ? 'Analyzing...' : 'AI Summary'}
                    </button>
                </div>
            </header>

            {/* AI Summary Modal */}
            {showAiModal && (
                <div className="modal-overlay" onClick={() => setShowAiModal(false)}>
                    <div className="modal-content relative" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                                <Sparkles size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">AI Strategic <span className="text-primary">Analysis</span></h2>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 leading-relaxed text-text-primary/90">
                            {aiSummary}
                        </div>
                        <div className="mt-8">
                            <button className="btn btn-primary w-full" onClick={() => setShowAiModal(false)}>Acknowledge Insight</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="stats-grid mb-10 relative z-10">
                <StatCard title="Active Workforce" value={stats.totalWorkforce} icon={<Users size={24} />} color="#6366f1" trend="+12.5%" />
                <StatCard title="AI Resumes Screened" value={stats.aiResumesScreened} icon={<FileCheck size={24} />} color="#10b981" trend="+24.1%" />
                <StatCard title="Employee NPS" value={stats.employeeNps} icon={<TrendingUp size={24} />} color="#f59e0b" trend="+3.2%" />
                <StatCard title="Open Postings" value={stats.openPostings} icon={<Calendar size={24} />} color="#3b82f6" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mb-10 relative z-10">
                <div className="card flex-[1.5]" style={{ minHeight: '400px', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Performance Matrix</h3>
                            <p className="text-text-secondary text-xs mt-1">Cross-departmental performance index</p>
                        </div>
                        <div className="flex gap-2">
                           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider">
                               <div className="w-2 h-2 rounded-full bg-primary"></div> Efficiency
                           </div>
                        </div>
                    </div>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b', fontWeight: 600}} axisLine={{stroke: 'rgba(255,255,255,0.05)'}} tickLine={false} dy={10} />
                                <YAxis fontSize={10} tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} 
                                    itemStyle={{ color: '#fff', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="performance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card flex-1" style={{ minHeight: '400px', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <h3 className="text-xl font-bold mb-8">Hiring Velocity</h3>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis fontSize={10} tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} 
                                />
                                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card border-none relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                        <Sparkles size={24} className="text-secondary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">AI Talent Intelligence</h3>
                        <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest">Global Predictive Analysis</p>
                    </div>
                </div>
                <div className="p-6 bg-black/20 rounded-2xl border border-white/5 relative z-10">
                    <p className="text-[15px] font-medium leading-relaxed text-text-primary/90">
                        <span className="text-secondary font-bold">Insight:</span> High churn risk detected in <strong className="text-white">Infrastructure Squad</strong>. 
                        Internal metrics suggest increasing 'Remote Flexibility' could improve retention by <span className="text-primary font-black">22%</span> based on latest mood-tracking analysis. 
                        Resume screenings show <strong className="text-white">Sarah Chen</strong> is a top-tier candidate for the upcoming Design Lead role.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
