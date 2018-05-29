# slack_shop_add_command
本スクリプトは、slackで購買を運営するGASスクリプト郡[(qiita記事)](https://qiita.com/zensai3805/items/9a2a78312c4622a9dc37)における、slackの購買チェンネルへ商品を追加するためのスクリプトです。

## How to install
1. SlackのIncomming webhookのURLを取得します。  
まだSlack Appを作成していない場合は、[こちら](https://api.slack.com/)から作成してください。  
作成したAppから、サイドバーのIncomming Webhookを選択し、**Add new Webhook to Workspace**から購買チャンネルを選択、そのチャンネルへ投稿する際のWebhookのURLを取得しましょう。  
<img src="https://user-images.githubusercontent.com/19219101/40663744-57ea2796-6394-11e8-8ef8-7588fe8de6ae.PNG" width="500">

2. 本コードをあなたのGoogle AppScriptのProjectへpullしてください。
<img src="https://user-images.githubusercontent.com/19219101/40663000-bdd96f96-6392-11e8-9a03-2f5b4a9de618.PNG" width="500">

3. 上記コードをwebに公開し、slackのslachコマンド機能に追加しましょう。  
追加方法については割愛しますが、検索すれば出てくると思います。  
公式ドキュメント: [https://api.slack.com/slash-commands](https://api.slack.com/slash-commands)  

4. 完成！
slackにて、下記のようにslash commandを叩きましょう。  
``` 
/add_shop <商品名> <価格> <画像URL>  
#sample  
/addshop チロルチョコ 10 http://sample.jp 
```

<img src="https://user-images.githubusercontent.com/19219101/40664181-4e2f2b9c-6395-11e8-9132-26382f36064d.PNG" width="500">


