function doPost(e){
  //tokenの登録やライブラリの追加
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var channel_id = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');
  var app = SlackApp.create(token); 
  
  //今後商品をデータベースに登録する予定
  //<商品名>　<価格> <在庫> <image url>
  var input = (e.parameter.text).split(" ");
  sendMsgWithButton(input[0],input[1],input[2],input[3]);
  
  //postMessage(e.parameter.text);
  //var newMessage = app.channelsHistory(channel_id,{"count":1}).messages;
  //addEmoji(newMessage[0].ts);
    
  var res = {
    "text": "商品を追加に成功いたしました."
  };
  
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function sendMsgWithButton(name,price,num,url) {
  // slack channel url (where to send the message)
  var slackUrl = "https://hooks.slack.com/services/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";
  
  // message text  
      var messageData = {
        "attachments": [
          {
            "title": name,
            "text":"在庫: "+num,
            "fallback": "Sorry, no support for buttons.",
            "callback_id": "ButtonResponse",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
              {
                    "name": "buy",
                    "text": price+"円",
                    "type": "button",
                    "value": price
              },{
                    "name": "cancel",
                    "text": "キャンセル",
                    "type": "button",
                    "value": price
              }
            ],
            "image_url": url
          }
        ]
      }

      // format for Slack
      var options = {
        'method' : 'post',
        'contentType': 'application/json',
        // Convert the JavaScript object to a JSON string.
        'payload' : JSON.stringify(messageData)
      };    

      // post to Slack
      UrlFetchApp.fetch(slackUrl, options);
    }
/*
function postMessage(message){
  //tokenの登録やライブラリの追加
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var channel_id = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');
  var app = SlackApp.create(token); 
  
  var bot_name = "ShopWego";
  var bot_icon = "http://www.hasegawa-model.co.jp/hsite/wp-content/uploads/2016/04/cw12p5.jpg";
    
  return app.postMessage(channel_id, message, {
    username: bot_name,
    icon_url: bot_icon,
    link_names: 1
  });
}

function addEmoji(timestamp){
  //tokenの登録やライブラリの追加
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var channel_id = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');
  
  var method = "post";
  var url = "https://slack.com/api/reactions.add"
  
  //slackAppが対応していない制御用
  var payload = {
    'token'      : token,
    'channel'    : channel_id,
    'timestamp'  : timestamp,
    'name'       : "buy"
  };
 
  var params = {
    'method' : method,
    'payload' : payload
  };
  
  return UrlFetchApp.fetch(url, params);
}
*/