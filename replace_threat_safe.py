import re

path = r'E:\Scam Detection System\frontend\src\pages\ThreatAnalysisPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Input field
content = re.sub(
    r'w-full bg-app-bg border border-app-border rounded-xl px-3\.5 py-2\.5 text-xs text-app-text placeholder-slate-500 focus:outline-none focus:border-\[\#3B82F6\] focus:ring-1 focus:ring-\[\#3B82F6\]/30 transition-all font-sans',
    r'w-full bg-[#050D18] border border-[rgba(148,163,184,0.13)] rounded-[8px] px-3.5 py-2.5 text-xs text-[#E8F0FA] placeholder-[#647890] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.10)] transition-all font-sans',
    content
)

# Tabs
content = re.sub(
    r'className=\{\lex-1 py-2 text-center rounded-lg transition-all \$\{activeTab === t\.id \? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-\[0_0_10px_rgba\(59,130,246,0\.3\)\] border border-blue-400/20" : "bg-\[\#091A33\] text-\[\#9DB0CA\] hover:bg-\[\#0B1F3A\] hover:text-\[\#EAF2FF\] border border-transparent"\}\\}',
    r'className={lex-1 py-2 text-center rounded-[7px] transition-all }',
    content
)

# Main Scan Button
content = re.sub(
    r'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-\[0_0_15px_rgba\(59,130,246,0\.4\)\] hover:shadow-\[0_0_25px_rgba\(59,130,246,0\.6\)\] py-2\.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all active:scale-\[0\.98\] disabled:opacity-50 cursor-pointer border border-blue-400/30',
    r'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8] text-[#FFFFFF] shadow-[0_4px_14px_rgba(37,99,235,0.20)] py-2.5 rounded-[7px] text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer border-none',
    content
)

# Reset Button
content = re.sub(
    r'bg-app-bg hover:bg-\[\#1E293B\]/80 border border-app-border text-app-text px-5 py-2\.5 rounded-xl text-xs font-mono font-medium flex items-center space-x-1\.5 transition-all cursor-pointer',
    r'bg-[#081321] hover:bg-[#0D1B2D] border border-[rgba(148,163,184,0.12)] text-[#A8B8CC] hover:text-[#E8F0FA] px-5 py-2.5 rounded-[7px] text-xs font-mono font-medium flex items-center space-x-1.5 transition-all cursor-pointer',
    content
)

# Idle panel bg
content = re.sub(
    r'bg-gradient-to-b from-\[\#071225\] to-\[\#050B18\]',
    r'bg-[#091625]',
    content
)
content = re.sub(
    r'<div className="absolute inset-0 rounded-full border border-blue-500/20 animate-\[ping_3s_ease-in-out_infinite\]" />',
    r'',
    content
)
content = re.sub(
    r'<div className="absolute inset-2 rounded-full border border-blue-500/40 animate-\[ping_2s_ease-in-out_infinite_0\.5s\]" />',
    r'',
    content
)
content = re.sub(
    r'shadow-\[0_0_15px_rgba\(59,130,246,0\.2\)\]',
    r'shadow-none',
    content
)

# Telemetry metrics
content = re.sub(
    r'<AppCard className="p-4 space-y-2 border border-app-border bg-app-bg flex-1">\s*<div className="text-\[9px\] font-mono text-app-muted uppercase tracking-widest">\s*Total Scans\s*</div>\s*<div className="text-xl font-bold text-\[\#3B82F6\] font-mono">\s*2,35,797\s*</div>\s*</AppCard>',
    r'<div className="p-3 space-y-1 bg-[#0A1728] border border-[rgba(148,163,184,0.10)] rounded-[8px] flex-1">\n                    <div className="text-[9px] font-mono text-[#8EA4BD] uppercase tracking-widest">\n                      TOTAL SCANS\n                    </div>\n                    <div className="text-lg font-bold text-[#E8F0FA] font-mono">\n                      2,35,797\n                    </div>\n                  </div>',
    content
)
content = re.sub(
    r'<AppCard className="p-4 space-y-2 border border-app-border bg-app-bg flex-1">\s*<div className="text-\[9px\] font-mono text-app-muted uppercase tracking-widest">\s*Critical Alerts\s*</div>\s*<div className="text-xl font-bold text-red-500 font-mono">\s*143\s*</div>\s*</AppCard>',
    r'<div className="p-3 space-y-1 bg-[#0A1728] border border-[rgba(148,163,184,0.10)] rounded-[8px] flex-1">\n                    <div className="text-[9px] font-mono text-[#8EA4BD] uppercase tracking-widest">\n                      CRITICAL ALERTS\n                    </div>\n                    <div className="text-lg font-bold text-[#EF4444] font-mono">\n                      143\n                    </div>\n                  </div>',
    content
)

# Graph styling (careful with tags!)
content = content.replace(
    '<AppCard className="h-32 w-full p-2 bg-app-bg border border-app-border overflow-hidden">',
    '<AppCard className="h-32 w-full p-2 bg-[#071321] border border-[rgba(148,163,184,0.10)] rounded-[10px] overflow-hidden">'
)
content = content.replace(
    '<CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" vertical={true} />',
    '<CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.07)" vertical={true} />'
)
content = content.replace(
    '<Line type="monotone" dataKey="value" stroke="[#3B82F6]" strokeWidth={2} dot={false} />',
    '<Line type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} dot={false} />'
)

