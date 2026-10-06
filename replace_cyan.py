import os
import re

target_dir = r'E:\Scam Detection System\frontend\src'

count = 0
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if '#00E5FF' in content:
                new_content = content.replace('#00E5FF', '#3B82F6')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f'Updated {file}')

print(f'\nTotal files updated: {count}')
