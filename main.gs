//Project properties
//SLACK_INCOMMING_URL: your slack incomming webhook's url
//PRODUCT_SHEET_ID: your product_sheet_id
//MONEY_SHEET_ID
//SLACK_ACCESS_TOKEN

function doPost(e) {  
  if(isSlashCommand(e)){
    //switch文で書いた方が見やすいかも
    var command = e.parameter.command;
    if(command == "/add_shop"){
      return add_shop(e);
    }else if(command == "/join_shop"){
      return join_shop(e);
    }else{
      //例外処理の部分
      var res = {
        "text":reply_text
      };
      return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);    
    }
    
  }else{
    //ボタンの処理を書く。
    return buyMessage(e);
  } 
}


//add_shopコマンド実行関数
function add_shop(e){
  //<商品名>　<個数> <価格> <image url>
  var input = (e.parameter.text).split(" ");
  var reply_text = "";
  if (input.length == 4) {
    sendMsgWithButton(input[0], input[1], input[2], input[3], e.parameter.user_id, e.parameter.user_name);
    registerProduct(input[0], input[1], input[2], input[3], e.parameter.user_name);
    reply_text = "商品の追加に成功いたしました"
  } else if ((input.length == 5) && (input[4] == "master")) {
    sendMsgWithButton(input[0], input[1], input[2], input[3],  "master", "master");
    //製品をスプレッドシートに登録する
    registerProduct(input[0], input[1], input[2], input[3], e.parameter.user_name);
    reply_text = "商品の追加に成功いたしました(master mode)"
  } else {
    reply_text = "何らかのエラーが発生しました"
  }
  var res = {
    "text": reply_text
  };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}


//join_shop実行関数
function join_shop(e){
  var user_id = e.parameter.user_id;
  var user_name = e.parameter.user_name;
  var reply_text = ""
  var result = registerUser(user_name,user_id);
  if(result == true){
    reply_text = "データベースにユーザを登録しました。\nhttps://script.google.com/macros/s/AKfycbxG1dHwOa7aur5AcEZv9OwWExbR0Uo-dVvLHeo6DIzVQzSi9xlZ/exec\nからお金をプリペイしてください。";
  }else{
    reply_text = "データベースへの登録に失敗しました。すでに登録されている可能性があります。";
  }
  var res = {
    "text":reply_text
  };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);    
}
  


//postされたeがslashCommandかどうか判定
function isSlashCommand(e){
  if(e.parameter == null){
    return false;
  }
  if(e.parameter.command != null){
    return true;
  }else{
    return false;
  }
}

function isButtonMessage(){  
}



  
//shopチャンネルに商品を追加する
function sendMsgWithButton(product_name, count, price, url, user_id, user_name) {
  // slack channel url (where to send the message)
  var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
  // message text  
  var messageData = {
    "attachments": [{
      "title": product_name,
      "text":"by "+user_name+"\n在庫数："+count,
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
function registerProduct(productName, productCount, productPrice, url, registUser){
  var productSheetID = PropertiesService.getScriptProperties().getProperty('PRODUCT_SHEET_ID');  
  // マスタデータシートを取得
  var productSheet = SpreadsheetApp.openById(productSheetID);　
  //商品名	個数	価格　URL	導入者	導入日	
  var productData = [productName,productCount,productPrice,url,registUser, new Date];
  var length = productData.length;
  productSheet.insertRowAfter(1);
  //getRangeが引数をstring型のみという問題があり<=productsheetの型をsheetにすればOK
  var targetRange = productSheet.getRange("A2");
  for(var i=0;i<length;i++){
    targetRange.offset(0, i).setValue(productData[i]);
  }  
}

//未完成
function postAllProduct(){
  var productSheetID = PropertiesService.getScriptProperties().getProperty('PRODUCT_SHEET_ID');
  var moneySheetID = PropertiesService.getScriptProperties().getProperty('MONEY_SHEET_ID');
  var productSheet = SpreadsheetApp.openById(productSheetID).getSheets()[0];
  var array = productSheet.getDataRange().getValues();
  //商品名	個数	価格　URL	導入者	導入日	
  for(i=1;i<array.length;i++){
    var product_name = array[i][0];
    var count = array[i][1];
    var price = array[i][2];
    var url = array[i][3];
    var user_name = array[i][4]
    Logger.log(user_name);
    var user_id = SlackShopAPI.getIdByName(user_name,  moneySheetID);
    sendMsgWithButton(product_name, count ,price, url, user_id, user_name);
  }
}


//channelのすべてのメッセージを削除する
function deleteMessage() {
  var channel_id = "CAX1W2T6Y";
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(slack_access_token);
  var messages = app.channelsHistory(channel_id)["messages"];
  for(i=0;i<messages.length;i++){
    var message = messages[i];
    var ts = message["ts"];
    var text = message["text"];
    app.chatDelete(channel_id, ts);
  }
}


//Slackのshopのボタンが押された時の処理
function buyMessage(e){
  //exploit JSON from payload
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));
  var name = json.original_message.attachments[0].title;
  var product = (json.actions[0].value).split(",");
  var product_price = parseInt(product[0]);
  var product_add_user = product[1];
  
  //移行中専用の臨時コード
  if(product_add_user == ""){
    product_add_user == "master";
  }
  var image_url = json.original_message.attachments[0].image_url;
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var userId = json.user.id;
  var userName = SlackShopAPI.getNameById(userId, sheet_id);
  if(json.actions[0].name == "buy"){
    SlackShopAPI.subMoney(userId, product_price, slack_access_token, sheet_id);
    if(product_add_user != "master"){
      SlackShopAPI.addMoney(product_add_user, product_price, slack_access_token, sheet_id);
    }
  }else if(json.actions[0].name == "cancel"){
    SlackShopAPI.addMoney(userId, price, slack_access_token, sheet_id);
  }
  var replyMessage = {
    "replace_original": true,
    "response_type": "in_channel",
    "attachments": [{
      "title": name,
      "text": "by "+SlackShopAPI.getNameById(product_add_user, sheet_id),
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
      "name": "buy",
      "text": product_price+"円",
      "type": "button",
      "value": product_price+","+product_add_user
    }/**キャンセルボタンを削除
    ,{
    "name": "cancel",
    "text": "注文をキャンセル",
    "type": "button",
    "value": price
    }**/           ],
    "image_url":image_url
  }]
};
return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
}



 
  





