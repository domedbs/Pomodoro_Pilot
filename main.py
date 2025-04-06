from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime, timedelta
import pyautogui as pag

app = Flask(__name__)
CORS(app)  # allow CORS for all origins
total = .0000000000001
productive_score = 0
flag = True
isfirst = True

def is_productive(changed_website = 'https://google.com'):
    genai.configure(api_key="AIzaSyDQXBrydgmZB1DQfp3kNNWssMV2QYqKxCs")
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = "If I were studying for school on this website, or just checking to see something really quick, would you think im being productive? website:"+changed_website+' If yes return True, if not return False, only return a boolean nothing else'
    response = model.generate_content(prompt)
    print(eval(response.text))
    return eval(response.text)


@app.route('/track', methods=['POST'])
def track():
    global isfirst
    global flag
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing URL'}), 400
    print("Received URL:", data['url'], 'Time :',datetime.now())
    new = datetime.now()
    time = open("time.txt",'r')
    old = time.readline()
    time.close()
    old = datetime.strptime(old.strip(), "%Y-%m-%d %H:%M:%S.%f")
    change = new - old
    change = int(change.total_seconds())
    if isfirst:
        change = 0
        isfirst = False
    time = open('time.txt','w')
    time.write(str(datetime.now()))
    time.close
    if (data['url'] != 'chrome://newtab/'):
        if not (flag):
            global productive_score
            productive_score +=change
        global total
        total += change
    flag = is_productive(data['url'])
    time = open('time.txt','w')
    time.write(str(datetime.now()))
    time.close()
    percent = productive_score/total

    # if (percent < 30):
        # pag.hotkey('ctrl','w')
    print('productive seconds :',productive_score,'s')
    print('total seconds :',total,'s')
    print(int(percent*100),'%')
    # print(productive_score/total)
    return jsonify({'status': 'received'}), 200


if __name__ == '__main__':
    app.run(debug=True)