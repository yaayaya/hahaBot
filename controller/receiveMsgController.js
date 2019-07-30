const axios = require('axios');
let hahabot = require('../config/config').hahaBot
// api 網址
const hahaAPI  = 'https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=' + hahabot.AccessToken

const uBikeApiUrl = 'http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001'

// 全域資料  使用者當前狀態等
let senderID = null

// 說明書
// 發送訊息     textMsgSend(text)                       回覆文字訊息
// 發送貼圖     stickerMsgSend( groupID , stickerID )   貼圖
// 發送圖片     imgMsgSend( image )                     圖片物件
// 特殊事件選單  exMsgSend ()

let images = {
  // 太陽海豚
  sunDophin :
  {"id":"43f89753cdc02d3ef1fad7e6d353c764","ext":"JPG","width":400,"height":1200} ,
  // 方塊鳥
  squireBird :
  {"id":"18a41b8037ebcd25f4078037fc97f969","ext":"PNG","width":395,"height":254}
}

module.exports = {
  async filterData (req,res) {
    try{
      // 傳送時間
      let time = req.body.time
      // 使用者ID
      senderID = req.body.messaging[0].sender_id
      // 使用者傳送的訊息
      let message = req.body.messaging[0].message.text
      // 使用者事件id
      let eventID = req.body.messaging[0].event_id
      // 使用者 事件指令
      let botCommand = req.body.messaging[0].bot_command

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
  // switch(message) {}
  if (message == 'a'){
    textMsgSend('test')
  }
  else if (message == 'b'){
    stickerMsgSend( getRandomNum(1,12) , getRandomNum(1,12))
  }
  // 如果是 ubike/XXX 形式的話 傳送至ubike判斷 [0] ubike [1] 地區名字
  else if (MessageData[0] == 'Ubike' || MessageData[0] == 'uBike' || MessageData[0]=='ubike'){
    uBikeDataSend(MessageData[1])
  }
  else if (message == "c"){
    imgMsgSend(images.sunDophin)
  }
  // 特殊事件
  else if (message == 'd'){
    exMsgMenuSend(message)
  }
  // 狀況外 回聲 message 傳送message
  else{
    textMsgSend(message)
  }
}

// uBike 查詢指令接收
const uBikeDataSend = async(location)=>{  
  try{
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
  }catch(err){
    textMsgSend(err)
  }
 
}

// 文字訊息傳送
const textMsgSend = async (text) =>{
  try{
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
  }catch(err){
    textMsgSend(err)
  }

}
// 貼圖訊息 
const stickerMsgSend = async (sticker_group,sticker_id) => {
  try{
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
  }catch(err){
    textMsgSend(err)
  }
}
// 圖片訊息
const imgMsgSend = async (image) =>{
  let applyMsg = {
    "recipient":{
      "id": senderID
    },
    "message":{
      "type":"img",
      "id": image.id ,
      "ext": image.ext,
      "width": image.width,
      "height": image.height
    }
   }
   axiosGo(applyMsg)
}

// 初始特殊訊息選單 
const exMsgMenuSend = async (message , startImg , initImg) =>{
  let applyMsg = {
    "recipient":{
      "id": senderID
    },
    "message":{
      "type":"botStart",
      "start_img": `${startImg.id}.${startImg.ext}`,
      "init":{
        "image": `${initImg.id}.${initImg.ext}`,
        "hp":{
          "max":100,
          "current":100,
          "color":"#EB698B"
        },
        "text":{
          "message": message,
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
   axiosGo(applyMsg)
}
// 特殊訊息
const exMsgSend = async (message) => {

}


// 發出訊息  axios GoGoGo
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

// 設置 hp  (最大HP , 當前HP , HP顏色)
const setHP = (maxHP , currentHP , colorID) => {
  if (!colorID) {
    colorID = '#f22805'
  }
  let hp = 
  `
    "hp":{
      "max":${maxHP},
      "current":${currentHP},
      "color": ${colorID}
    }
    `
  return hp
}
// 設置 text   (文字內容 , 顏色)
const setExMsgText = ( exMsgText , colorID) => {
  if (!colorID) {
    colorID = '#EB698B'
  }
  let text = 
  `
    "text":{
      "message":${exMsgText},
      "color": ${colorID}
    }
  `
  return text
}
console.log(setExMsgText('今天天氣很好ㄛ'));

// 設置button
const setButton = ( btnNum ,btnData) => {
  if (!colorID) {
    colorID = '#EB698B'
  }
  let btnData = null
  for (i = 0 ; i < btnNum; i++ ) {

  }



  let button = 
  `
    "button":{
      "style":2,
      "setting":[
        ${btnData}
      ]
    }
  `
  return text
}