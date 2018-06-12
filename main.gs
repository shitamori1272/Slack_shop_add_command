//Project properties
//SLACK_INCOMMING_URL: your slack incomming webhook's url
//PRODUCT_SHEET_ID: your product_sheet_id


function doPost(e) {
  
  var command = e.parameter.command;
  if(command == "/add_shop"){
    
    //<商品名>　<価格> <image url>
    var input = (e.parameter.text).split(" ");
    var reply_text = "";
    if (input.length == 3) {
      sendMsgWithButton(input[0], input[1], input[2], e.parameter.user_id, e.parameter.user_name);
      reply_text = "商品の追加に成功いたしました"
    } else if ((input.length == 4) && (input[3] == "master")) {
      sendMsgWithButton(input[0], input[1], input[2], "master", "master");
      reply_text = "商品の追加に成功いたしました(master mode)"
    } else {
      reply_text = "何らかのエラーが発生しました"
    }
    var res = {
      "text": reply_text
    };
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
    
  }else if(command == "/join_shop"){
    var user_id = e.parameter.user_id;
    var user_name = e.parametr.user_name;
    var reply_text = ""
    var result = registerUser(user_name,user_id);
    if(result == true){
      reply_text = "データベースにユーザを登録しました。";
    }else{
      reply_text = "データベースへの登録に失敗しました。すでに登録されている可能性があります。";
    }
    var res = {
      "text":reply_text
    };
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);    
  }

  
  
  
}

  
//shopチャンネルに商品を追加する
function sendMsgWithButton(product_name, price, url, user_id, user_name) {
  // slack channel url (where to send the message)
  var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
  // message text  
  var messageData = {
    "attachments": [{
      "title": product_name,
      "text":"by "+user_name,
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
          "name": "buy",
          "text": price + "円",
          "type": "button",
          "value": price + "," + user_id
        }
        /**キャンセルボタンなんていりませんよね？
        ,{
              "name": "cancel",
              "text": "キャンセル",
              "type": "button",
              "value": price
        }
        **/
      ],
      "image_url": url
    }]
  }
  // format for Slack
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(messageData)
  };
  // post to Slack
  UrlFetchApp.fetch(slackUrl, options);

 //製品をスプレッドシートに登録する
  registerProduct(product_name, 10,price, user_name);
}

//デバッグ用
function doPostTest(){
  var e = {
    parameter: {
      text: "Beer 100 http://beer.jpg",
      user_id: "master_id",
      user_name: "master_name"
    }
  }
  
  doPost(e);
}



function registerUser(name,id){
  var moneySheetID = PropertiesService.getScriptProperties().getProperty('MONEY_SHEET_ID');
  var moneySheet = SpreadsheetApp.openById(moneySheetID).getSheets()[0];
  var array = moneySheet.getDataRange().getValues();
  /*
  111
  111
  111
  111
  の配列のサイズは(4,3)になる
  */
  for(i=0;i<array.length;i++){
    if(array[i][0] == id){
      return false;
    }
  }
  moneySheet.appendRow([id,0,name,"@"+name]);
  return true;
}


//製品をスプレッドシートに登録
function registerProduct(productName, productCount, productPrice, registUser){
  var productSheetID = PropertiesService.getScriptProperties().getProperty('PRODUCT_SHEET_ID');  
  // マスタデータシートを取得
  var productSheet = SpreadsheetApp.openById(productSheetID);　
  //商品名	個数	価格	導入者	導入日	購入履歴
  var productData = [productName,productCount,productPrice,registUser, new Date];
  var length = productData.length;
  productSheet.insertRowAfter(1);
  //getRangeが引数をstring型のみという問題があり<=productsheetの型をsheetにすればOK
  var targetRange = productSheet.getRange("A2");
  for(var i=0;i<length;i++){
    targetRange.offset(0, i).setValue(productData[i]);
  }  
}



//channelのすべてのメッセージを削除する
function deleteMessage(channel_id ) {
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(slack_access_token);
  var messages = app.channelsHistory("CAX1W2T6Y")["messages"];
  for(i=0;i<messages.length;i++){
    var message = messages[i];
    var ts = message["ts"];
    var text = message["text"];
    app.chatDelete("CAX1W2T6Y", ts);
  }
}



 
  





