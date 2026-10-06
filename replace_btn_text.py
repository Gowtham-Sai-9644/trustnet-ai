import os

target_dir = r'E:\Scam Detection System\frontend\src'

replacements = {
    'text-slate-900': 'text-app-btn-text',
    'text-black': 'text-app-btn-text',
    'text-[#0F172A]': 'text-app-btn-text'
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

print(f'\nTotal files updated with btn text variables: {count}')
