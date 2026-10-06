import os
import re

dir_path = r'E:\Scam Detection System\frontend\src\components\landing'

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace exactly "bg-white" but not "bg-white/something"
            new_content = re.sub(r'bg-white(?![/\w-])', r'bg-[#3B82F6]', content)
            
            # Also fix text-app-btn-text since background is now dark blue
            if 'bg-[#3B82F6]' in new_content:
                new_content = new_content.replace('text-app-btn-text', 'text-white')
                
            if content != new_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file}")
