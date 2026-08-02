import os
import glob
import re

files_to_check = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('frontend/src/**/*.tsx', recursive=True)

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to find style={{ ... background: 'var(--theme-surface)' ... }}
    # and inject backdropFilter: 'blur(16px)', 
    
    # Simple regex replacement
    # Look for style={{ ... }} that contains var(--theme-surface) or var(--theme-card)
    
    def replacer(match):
        style_str = match.group(0)
        if ('var(--theme-surface)' in style_str or 'var(--theme-card)' in style_str) and 'backdropFilter' not in style_str:
            return style_str.replace('style={{', "style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', ")
        return style_str

    new_content = re.sub(r'style=\{\{.*?\}\}', replacer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
