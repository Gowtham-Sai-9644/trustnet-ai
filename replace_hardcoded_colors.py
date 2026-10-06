import os

target_dir = r'E:\Scam Detection System\frontend\src'

replacements = {
    'bg-[#050811]': 'bg-app-bg',
    'bg-[#0B1220]': 'bg-app-surface',
    'bg-[#111827]': 'bg-app-card',
    'border-[#1E293B]': 'border-app-border',
    'border-slate-800': 'border-app-border',
    'text-slate-200': 'text-app-text',
    'text-slate-300': 'text-app-text',
    'text-slate-400': 'text-app-muted',
    'text-slate-500': 'text-app-muted',
    'text-white': 'text-app-text',
    'bg-slate-900': 'bg-app-bg',
    'bg-slate-800': 'bg-app-surface'
}

count = 0
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            if original != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1

print(f'\nTotal files updated with app theme variables: {count}')
