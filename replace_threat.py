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
    r'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8] text-[#FFFFFF] shadow-[0_4px_14px_rgba(37,99,235,0.20)] py-2.5 rounded-[7px] text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer',
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

# Idle panel ping
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

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ThreatAnalysisPage")
