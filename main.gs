function doPost(e){
  //tokenの登録やライブラリの追加
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var channel_id = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');
  var app = SlackApp.create(token); 
  
  //今後商品をデータベースに登録する予定
  //var userInputText = (e.parameter.text).split(" ");
  
  postMessage(e.parameter.text);
  var newMessage = app.channelsHistory(channel_id,{"count":1}).messages;
  addEmoji(newMessage[0].ts);
    
  var res = {
    "text": "商品を追加に成功いたしました."
  };
  
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function sendMsgWithButton(message) {
  // slack channel url (where to send the message)
  var slackUrl = "https://hooks.slack.com/services/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";
  
  // message text  
      var messageData = {
        "text": message,
        "attachments": [
          {
            "fallback": "Sorry, no support for buttons.",
            "callback_id": "ButtonResponse",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
              {
                    "name": "購入",
                    "text": "購入",
                    "type": "button",
                    "value": "chess"
                }
            ]
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