const axios = require('axios');
let hahabot = require('../config/config').hahaBot
// api 網址
const hahaAPI  = 'https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=' + hahabot.AccessToken

const uBikeApiUrl = 'http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001'

// 圖片上傳網


module.exports = {
  async filterData (req,res) {
    try{
      // 傳送時間
      let time = req.body.time
      // 使用者ID
      let senderId = req.body.messaging[0].sender_id
      // 使用者傳送的訊息
      let message = req.body.messaging[0].message.text
      // 使用者事件id
      // let eventID = req.body.messaging[0].message.event_id
      // 使用者 事件指令
      // let botCommand = req.body.message[0].message.bot_command
      // data整合包


      let receiveData = {
        time : time , 
        senderId : senderId , 
        message : message , 
        // eventID : eventID,
        // botCommand : botCommand
      }
      msgReplyFunction(receiveData)

      // // 一般文字訊息
      // if (receiveData.message){
      //   msgReplyFunction(receiveData)
      // }
      // // 點擊事件情況
      // else if (receiveData.eventID){
      //   console.log('進入');
      // }
      // else{
      //   console.log("大失敗ㄛ");
      // }
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
const msgReplyFunction = (receiveData) => {
  let MessageData = receiveData.message.split("/")
  if (receiveData.message == '文字訊息'){
    textMsgSend(receiveData)
  }
  else if (receiveData.message == '貼圖訊息'){
    stickerMsgSend(receiveData)
  }
  // 如果是 ubike/XXX 形式的話 傳送至ubike判斷 [0] ubike [1] 地區名字
  else if (MessageData[0] == 'Ubike' || MessageData[0] == 'uBike' || MessageData[0]=='ubike'){
    uBikeDataSend(receiveData,MessageData[1])
  }
  else if (receiveData.message == "image"){
    imgMsgSend(receiveData)
  }
  else if (receiveData.message == 't'){
    uniqueMsgSend(receiveData)
  }
  // 狀況外 回聲
  else{
    echoData(receiveData)
  }
}

// uBike 查詢指令接收
const uBikeDataSend = async(receiveData,location)=>{  
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
    let b = filterDatas.join("\n")
    // 發送a
    let applyMsg1 = {
      "recipient":{
        "id": receiveData.senderId 
      },
      "message":{
        "type":"text",
        "text": b
      }
     }
     await axiosGo(applyMsg1)
  }
  else {
       // 發送
       let applyMsg1 = {
        "recipient":{
          "id": receiveData.senderId 
        },
        "message":{
          "type":"text",
          "text": '大失敗'
        }
       }
       await axiosGo(applyMsg1) 
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

// 貼圖訊息
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

// 圖片訊息
const imgMsgSend = async (receiveData) =>{
  let applyMsg2 = {
    "recipient":{
      "id": receiveData.senderId
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

// 發出訊息  
const axiosGo = async (applyData) => {
  try{
    await axios.post(hahaAPI , applyData)
  }catch(err){
    error: 'axiosGo Error ' + (err)
  }
}