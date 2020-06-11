'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "pmmWTAKGQkpE58CUXU5xR1ugLdw7dLKcxtumxCcKw/B0BEmhA2s6OfnqZ8BX1EDbGMKVJDnPMp8DIo2nAIR8IW8YY1iIEIjsXkyuVmCZG54tsbN02YkHSdFndqtTqz9Q2lUnDh+xwH2wB49d3KBpvgdB04t89/1O/w1cDnyilFU=",
  channelSecret: "9bde799235c2d35f65f38b70d76a90a3",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
