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
      altText: '髮型介紹卡片',
      contents: carouselMessage
    });
  }

}

// 👉 Flex Message：Carousel with 4 Bubbles
const carouselMessage = {
  type: 'carousel',
  contents: [
    createBubble(
      'https://developers-resource.landpress.line.me/fx/clip/clip1.jpg',
      '蘋果頭 x 蜂蜜奶香',
      '像一杯剛打開的蜂蜜牛奶， 軟軟的甜，沒有壓力，也不膩。 剪短之後反而更溫柔， 像靠近妳時，剛好聞到的那一點點甜。'
    ),
    createBubble(
      'https://developers-resource.landpress.line.me/fx/clip/clip2.jpg',
      '俐落層次短髮',
      '輕盈剪裁，凸顯臉部線條， 超好整理又不顯年紀。'
    ),
    createBubble(
      'https://developers-resource.landpress.line.me/fx/clip/clip3.jpg',
      '氣質鎖骨髮',
      '不挑臉型、自然捲也OK，氣質與甜美兼具，男女都愛！'
    ),
    createBubble(
      'https://developers-resource.landpress.line.me/fx/clip/clip4.jpg',
      '韓系空氣瀏海',
      '減齡神器，修飾額頭，自然蓬鬆、拍照超加分～'
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
              color: '#ffffff',
              weight: 'bold'
            },
            {
              type: 'text',
              text: desc,
              wrap: true,
              color: '#FFFFFF',
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
                      url: 'https://developers-resource.landpress.line.me/fx/clip/clip14.png'
                    },
                    {
                      type: 'text',
                      text: '點我看完整髮型',
                      color: '#ffffff',
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
              borderColor: '#ffffff',
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
              color: '#ffffff',
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
