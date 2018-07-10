
function writeHistory(sendUserId, recvUserId, action, product, value, zandaka, name) {
  var sheet_id="1nDkBXJeZxvyOmxilvbVHXOd3U2OCFKF6HP8N7yevO60";
  // マスタデータシートを取得
  var historySheet = SpreadsheetApp.openById(sheet_id).getSheets()[0];;　
  var lastrow = historySheet.getLastRow();
  var member = historySheet.getSheetValues(1, 1, lastrow, 1); //データ行のみを取得する
  var memberName = historySheet.getSheetValues(1, 3, lastrow, 1); //データ行のみを取得する
  
  //アクション時間を記述
  var date = new Date();
  //var date1 = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
  
  //一番上にデータ行挿入
  historySheet.insertRows(2);
  historySheet.getRange("A2:F2").setValues([[date,name,action,product,value,zandaka]]);
  
  return true;
 
}

function test(){
  writeHistory(1,2,"buy","コカ・コーラ",100,2500,"TANAKA");
}
