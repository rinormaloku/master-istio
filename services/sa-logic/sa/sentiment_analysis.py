import logging
import sys
import random
import time 
import os

from textblob import TextBlob
from flask import Flask, request, jsonify
from flask_api import status

FAIL_RANDOMLY = os.getenv("FAIL_RANDOMLY", 'false').lower() in ('true', '1', 't')

app = Flask(__name__)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)


@app.route("/analyse/sentiment", methods=['POST'])
def analyse_sentiment():
    content = 'This was never meant to happen. Take cover!'
    if FAIL_RANDOMLY:
        random_number = random.randint(1,101)
        if random_number < 34: 
            app.logger.debug('This failed badly')
            return content, status.HTTP_500_INTERNAL_SERVER_ERROR
        elif random_number < 66:
            time.sleep(30)
            return content, status.HTTP_500_INTERNAL_SERVER_ERROR
    
    sentence = request.get_json()['sentence']
    polarity = TextBlob(sentence).sentences[0].polarity
    return jsonify(
        sentence=sentence,
        polarity=polarity
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
