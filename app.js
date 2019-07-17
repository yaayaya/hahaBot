const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const config = require('./config/config')

// app 加載使用套件
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())

// server 設定  連線開始
const server = app.listen(config.port)
    console.log(`伺服器開始運作 Port : ${config.port}`)

require("./routes/api.js")(app)






// require("./routes/api.js")(app);

// const a = require('./routes/test').ya.yaya()
// console.log(a);

