from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime, timedelta
import pyautogui as pag
import time as tm

app = Flask(__name__)
CORS(app)  # allow CORS for all origins

# Global variables
total = 0
productive_score = 0
flag = True
isfirst = True

# Function to check if the website is productive
def is_productive(changed_website='https://google.com'):
    if (changed_website == 'chrome://newtab/'):
        return True
    genai.configure(api_key="AIzaSyDQXBrydgmZB1DQfp3kNNWssMV2QYqKxCs")
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = "If I were studying for school on this website, or just checking to see something really quick, would you think im being productive? website:" + changed_website + ' If yes return True, if not return False, only return a boolean nothing else'
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

    print("Received URL:", data['url'], 'Time :', datetime.now())
    new = datetime.now()

    # Read the last recorded time
    with open("time.txt", 'r') as time_file:
        old = time_file.readline()
    old = datetime.strptime(old.strip(), "%Y-%m-%d %H:%M:%S.%f")

    # Calculate the time difference in seconds
    change = new - old
    change = int(change.total_seconds())

    if isfirst:
        change = 0
        isfirst = False

    # Update the time.txt file with the current timestamp
    with open('time.txt', 'w') as time_file:
        time_file.write(str(datetime.now()))
 
    if flag:
        global productive_score
        productive_score += change
    global total
    total += change

    # Determine if the URL is productive
    flag = is_productive(data['url'])

    # Update the timestamp again
    with open('time.txt', 'w') as time_file:
        time_file.write(str(datetime.now()))

    # Calculate the percentage of productive time
    if total > 0:  # Prevent division by zero
        percent = productive_score / total
    else:
        percent = 0

    # Log the productive and total seconds, and the percent
    print('Productive seconds:', productive_score, 's')
    print('Total seconds:', total, 's')
    print(int(percent * 100), '%')

    # Return the response with status, productive score, total time, and percent
    return jsonify({
        'status': 'received',
        'productive_score': productive_score,
        'total_time': total,
        'productive_percent': int(percent * 100)  # Return percent as an integer
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
