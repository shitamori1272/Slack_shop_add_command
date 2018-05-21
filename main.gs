function doPost(e){
  //<商品名>　<価格> <image url>
  var input = (e.parameter.text).split(" ");
  sendMsgWithButton(input[0],input[1],input[2]);
    
  var res = {
    "text": "商品を追加に成功いたしました."
  };
  
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function sendMsgWithButton(name,price,url) {
  // slack channel url (where to send the message)
  var slackUrl = "https://hooks.slack.com/services/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";
  
  // message text  
      var messageData = {
        "attachments": [
          {
            "title": name,
            //"text":"在庫: "+num,
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
              }
              /** キャンセルボタンなんて要らないよなぁ？
              ,{
                    "name": "cancel",
                    "text": "キャンセル",
                    "type": "button",
                    "value": price
              }
              **/
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