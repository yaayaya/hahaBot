const axios = require('axios');
let hahabot = require('../config/config').hahaBot
// api 網址
const hahaAPI  = 'https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=' + hahabot.AccessToken

const uBikeApiUrl = 'http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001'

// 全域資料  使用者當前狀態等
let senderID = null

// 說明書
// 發送訊息 textMsgSend(text)  
// 發送貼圖 stickerMsgSend( groupID , stickerID )
// 發送圖片 imgMsgSend(imgID, imgExt, imgWidth , imgHeight)


module.exports = {
  async filterData (req,res) {
    try{
      let data = req.body.messaging[0]
      // 傳送時間
      let time = req.body.time
      // 使用者ID
      senderID = req.body.messaging[0].sender_id
      // 使用者傳送的訊息
      let message = req.body.messaging[0].message.text
      // 使用者事件id
      let eventID = data.event_id
      // 使用者 事件指令
      let botCommand = data.bot_command

      // 文字訊息時  下去判斷
      msgReplyFunction(message)


      res.status(200).send('ya')
    }catch(err){
      res.status(500).send({
        error: 'filterData Error  ' + (err)
    })
    }
  }
}

// 判斷使用者訊息  選出要執行方法
const msgReplyFunction = (message) => {
  let MessageData = message.split("/")
  if (message == 'a'){
    textMsgSend(message)
  }
  else if (message == 'b'){
    stickerMsgSend( getRandomNum(1,20) , getRandomNum(1,20))
  }
  // 如果是 ubike/XXX 形式的話 傳送至ubike判斷 [0] ubike [1] 地區名字
  else if (MessageData[0] == 'Ubike' || MessageData[0] == 'uBike' || MessageData[0]=='ubike'){
    uBikeDataSend(receiveData,MessageData[1])
  }
  else if (message == "c"){
    imgMsgSend(message)
  }
  else if (message == 'd'){
    uniqueMsgSend(message)
  }
  // 狀況外 回聲 message 傳送message
  else{
    textMsgSend(message)
  }
}

// uBike 查詢指令接收
const uBikeDataSend = async(message,location)=>{  
  const uBikeDatas = (await axios.get(uBikeApiUrl)).data
  if (uBikeDatas.success == true){
    // 創造空陣列裝填整理資料
    let filterDatas = []
    // 整理資料
    for (let i = 0; i < (uBikeDatas.result.records).length; i++) {
      // 判定區域
      if (uBikeDatas.result.records[i].sarea == location){
        filterDatas.push(uBikeDatas.result.records[i].sna)
      }
    }
    // 整理完的資料 
    let data = filterDatas.join("\n")
    // 發送a
    textMsgSend(data)
  }
  else {
    textMsgSend('大失敗')
  }
}



// 文字訊息傳送
const textMsgSend = async (text) =>{
  let applyMsg = {
    "recipient":{
      "id": senderID 
    },
    "message":{
      "type":"text",
      "text": text
    }
   }
   await axiosGo(applyMsg)
}

// 貼圖訊息 
const stickerMsgSend = async (sticker_group,sticker_id) => {
  let applyMsg = {
    "recipient":{
      "id": senderID
    },
    "message":{
      "type":"sticker",
      "sticker_group": sticker_group,
      "sticker_id" : sticker_id
    }
   }
   await axiosGo(applyMsg)
}

// 圖片訊息
const imgMsgSend = async (imgID, imgExt, imgWidth , imgHeight) =>{
  let applyMsg2 = {
    "recipient":{
      "id": senderID
    },
    "message":{
      "type":"img",
      "id": '43f89753cdc02d3ef1fad7e6d353c764',
      "ext":"JPG",
      "width":"3024",
      "height":"4032"
    }
   }
   axiosGo(applyMsg2)
}

// 特殊訊息
const uniqueMsgSend = async (receiveData) =>{
  let applyMsg1 = {
    "recipient":{
      "id": receiveData.senderId
    },
    "message":{
      "type":"botStart",
      "start_img":"43f89753cdc02d3ef1fad7e6d353c764.JPG",
      "init":{
        "image":"18a41b8037ebcd25f4078037fc97f969.PNG",
        "hp":{
          "max":1000,
          "current":100,
          "color":"#000000"
        },
        "text":{
          "message": 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab repellat provident mollitia deserunt cum aperiam pariatur placeat ea fuga? At officiis nesciunt obcaecati iste cum cupiditate quod est rem consectetur!',
          "color":"#7A929B"
        },
        "button":{
          "style":1,
          "setting":[
            {
              "disabled":false,
              "order":1,
              "text":"yaaaaaaaaaaaaaaa！",
              "command":"/news fight"
            }
          ]
        }
      }
    }
   }
}

// 發出訊息  axios Go
const axiosGo = async (applyData) => {
  try{
    await axios.post(hahaAPI , applyData)
  }catch(err){
    error: 'axiosGo Error ' + (err)
  }
}

// 隨機數(字串)回傳
const getRandomNum = (min , max ) =>{
  strNum = String(Math.floor(Math.random()*max)+ min)
  return strNum
}

