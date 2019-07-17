const axios = require('axios');

let hahabot = require('../config/config').hahaBot
// api 網址
const hahaAPI  = 'https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=' + hahabot.AccessToken

module.exports = {
  async filterData (req,res) {
    try{
      // 傳送時間
      let time = req.body.time
      // 使用者ID
      let senderId = req.body.messaging[0].sender_id
      // 使用者傳送的訊息
      let message = req.body.messaging[0].message.text
      // data整合包
      let receiveData = {time : time , senderId : senderId , message : message}
     
      // 判斷訊息
      chooseFunction(receiveData)
      
      // 成功時發送狀態200 
      res.status(200).send('ya')
    }catch(err){
      res.status(500).send({
        error: 'filterData Error  ' + (err)
    })
    }
  }
}

// 判斷使用者訊息  選出要執行方法
const chooseFunction = (receiveData) => {
  if (receiveData.message == '文字訊息'){
    textMsgSend(receiveData)
  }
  else if (receiveData.message == '貼圖訊息'){
    stickerMsgSend(receiveData)
  }
  else{
    echoData(receiveData)
  }
}

// 文字訊息 function
const textMsgSend = async (receiveData) =>{
  let applyMsg1 = {
    "recipient":{
      "id": receiveData.senderId 
    },
    "message":{
      "type":"text",
      "text":"這裡是文字訊息ya  下面展示send的json"
    }
   }
   await axiosGo(applyMsg1)
   let applyMsg2 = {
    "recipient":{
      "id": receiveData.senderId 
    },
    "message":{
      "type":"text",
      "text":  JSON.stringify(applyMsg1)
    }
   }
   await axiosGo(applyMsg2)

}

// 圖片訊息
const stickerMsgSend = async (receiveData) => {
  let applyMsg1 = {
    "recipient":{
      "id": receiveData.senderId
    },
    "message":{
      "type":"sticker",
      "sticker_group": '25',
      "sticker_id": '12'
    }
   }
   await axiosGo(applyMsg1)


}

// 回音機
const echoData = (receiveData) =>{
  // echo 回覆訊息設定
  let applyData = {
    "recipient":{
      "id": receiveData.senderId 
    },
    "message":{
      "type":"text",
      "text": receiveData.message
    }
   }
   axiosGo(applyData)
   
}



// 發出訊息 
const axiosGo = async (applyData) => {
  try{
    await axios.post(hahaAPI , applyData)
  }catch(err){
    error: 'axiosGo Error ' + (err)
  }
}