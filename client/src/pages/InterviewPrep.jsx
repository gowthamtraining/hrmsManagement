import React, { useState } from 'react';
import axios from 'axios';
import { HelpCircle, BrainCircuit, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config';

const InterviewPrep = () => {
    const [role, setRole] = useState('');
    const [level, setLevel] = useState('Senior');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [copied, setCopied] = useState(null);

    const handleGenerate = async () => {
        if (!role) return alert("Please specify the role");
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/ai/generate-questions`, {
                role,
                level
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "AI was unable to generate questions at this moment. Please check your API key.");
        }
        setLoading(false);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="mb-2">AI <span className="gradient-text">Interview Architect</span></h1>
                <p className="text-text-secondary font-medium">Generate high-signal questions tailored to specific roles and levels.</p>
            </header>

            <div className="card mb-10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="md:col-span-2">
                        <label className="block mb-3 font-bold text-sm text-text-secondary uppercase tracking-wider">Target Position</label>
                        <input
                            type="text"
                            className="w-full text-lg py-3"
                            placeholder="e.g. Senior Product Designer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-3 font-bold text-sm text-text-secondary uppercase tracking-wider">Expertise Level</label>
                        <select
                            className="w-full text-lg py-3"
                            style={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '0.85rem', border: '1px solid var(--border-color)', padding: '0.9rem 1.1rem' }}
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            <option value="Junior" style={{ background: '#0f172a', color: '#fff' }}>Junior</option>
                            <option value="Mid-level" style={{ background: '#0f172a', color: '#fff' }}>Mid-level</option>
                            <option value="Senior" style={{ background: '#0f172a', color: '#fff' }}>Senior</option>
                            <option value="Lead/Principal" style={{ background: '#0f172a', color: '#fff' }}>Lead/Principal</option>
                            <option value="Manager" style={{ background: '#0f172a', color: '#fff' }}>Management</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        className="btn btn-primary px-12 py-4 rounded-2xl shadow-xl"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-3" size={24} /> : <Sparkles className="mr-3" size={24} />}
                        Build Question Set
                    </button>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
                    <div className="flex items-center justify-between px-2 mb-8 border-b border-white/5 pb-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-primary/20 rounded-2xl mr-4">
                                <BrainCircuit size={28} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Interview <span className="text-primary">Intelligence</span></h3>
                                <p className="text-text-secondary text-sm">Curated for {level} {role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
                            <Sparkles size={16} className="text-secondary" />
                            <span className="text-xs font-bold text-secondary uppercase tracking-widest">AI Generated</span>
                        </div>
                    </div>
                    {questions.map((q, i) => {
                        const cleanQ = q.replace(/^\d+[\.\)\s]*/, ''); // Remove leading numbers like "1.", "1)", or "1 "
                        return (
                            <div key={i} className="card p-6 flex flex-col md:flex-row items-start group hover:bg-white/[0.03] transition-all border border-white/[0.05] hover:border-primary/20 gap-4 md:gap-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                                    <span className="text-xl font-black tracking-tighter">{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <div className="flex-1 w-full pt-2 overflow-hidden">
                                    <p className="text-[17px] leading-relaxed font-medium text-text-primary/90 break-words">{cleanQ}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(cleanQ, i)}
                                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-4 hover:bg-white/10 rounded-xl transition-all border border-border-color shadow-lg bg-[#0b0e14] shrink-0 self-end md:self-start"
                                    title="Copy to clipboard"
                                >
                                    {copied === i ? <Check size={20} className="text-secondary" /> : <Copy size={20} className="text-text-secondary" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InterviewPrep;
