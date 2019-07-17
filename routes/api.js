// 轉接站
const receiveMsgController = require("../controller/receiveMsgController")

module.exports = (app) => {
  // recevieMsg 接收訊息API
  app.post('/receiveMsg' , receiveMsgController.filterData )
}