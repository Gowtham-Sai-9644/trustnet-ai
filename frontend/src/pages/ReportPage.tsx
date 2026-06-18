import React, { useState } from 'react';
import { reportService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, CheckCircle2, Send, RefreshCw } from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';

const ReportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    reported_phone: '',
    reported_upi: '',
    reported_url: '',
    scam_category: 'Marketplace Scam',
    description: '',
    loss_amount: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "UPI Fraud", "KYC Fraud", "Lottery Scam", 
    "Marketplace Scam", "Investment Scam", "Fake Job Scam", "Advance Payment Scam"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    if (!formData.reported_phone && !formData.reported_upi && !formData.reported_url) {
      setError("Provide at least one indicator — phone, UPI, or URL — to register the incident.");
      return;
    }

    if (formData.description.length < 15) {
      setError("Incident description must be at least 15 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        loss_amount: parseFloat(formData.loss_amount) || 0.0,
        reported_phone: formData.reported_phone || undefined,
        reported_upi: formData.reported_upi || undefined,
        reported_url: formData.reported_url || undefined,
      };

      const result = await reportService.submitReport(payload);
      setSuccessResult(result);
      
      setFormData({
        reported_phone: '',
        reported_upi: '',
        reported_url: '',
        scam_category: 'Marketplace Scam',
        description: '',
        loss_amount: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not process incident submission.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <AppPageHeader 
        title="Report Incident" 
        description="Submit fraud indicators to the threat intelligence graph for investigation."
      />

      <AnimatePresence mode="wait">
        {successResult ? (
          <motion.div 
            key="successCard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <AppCard className="p-8 flex flex-col items-center justify-center text-center space-y-4 border-[#22C55E]/30 !bg-[#22C55E]/5">
              <div className="bg-[#22C55E]/10 p-4 rounded-2xl border border-[#22C55E]/20">
                <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
              </div>
              <h3 className="font-sans font-bold text-sm text-slate-100 uppercase tracking-wider">
                Incident Registered
              </h3>
              <p className="text-slate-400 text-xs font-sans max-w-md leading-relaxed">
                Reference: <code className="text-[#06B6D4] bg-[#070B14] px-2 py-0.5 border border-[#1E293B] rounded font-bold font-mono">{successResult.report_id}</code>
                <br />The indicators have been linked to the active investigation graph.
              </p>
              <button 
                onClick={() => setSuccessResult(null)}
                className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 mt-2"
              >
                Register Another Incident
              </button>
            </AppCard>
          </motion.div>
        ) : (
          <motion.form 
            key="reportForm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <AppCard className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
                <h3 className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
                  <span>Fraud Incident Intake</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-600 uppercase">Form</span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                {/* Coordinates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Scammer UPI</label>
                    <input
                      type="text"
                      name="reported_upi"
                      value={formData.reported_upi}
                      onChange={handleInputChange}
                      placeholder="e.g. transfer.rewards@ybl"
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Scammer Phone</label>
                    <input
                      type="text"
                      name="reported_phone"
                      value={formData.reported_phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 99887 76655"
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Domain / URL</label>
                    <input
                      type="text"
                      name="reported_url"
                      value={formData.reported_url}
                      onChange={handleInputChange}
                      placeholder="e.g. https://scam-lotto.net"
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Category and Loss amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      name="scam_category"
                      value={formData.scam_category}
                      onChange={handleInputChange}
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-sans text-slate-100 focus:outline-none focus:border-[#06B6D4] transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Estimated Loss (INR)</label>
                    <input
                      type="number"
                      name="loss_amount"
                      value={formData.loss_amount}
                      onChange={handleInputChange}
                      placeholder="e.g. 5000"
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Incident Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the transaction sequence, communication handles used, payment gates, and how the scammer terminated contact..."
                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 resize-none font-sans transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 p-3 rounded-xl text-xs text-[#EF4444] font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Incident Report</span>
                  </>
                )}
              </button>
            </AppCard>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportPage;
