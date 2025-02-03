# ルビふり
リアルタイムでユーザーの入力したテキストボックスの漢字にルビを振る

# API

以下のYahooのPythonのコードを参考にしてください。

```
import requests
import re
import json

def get_furigana(text, app_id):
    url = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Yahoo AppID: {}".format(app_id)
    }
    data = {
        "id": "1234-1",
        "jsonrpc": "2.0",
        "method": "jlp.furiganaservice.furigana",
        "params": {
            "q": text,
            "grade": 1
        }
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()

def process_text_with_ruby(text, app_id):
    # Skip if text is empty or only whitespace
    if not text or text.isspace():
        return text
        
    # Get furigana data from Yahoo API
    response = get_furigana(text, app_id)
    
    # Process the response
    result = ""
    try:
        word_list = response["result"]["word"]
        for word in word_list:
            if "furigana" in word:
                # Add ruby annotation
                result += f"\\ruby[g]{{{word['surface']}}}{{{word['furigana']}}}"
            else:
                # Keep original text for words without furigana
                result += word["surface"]
    except (KeyError, TypeError):
        # If there's any error in processing, return original text
        return text
        
    return result

def process_file(input_file, output_file, app_id):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.readlines()
    
    processed_content = []
    in_target_env = False
    
    for line in content:
        # Check if we're entering a question or answer environment
        if '\\question{' in line or '\\answer{' in line:
            in_target_env = True
            # Find the text between { and }
            match = re.search(r'\{(.*?)\}', line)
            if match:
                text = match.group(1)
                processed_text = process_text_with_ruby(text, app_id)
                # Replace the original text with processed text
                line = line.replace(text, processed_text)
            processed_content.append(line)
        elif in_target_env and '}' in line:
            in_target_env = False
            processed_content.append(line)
        else:
            processed_content.append(line)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(processed_content)

if __name__ == "__main__":
    APP_ID = "dj00aiZpPVBiMUpHM0pPWWJOSiZzPWNvbnN1bWVyc2VjcmV0Jng9NWM-"
    
    # First, process the file with furigana
    process_file("content.tex", "content_with_ruby.tex", APP_ID)
    
    # Then, apply the replacements from CSV
    csv_file = 'replacements.csv'
    from replace_ruby import replace_from_csv
    replace_from_csv("content_with_ruby.tex", "content_with_ruby.tex", csv_file)
    
    print("処理が完了しました！") 

```

# Feature
1. ウェブサイトにはテキストボックスしかありません。また、綺麗なデザインです。
2. ユーザーが文字を入力した際にAPIを使ってルビをふります。
   1. 新たにテキストを表示するのではなく、ユーザーのテキストボックス上にそのまま表示します。
   2. 編集する際にはルビが邪魔をしないようにします。つまり、ルビはテキストボックスを編集しているのではなく、表示されているだけです。
   
# System Design
1. Next.jsを使います。
2. VercelでDevelopします。