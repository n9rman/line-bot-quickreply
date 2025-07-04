const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
app.use(express.json());

// webhook endpoint
app.post('/api/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => res.status(200).send('OK'))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

// 主邏輯
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const msg = event.message.text;

  // ➤ Quick Reply：「我要預約」
  if (msg === '我要預約') {
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

  // ➤ Flex Message：「髮型介紹」
  if (msg === '髮型介紹') {
    const bubbles = [
      {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/clip/clip1.jpg",
          size: "full",
          aspectRatio: "2:3",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "蘋果頭 x 蜂蜜奶香",
              size: "lg",
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "柔順圓潤，像一杯剛打開的蜂蜜牛奶",
              size: "sm",
              wrap: true,
              color: "#888888",
              margin: "md"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "看更多髮型",
                uri: "https://www.instagram.com/airhair.official/"
              }
            }
          ]
        }
      },
      {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/clip/clip2.jpg",
          size: "full",
          aspectRatio: "2:3",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "俐落層次短髮",
              size: "lg",
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "輕盈剪裁，凸顯臉部線條，超好整理！",
              size: "sm",
              wrap: true,
              color: "#888888",
              margin: "md"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "看更多髮型",
                uri: "https://www.instagram.com/airhair.official/"
              }
            }
          ]
        }
      },
      {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/clip/clip3.jpg",
          size: "full",
          aspectRatio: "2:3",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "氣質鎖骨髮",
              size: "lg",
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "不挑臉型、自然捲也OK，約會最加分！",
              size: "sm",
              wrap: true,
              color: "#888888",
              margin: "md"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "看更多髮型",
                uri: "https://www.instagram.com/airhair.official/"
              }
            }
          ]
        }
      },
      {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/clip/clip4.jpg",
          size: "full",
          aspectRatio: "2:3",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "韓系空氣瀏海",
              size: "lg",
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "減齡必備、修飾額頭，拍照必勝角度",
              size: "sm",
              wrap: true,
              color: "#888888",
              margin: "md"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "看更多髮型",
                uri: "https://www.instagram.com/airhair.official/"
              }
            }
          ]
        }
      }
    ];

    return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '髮型介紹卡片',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    });
  }

  // // ➤ fallback：未匹配指令
  // return client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: '請輸入「我要預約」或「髮型介紹」來開始',
  // });
}

// 匯出 app
module.exports = app;
