import re
from bs4 import BeautifulSoup

def clean_description(desc):
    # Remove td and br tags
    desc = re.sub(r'<td><br/?>', '', desc)
    desc = re.sub(r'</td>', '', desc)
    
    # Convert <br/> or <br> to literal "\n"
    desc = re.sub(r'<br/?>', '\\\\n', desc)
    
    # Remove any remaining HTML tags
    desc = re.sub(r'<[^>]+>', '', desc)
    
    # Clean up extra whitespace but keep as single line
    desc = ' '.join(line.strip() for line in desc.split('\n'))
    desc = desc.strip()
    
    return desc

def parse_passive_data(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into rows
    rows = content.split('<tr role="row">')
    
    passives = []
    for row in rows:
        if not row.strip():
            continue
            
        soup = BeautifulSoup(row, 'html.parser')
        
        # Get emotions
        emotions = []
        for link in soup.find_all('a'):
            if 'Distilled_' in link['href']:
                emotion = link['href'].split('Distilled_')[1]
                emotions.append(emotion)
        
        # Get passive name and href
        passive_link = None
        for link in soup.find_all('a'):
            if 'Distilled_' not in link['href']:
                passive_link = link
                break
                
        if passive_link:
            name = passive_link['href'].split('/')[-1].replace('_', ' ')
            href = passive_link['href']
            
            # Get description
            desc_cell = soup.find_all('td')[-1]
            desc = clean_description(str(desc_cell))
            
            passives.append({
                'name': name,
                'href': href,
                'desc': desc,
                'emotions': emotions[:3]  # Take first 3 emotions
            })
    
    # Generate JavaScript output
    js_output = '[\n'
    for passive in passives:
        js_entry = f"""    {{
        name: "{passive['name']}",
        href: "{passive['href']}",
        desc: "{passive['desc']}",
        emotions: [{', '.join(f'"{e}"' for e in passive['emotions'])}]
    }}"""
        js_output += js_entry + ',\n'
    js_output = js_output.rstrip(',\n') + '\n]'
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_output)

# Use the script
if __name__ == "__main__":
    parse_passive_data('passive_list.txt', 'passives_output.js')
