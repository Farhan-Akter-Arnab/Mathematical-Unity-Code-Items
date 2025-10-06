import os
import re

def clean_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Preserve LaTeX and script tags
    script_pattern = re.compile(r'<script.*?>.*?</script>', re.DOTALL)
    scripts = script_pattern.findall(content)

    # Remove square-braced references and 'oaicite'
    cleaned_content = re.sub(r'\[.*?oaicite.*?\]', '', content)  # Remove 'oaicite' references
    cleaned_content = re.sub(r'\[.*?\]', '', cleaned_content)   # Remove generic square-braced references

    # Restore preserved script tags
    for script in scripts:
        cleaned_content = cleaned_content.replace(script, script)

    # Write the cleaned content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(cleaned_content)

def clean_all_html_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                print(f"Cleaning file: {file_path}")
                clean_html_file(file_path)

# Specify the directory containing your HTML files
html_directory = './'  # Change this to your project directory
clean_all_html_files(html_directory)