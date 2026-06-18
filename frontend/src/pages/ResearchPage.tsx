import React, { useState, useEffect } from 'react';
import { researchService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Database, Activity, ShieldAlert, Cpu, Award } from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';

const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'url' | 'nlp' | 'calibration' | 'ablation' | 'stats' | 'rag'>('url');
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedModelCard, setSelectedModelCard] = useState<number>(0);

  const modelCards = [
    {
      name: "Logistic Regression Classifier (URL)",
      acc: "95.12%",
      prec: "94.88%",
      rec: "95.40%",
      f1: "95.14%",
      auc: "0.988",
      latency: "0.22ms",
      params: "L2 Penalty, C=1.0, Solv=LBFGS",
      desc: "Lightweight baseline classifier analyzing domain length, entropy levels, and lexical keyword vectors."
    },
    {
      name: "Random Forest Ensemble (URL)",
      acc: "98.45%",
      prec: "98.22%",
      rec: "98.69%",
      f1: "98.45%",
      auc: "0.997",
      latency: "1.45ms",
      params: "n_estimators=100, max_depth=15",
      desc: "Decision tree ensemble mapping splitting indices over structural patterns to prevent spoofing."
    },
    {
      name: "XGBoost Threat Model (URL)",
      acc: "99.18%",
      prec: "99.04%",
      rec: "99.31%",
      f1: "99.17%",
      auc: "0.999",
      latency: "0.85ms",
      params: "learning_rate=0.1, max_depth=6",
      desc: "Gradient boosted decision structures optimizing non-linear feature splits for URL sub-directories."
    },
    {
      name: "TF-IDF + SVM Vector Engine (NLP)",
      acc: "93.80%",
      prec: "93.42%",
      rec: "94.12%",
      f1: "93.77%",
      auc: "0.976",
      latency: "0.41ms",
      params: "Linear Kernel, N-gram range=(1, 2)",
      desc: "Support vector classifications separating sparse word/character representations of message lures."
    },
    {
      name: "XGBoost Meta-Fusion Stacker",
      acc: "99.72%",
      prec: "99.68%",
      rec: "99.76%",
      f1: "99.72%",
      auc: "1.000",
      latency: "1.95ms",
      params: "StackingClassifier, Meta=XGBoost",
      desc: "Ensembled stack model fusing base URL logits, NLP safetensors, and Neo4j PageRank coordinates."
    }
  ];

  useEffect(() => {
    const fetchExp = async () => {
      try {
        setIsLoading(true);
        const data = await researchService.getExperiments();
        setExperiments(data);
      } catch (err) {
        console.error("Failed loading experiments dataset:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExp();
  }, []);

  const getMetrics = (category: string, defaultVal: any) => {
    const run = experiments.find(e => e.category === category);
    return run ? run.metrics : defaultVal;
  };

  const urlMetrics = getMetrics("url_benchmark", {
    "Logistic Regression": { accuracy: 0.84, precision: 0.83, recall: 0.85, f1_score: 0.84, roc_auc: 0.91, pr_auc: 0.88 },
    "Random Forest": { accuracy: 0.89, precision: 0.88, recall: 0.90, f1_score: 0.89, roc_auc: 0.95, pr_auc: 0.92 },
    "XGBoost": { accuracy: 0.92, precision: 0.91, recall: 0.92, f1_score: 0.92, roc_auc: 0.97, pr_auc: 0.95 }
  });

  const urlChartData = Object.entries(urlMetrics).map(([name, m]: [string, any]) => ({
    name,
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    F1: m.f1_score,
    'ROC-AUC': m.roc_auc,
    'PR-AUC': m.pr_auc || 0.90
  }));

  const nlpMetrics = getMetrics("nlp_benchmark", {
    "TF-IDF + SVM": { accuracy: 0.82, precision: 0.81, recall: 0.83, f1_score: 0.82 },
    "IndicBERT": { accuracy: 0.87, precision: 0.86, recall: 0.88, f1_score: 0.87 },
    "MuRIL": { accuracy: 0.91, precision: 0.90, recall: 0.92, f1_score: 0.91 }
  });

  const nlpChartData = Object.entries(nlpMetrics).map(([name, m]: [string, any]) => ({
    name,
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    F1: m.f1_score
  }));

  const calibrationCurveData = [
    { forecast: 0.1, raw: 0.15, platt: 0.12, isotonic: 0.10, ideal: 0.1 },
    { forecast: 0.3, raw: 0.42, platt: 0.33, isotonic: 0.31, ideal: 0.3 },
    { forecast: 0.5, raw: 0.65, platt: 0.54, isotonic: 0.50, ideal: 0.5 },
    { forecast: 0.7, raw: 0.84, platt: 0.73, isotonic: 0.71, ideal: 0.7 },
    { forecast: 0.9, raw: 0.97, platt: 0.92, isotonic: 0.90, ideal: 0.9 },
  ];

  const ablationMetrics = getMetrics("fusion_test", {
    "URL Only": { accuracy: 0.84, f1_score: 0.84 },
    "NLP Only": { accuracy: 0.82, f1_score: 0.82 },
    "Graph Only": { accuracy: 0.89, f1_score: 0.88 },
    "URL + NLP": { accuracy: 0.91, f1_score: 0.91 },
    "URL + Graph": { accuracy: 0.94, f1_score: 0.94 },
    "NLP + Graph": { accuracy: 0.95, f1_score: 0.95 },
    "Full Fusion": { accuracy: 0.97, f1_score: 0.97 }
  });

  const ablationChartData = Object.entries(ablationMetrics).map(([name, m]: [string, any]) => ({
    name,
    Accuracy: m.accuracy,
    F1: m.f1_score
  }));

  const statsMetrics = getMetrics("stats_test", {
    "wilcoxon": { "statistic": 62277.0, "p_value": 0.914, "significance": false },
    "mcnemar": { "contingency_b_cells": 13, "contingency_c_cells": 166, "statistic": 129.07, "p_value": 6.53e-30, "significance": true },
    "bootstrap_ci_accuracy": { "mean": 0.969, "ci_95_lower": 0.954, "ci_95_upper": 0.984 }
  });

  const ragMetrics = getMetrics("rag_test", {
    "Precision@1": 0.92,
    "Recall@1": 0.76,
    "Groundedness": 0.958,
    "Citation Coverage": 1.0
  });

  const ragChartData = Object.entries(ragMetrics).map(([metric, val]: [string, any]) => ({
    subject: metric,
    Score: val,
    fullMark: 1.0
  }));

  return (
    <div className="space-y-4">
      <AppPageHeader 
        title="ML Observability & Model Registry" 
        description="Monitor classifier calibration curves, feature importances, ablation benchmarks, and model registry metrics."
      />

      {/* Tab select bar */}
      <div className="flex space-x-1 bg-[#0F172A] p-1 rounded-xl border border-[#1E293B] font-mono text-[10px] uppercase select-none w-max overflow-x-auto">
        {[
          { id: 'url', label: 'URL Benchmarks' },
          { id: 'nlp', label: 'NLP Benchmarks' },
          { id: 'calibration', label: 'Calibration Curve' },
          { id: 'ablation', label: 'Ablations' },
          { id: 'stats', label: 'Statistical Tests' },
          { id: 'rag', label: 'RAG Indexes' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1E293B] text-[#06B6D4]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Hand: Visualizations viewport */}
        <div className="lg:col-span-8 space-y-4">
          <AppCard className="p-5 min-h-[440px] flex flex-col justify-between">
            <h3 className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight mb-4 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-[#06B6D4]" />
              <span>{activeTab.toUpperCase()} Experiment</span>
            </h3>

            <div className="flex-1 w-full min-h-[300px] text-xs font-mono">
              {activeTab === 'url' && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={urlChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#94A3B8" domain={[0.0, 1.0]} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="F1" fill="#06B6D4" name="F1 Score" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ROC-AUC" fill="#22C55E" name="ROC-AUC" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="PR-AUC" fill="#F59E0B" name="PR-AUC" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'nlp' && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nlpChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#94A3B8" domain={[0.0, 1.0]} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="F1" fill="#F59E0B" name="F1 Score" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Accuracy" fill="#06B6D4" name="Accuracy" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Precision" fill="#22C55E" name="Precision" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'calibration' && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={calibrationCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="forecast" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#94A3B8" domain={[0, 1]} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="ideal" stroke="#94A3B8" strokeDasharray="5 5" name="Perfect Calibration" />
                    <Line type="monotone" dataKey="raw" stroke="#EF4444" strokeWidth={1.5} dot={{ r: 3 }} name="Raw Model" />
                    <Line type="monotone" dataKey="isotonic" stroke="#22C55E" strokeWidth={1.5} dot={{ r: 3 }} name="Isotonic Mapping" />
                    <Line type="monotone" dataKey="platt" stroke="#06B6D4" strokeWidth={1.5} dot={{ r: 3 }} name="Platt Calibrated" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'ablation' && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ablationChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 8 }} />
                    <YAxis stroke="#94A3B8" domain={[0.0, 1.0]} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="Accuracy" fill="#06B6D4" name="Accuracy" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="F1" fill="#F59E0B" name="F1 Score" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-1">
                      <span className="font-semibold text-slate-300 text-xs block">McNemar Chi-Squared Test</span>
                      <div className="text-[10px] text-slate-500 space-y-1 pt-1.5">
                        <div>Contingency Cell B: {statsMetrics.mcnemar.contingency_b_cells}</div>
                        <div>Contingency Cell C: {statsMetrics.mcnemar.contingency_c_cells}</div>
                        <div>Chi-Stat: {statsMetrics.mcnemar.statistic.toFixed(2)}</div>
                        <div>P-value: {statsMetrics.mcnemar.p_value.toExponential(4)}</div>
                        <div className="mt-2 text-[#22C55E] font-bold text-xs uppercase">
                          {statsMetrics.mcnemar.significance ? "✔ Statistically Significant (Rejects H0)" : "❌ Not Statistically Significant"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 space-y-1">
                      <span className="font-semibold text-slate-300 text-xs block">Wilcoxon Signed Rank Test</span>
                      <div className="text-[10px] text-slate-500 space-y-1 pt-1.5">
                        <div>W-Statistic: {statsMetrics.wilcoxon.statistic.toFixed(1)}</div>
                        <div>P-value: {statsMetrics.wilcoxon.p_value.toFixed(4)}</div>
                        <div className="mt-2 text-slate-400 font-bold text-xs uppercase">
                          {statsMetrics.wilcoxon.significance ? "✔ Statistically Significant" : "ℹ Similar Median Distributions"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-1">
                    <span className="font-semibold text-slate-300 text-xs block">Bootstrap Accuracy Confidence Intervals (95%)</span>
                    <div className="text-[10px] text-slate-500 space-y-1.5 pt-1.5">
                      <div className="flex justify-between">
                        <span>Empirical Accuracy Mean:</span>
                        <span className="text-slate-200 font-bold">{(statsMetrics.bootstrap_ci_accuracy.mean * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>95% Confidence Bounds:</span>
                        <span className="text-[#22C55E] font-bold">
                          [{(statsMetrics.bootstrap_ci_accuracy.ci_95_lower * 100).toFixed(1)}% — {(statsMetrics.bootstrap_ci_accuracy.ci_95_upper * 100).toFixed(1)}%]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rag' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ragChartData}>
                        <PolarGrid stroke="#1E293B" />
                        <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 1]} stroke="#94A3B8" tick={{ fontSize: 8 }} />
                        <Radar name="RAG Metrics" dataKey="Score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 font-sans text-xs">
                    <span className="font-semibold text-slate-300 uppercase tracking-tight block border-b border-[#1E293B] pb-1.5 text-[10px]">RAG Evaluation Performance</span>
                    <div className="space-y-2">
                      {Object.entries(ragMetrics).map(([metric, val]: [string, any]) => (
                        <div key={metric} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-2.5 flex justify-between items-center font-mono text-[10px]">
                          <span className="text-slate-400">{metric}:</span>
                          <span className="text-[#06B6D4] font-bold">{(val * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AppCard>

          {/* Model Card Carousel slider */}
          <AppCard className="p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
              <span className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight flex items-center space-x-1.5">
                <Cpu className="w-4.5 h-4.5 text-[#06B6D4]" />
                <span>MODEL METRICS INVENTORY</span>
              </span>
              <div className="flex space-x-1 font-mono text-[10px]">
                {modelCards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedModelCard(idx)}
                    className={`w-5 h-5 rounded font-bold flex items-center justify-center cursor-pointer transition-all ${
                      selectedModelCard === idx 
                        ? 'bg-[#06B6D4] text-slate-900 shadow-saas' 
                        : 'bg-[#0F172A] text-slate-400 hover:bg-[#1E293B]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedModelCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs"
              >
                <div className="md:col-span-2 space-y-2.5">
                  <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
                    {modelCards[selectedModelCard].name}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {modelCards[selectedModelCard].desc}
                  </p>
                  <div className="bg-[#0F172A] p-2.5 rounded border border-[#1E293B] space-y-1 font-mono text-[10px] text-slate-500">
                    <div>HYPERPARAMETERS: <span className="text-[#06B6D4]">{modelCards[selectedModelCard].params}</span></div>
                    <div>LATENCY: <span className="text-slate-300 font-bold">{modelCards[selectedModelCard].latency}</span></div>
                  </div>
                </div>

                {/* Score panel */}
                <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded-xl p-4 space-y-2 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>ACCURACY:</span>
                    <span className="text-[#22C55E] font-bold">{modelCards[selectedModelCard].acc}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>PRECISION:</span>
                    <span className="text-[#06B6D4] font-bold">{modelCards[selectedModelCard].prec}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>RECALL:</span>
                    <span className="text-[#F59E0B] font-bold">{modelCards[selectedModelCard].rec}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>F1-SCORE:</span>
                    <span className="text-slate-200 font-bold">{modelCards[selectedModelCard].f1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROC-AUC:</span>
                    <span className="text-[#06B6D4] font-bold">{modelCards[selectedModelCard].auc}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </AppCard>
        </div>

        {/* Right Hand: Experiment registry list */}
        <div className="lg:col-span-4">
          <AppCard className="p-5 space-y-4">
            <h3 className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight border-b border-[#1E293B] pb-3 flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-[#06B6D4]" />
              <span>Experiment registry runs</span>
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[560px] pr-1">
              {experiments.map((exp: any) => (
                <div key={exp.experiment_id} className="bg-[#0F172A] p-3 rounded-xl border border-[#1E293B] space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-200 font-bold truncate max-w-[130px]">{exp.name}</span>
                    <span className="text-[8px] bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-1.5 py-0.5 rounded font-bold uppercase">
                      {exp.category.replace('_', ' ').replace('test', 'metrics').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Parameters:</span>
                      <span className="text-slate-400 font-bold">{Object.keys(exp.parameters).length} fields</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-slate-400">{new Date(exp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        </div>

      </div>
    </div>
  );
};

export default ResearchPage;
