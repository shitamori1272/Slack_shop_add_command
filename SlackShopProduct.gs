var productSheetID = PropertiesService.getScriptProperties().getProperty('PRODUCT_SHEET_ID');
// マスタデータシートを取得
var sheet = SpreadsheetApp.openById(productSheetID);

//製品をスプレッドシートに登録
function registerProduct(productName, productStock, productPrice, url, registUser){
  //商品名	個数	価格　URL	導入者	更新日
  var productData = [[productName,productStock,productPrice,url,registUser, new Date]];
  var index = getProductIndex(productName);
  
  //既に登録されているかを確認
  if(index > 1){
    //登録済みの場合、在庫の追加
    var productRange = sheet.getRange("A"+index+":F"+index);
    var dateRange = productRange.getCell(1, 6);
    dateRange.setValue(new Date);
    var stockRange = productRange.getCell(1, 2);
    var currentStock = stockRange.getValue();
    //productRange.setValues(productData);
    stockRange.setValue(currentStock+productStock);
    setBackColor(productRange, currentStock+productStock);
  }else{
    //未登録の場合、商品の追加
    sheet.insertRowAfter(1);
    index = 2;
    var targetRange = sheet.getRange("A2:F2");
    targetRange.setValues(productData);
    setBackColor(targetRange, productStock);
  }
}

//登録者であれば価格を変更
function changePrice(productName, productPrice, registUser){
  var index = getProductIndex(productName);
  var productRange = sheet.getRange("A"+index+":F"+index);
  if(registUser == productRange.getCell(1, 5).getValue()){
    var priceRange = productRange.getCell(1, 3);
    priceRange.setValue(productPrice);
    var dateRange = productRange.getCell(1, 6);
    dateRange.setValue(new Date);
  }
}

//商品名から商品の在庫数を取得
function getStock(productName){
  var index = getProductIndex(productName);
  if(index > 1){
    var stockRange = sheet.getRange("B"+(index));
    var currentStock = stockRange.getValue();
    return currentStock;
  }else{
    //例外処理をする
  }
}

/*
productNameが間違ってた場合の例外処理があると嬉しいです！
*/
//商品名から商品の在庫数を1減らす
function reduceStock(productName){
  var index = getProductIndex(productName);
  if(index > 1){
    var productRange = sheet.getRange("A"+index+":F"+index);
    var stockRange = productRange.getCell(1, 2);
    var currentStock = stockRange.getValue();
    stockRange.setValue(currentStock-1);
    setBackColor(productRange, currentStock-1);
  }else{
    //例外処理をする
  }
  //減らした後の在庫数を返す？いらない？
  return currentStock-1;
}

//商品名からindexを取得
function getProductIndex(productName){
  var lastrow = sheet.getLastRow();
  var products = sheet.getSheetValues(1, 1, lastrow, 1)
  //見つからなければindex=-1
  var index = transpose(products)[0].indexOf(productName);
  //0スタートから1スタートに変更
  return index+1;
}

//配列の転置
function transpose(a){
  return a[0].map(function(_, c){
    return a.map(function(r) {
      return r[c];
    });
  });
}

//在庫が10以上なら背景を黄緑、以下なら白にする
function setBackColor(range, stock){
  if(stock >= 10){
      range.setBackground("lime");
    }else{
      range.setBackground("white");
    }
}

function productTest(){
  //registerProduct("ああああああああああ", 15, 200, "", "てすと");
  var a = reduceStock("ああああああああああ");
  var b = getStock("ああああああああああ");
  var c=1
}