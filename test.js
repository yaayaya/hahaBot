ACCESS_TOKEN = "c5e0710601bdc89cf61c"; //改成你後臺裡的Access Token
shitUrl = "https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=" + ACCESS_TOKEN;
var senderId;

function doPost(e) {  
  var msg= JSON.parse(e.postData.contents);
  console.log(msg);
  var shitText = msg.messaging[0].message.text;
  senderId = msg.messaging[0].sender_id;     
  
  
  if(shitText == "你都知道了，柚子要失業了，嗚"){
    botReply("不，你還有很多工作要做");
  }else if(shitText == "你是誰"){
    botReply("看我頭像，我是土耳其霜淇淋～～");
  }else if(shitText == "範例3"){
    botReply("自己照著複製，對話想要多少有多少");
  }
  
}

function botReply(replyMsg){
  sendObj = {
    "recipient":{
      "id":senderId
    },
    "message":{
      "type":"text",
      "text":replyMsg
    }
  };
  
  UrlFetchApp.fetch(shitUrl, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'method': 'post',
    'payload': JSON.stringify(sendObj),
  });
}
