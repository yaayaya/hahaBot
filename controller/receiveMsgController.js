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
      
      // echo 測試
      echoData(receiveData)
      
      // 成功時發送狀態200 
      res.status(200).send('ya')
    }catch(err){
      res.status(500).send({
        error: 'filterData Error  ' + (err)
    })
    }
  }
}

// 回音機
const echoData = (receiveData) =>{
  console.log(receiveData);
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