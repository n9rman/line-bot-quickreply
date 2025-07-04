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

  // 👉 Quick Reply：「我要預約」
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

  // 👉 Flex Message：「髮型介紹」
  if (event.message.text === '髮型介紹') {
    return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '韓系髮型',
      contents: carouselMessage
    });
  }

}

// 👉 Flex Message：Carousel with 4 Bubbles
const carouselMessage = {
  type: 'carousel',
  contents: [
    createBubble(
      'https://line-bot-quickreply.vercel.app/images/1.png',
      '蘋果頭 x 蜂蜜奶香',
      '像一杯剛打開的蜂蜜牛奶，軟軟的甜，沒有壓力，也不膩。剪短之後反而更溫柔，像靠近妳時，剛好聞到的那一點點甜。'
    ),
    createBubble(
      'https://line-bot-quickreply.vercel.app/images/2.png',
      '波波捲 x 水中睡蓮',
      '像剛洗完澡還沒完全乾的頭髮、溫溫的、水感的香氣。不濃不淡，有點距離感，也有點像熟悉的人身上的氣味。'
    ),
    createBubble(
      'https://line-bot-quickreply.vercel.app/images/3.png',
      '鬆感捲 x 香草柑橘',
      '不是刻意捲的完美，而是隨手撥就很自然的那種鬆度。就像下午三點曬太陽的味道，有果香、有一點溫熱的香草味，很舒服。'
    ),
    createBubble(
      'https://line-bot-quickreply.vercel.app/images/4.png',
      '羽翼層次 x 玫瑰藍',
      '乾燥玫瑰混著一點墨藍色的情緒，冷冷的，但很好看。這不是那種會討好人的甜，而是自己就很有味道的個性。'
    )
  ]
};

function createBubble(imgUrl, title, desc) {
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url: imgUrl,
          size: 'full',
          aspectRatio: '2:3',
          gravity: 'top',
          aspectMode: 'cover'
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: title,
              size: 'xl',
              color: '#ff00d6',
              weight: 'bold'
            },
            {
              type: 'text',
              text: desc,
              wrap: true,
              color: '#ff00d6',
              size: 'xxs',
              margin: 'xs'
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                { type: 'filler' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'filler' },
                    {
                      type: 'icon',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                    },
                    {
                      type: 'text',
                      text: '點我看完整髮型',
                      color: '#000000',
                      flex: 0,
                      offsetTop: '-2px'
                    },
                    { type: 'filler' }
                  ],
                  spacing: 'sm'
                },
                { type: 'filler' }
              ],
              borderWidth: '1px',
              cornerRadius: '4px',
              spacing: 'sm',
              borderColor: '#000000',
              margin: 'xxl',
              height: '40px',
              action: {
                type: 'uri',
                label: '點我看完整髮型',
                uri: 'https://www.instagram.com/airhair.official/'
              }
            }
          ],
          position: 'absolute',
          offsetBottom: '0px',
          offsetStart: '0px',
          offsetEnd: '0px',
          paddingAll: '20px',
          paddingTop: '18px'
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'HOT',
              color: '#000000',
              align: 'center',
              size: 'xs',
              offsetTop: '3px'
            }
          ],
          position: 'absolute',
          cornerRadius: '20px',
          offsetTop: '18px',
          backgroundColor: '#ff334b',
          offsetStart: '18px',
          height: '25px',
          width: '53px'
        }
      ],
      paddingAll: '0px'
    }
  };
}


module.exports = app;