# Telemetry Header
content = re.sub(
    r'<h3 className="font-sans font-bold text-app-text tracking-widest text-xs flex items-center space-x-2">\s*<Activity className="w-4 h-4 text-\[\#3B82F6\] animate-pulse" />\s*<span>LIVE SIGNAL TELEMETRY</span>\s*</h3>\s*<span className="text-\[10px\] font-mono font-bold text-\[\#3B82F6\] bg-\[\#3B82F6\]/10 border border-\[\#3B82F6\]/30 px-2\.5 py-0\.5 rounded-full">\s*STREAM ACTIVE\s*</span>',
    r'<h3 className="font-sans font-bold text-[#E8F0FA] tracking-widest text-xs flex items-center space-x-2">\n                    <Activity className="w-3.5 h-3.5 text-[#22D3EE]" />\n                    <span>LIVE SIGNAL TELEMETRY</span>\n                  </h3>\n                  <span className="text-[9px] font-mono font-bold text-[#3B82F6] px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />STREAM ACTIVE</span>',
    content
)

# Activity Stream rows
content = re.sub(
    r'<div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-2 text-left">\s*<div className="flex items-center justify-between">\s*<span className="text-\[10px\] font-mono text-app-muted">11:39:35</span>\s*<span className="text-\[9px\] bg-\[\#3B82F6\]/10 text-\[\#3B82F6\] border border-\[\#3B82F6\]/20 px-2 py-0\.5 rounded font-bold uppercase">\s*THREAT\s*</span>\s*</div>\s*<p className="text-xs text-app-text font-mono leading-relaxed">\s*High entropy domain pattern detected: <br/> <span className="text-app-text font-bold">rewards-claim-web\.info</span>\s*</p>\s*</div>',
    r'<div className="py-2 border-b border-[rgba(148,163,184,0.08)] space-y-1 text-left">\n                      <div className="flex items-center justify-between">\n                        <span className="text-[10px] font-mono text-[#6F829A]">11:39:35</span>\n                        <span className="text-[9px] bg-[rgba(239,68,68,0.12)] text-[#F87171] px-2 py-0.5 rounded-[4px] font-bold uppercase">\n                          THREAT\n                        </span>\n                      </div>\n                      <p className="text-[11px] text-[#A8B8CC] font-mono leading-relaxed truncate">\n                        High entropy domain pattern detected: rewards-claim-web.info\n                      </p>\n                    </div>',
    content
)
content = re.sub(
    r'<div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-2 text-left">\s*<div className="flex items-center justify-between">\s*<span className="text-\[10px\] font-mono text-app-muted">11:39:30</span>\s*<span className="text-\[9px\] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0\.5 rounded font-bold uppercase">\s*ESCALATE\s*</span>\s*</div>\s*<p className="text-xs text-app-text font-mono leading-relaxed">\s*Coercion probability exceeded threshold on threat ticket TXN-72091\s*</p>\s*</div>',
    r'<div className="py-2 border-b border-[rgba(148,163,184,0.08)] space-y-1 text-left">\n                      <div className="flex items-center justify-between">\n                        <span className="text-[10px] font-mono text-[#6F829A]">11:39:30</span>\n                        <span className="text-[9px] bg-[rgba(245,158,11,0.12)] text-[#FBBF24] px-2 py-0.5 rounded-[4px] font-bold uppercase">\n                          ESCALATE\n                        </span>\n                      </div>\n                      <p className="text-[11px] text-[#A8B8CC] font-mono leading-relaxed truncate">\n                        Coercion probability exceeded threshold on threat ticket TXN-72091\n                      </p>\n                    </div>',
    content
)
content = re.sub(
    r'<div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-2 text-left">\s*<div className="flex items-center justify-between">\s*<span className="text-\[10px\] font-mono text-app-muted">11:39:25</span>\s*<span className="text-\[9px\] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0\.5 rounded font-bold uppercase">\s*EVOLVE\s*</span>\s*</div>\s*<p className="text-xs text-app-text font-mono leading-relaxed">\s*Model drift check complete: IndicBERT accuracy within nominal baselines\s*</p>\s*</div>',
    r'<div className="py-2 border-b border-[rgba(148,163,184,0.08)] space-y-1 text-left">\n                      <div className="flex items-center justify-between">\n                        <span className="text-[10px] font-mono text-[#6F829A]">11:39:25</span>\n                        <span className="text-[9px] bg-[rgba(59,130,246,0.12)] text-[#60A5FA] px-2 py-0.5 rounded-[4px] font-bold uppercase">\n                          DISCOVER\n                        </span>\n                      </div>\n                      <p className="text-[11px] text-[#A8B8CC] font-mono leading-relaxed truncate">\n                        Model drift check complete: IndicBERT accuracy within nominal baselines\n                      </p>\n                    </div>',
    content
)

# Border Radius Refinements for ThreatAnalysisPage
content = content.replace("rounded-xl", "rounded-[8px]")
content = content.replace("rounded-lg", "rounded-[6px]")
content = content.replace("rounded-2xl", "rounded-[10px]")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ThreatAnalysisPage safely")
