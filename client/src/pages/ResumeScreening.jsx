import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Search, CheckCircle, AlertCircle, Loader2, FileText, Briefcase } from 'lucide-react';

const ResumeScreening = () => {
    const [resumeText, setResumeText] = useState('');
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!resumeText || !jd) return alert("Please provide both resume and job description.");
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/analyze-resume', {
                resumeText,
                jobDescription: jd
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Error analyzing resume");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-10">
                <h1 className="mb-2">AI <span className="gradient-text">Resume Screener</span></h1>
                <p className="text-text-secondary font-medium">Evaluate candidates against complex JD requirements instantly.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col">
                    <label className="mb-4 font-bold flex items-center text-text-primary">
                        <Briefcase size={20} className="mr-2 text-primary" /> Job Description
                    </label>
                    <textarea 
                        className="h-[300px] text-sm"
                        placeholder="Paste the target job description here..."
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="mb-4 font-bold flex items-center text-text-primary">
                        <FileText size={20} className="mr-2 text-primary" /> Candidate Resume
                    </label>
                    <textarea 
                        className="h-[300px] text-sm"
                        placeholder="Paste resume text or extract content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <button 
                    className="btn btn-primary px-10 py-4 text-lg"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-3" size={24} /> : <Search className="mr-3" size={24} />}
                    Run AI Analysis
                </button>
            </div>

            {result && (
                <div className="card glass border-primary/30 animate-in zoom-in duration-500">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-border-color pb-6">
                        <div>
                            <h2 className="mb-1">Analysis Scorecard</h2>
                            <p className="text-text-secondary">Based on Gemini 1.5 Flash evaluation</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                            <span className="text-sm font-bold text-text-secondary mr-4">MATCH QUALITY</span>
                            <span className="text-4xl font-black text-primary">{result.score}%</span>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h3 className="mb-3 text-lg">Executive Summary</h3>
                        <p className="text-text-secondary leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
                            {result.summary}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20">
                            <h4 className="text-secondary font-bold mb-4 flex items-center">
                                <CheckCircle size={20} className="mr-2" /> Top Strengths
                            </h4>
                            <ul className="space-y-3">
                                {result.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 mr-3 shrink-0"></div>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-danger/5 rounded-2xl border border-danger/20">
                            <h4 className="text-danger font-bold mb-4 flex items-center">
                                <AlertCircle size={20} className="mr-2" /> Critical Gaps
                            </h4>
                            <ul className="space-y-3">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i} className="flex items-start text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-danger mt-2 mr-3 shrink-0"></div>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeScreening;
