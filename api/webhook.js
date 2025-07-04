const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
app.use(express.json());

app.post('/api/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => res.status(200).send('OK'))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  if (event.message.text === '我要預約') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '請選擇服務項目：',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'message',
              label: '剪髮',
              text: '我要剪髮'
            }
          },
          {
            type: 'action',
            action: {
              type: 'message',
              label: '燙髮',
              text: '我要燙髮'
            }
          }
        ]
      }
    });
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '請輸入「我要預約」來開始',
  });
}

module.exports = app;
