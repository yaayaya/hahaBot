const path = require('path')

// 連線設定 3000 || process.env.PORT, 
module.exports = {
    port: 3000|| process.env.PORT,    
    // db: {
    //     databaser: process.env.DB_NAME || 'parkservice',
    //     user: process.env.DB_USER || null,
    //     password: process.env.DB_PASS || null,
    //     options: {
    //       dialect: process.env.DIALECT || 'sqlite',
    //       host: process.env.HOST || 'localhost',
    //       storage: path.resolve(__dirname, '../parkservice.db')
    //     }
    //   },
    // 機器人資訊
    hahaBot : {
      BotId : `bot@216`,
      AccessToken : `c5e0710601bdc89cf61c`,
      AppSecret : 'd15e3a6e095ab9854ad7',
    }
    
}
// 圖片上傳網址 post img
// 'https://us-central1-hahamut-8888.cloudfunctions.net/imagePush?bot_id=bot@216&access_token=c5e0710601bdc89cf61c'

// 太陽海豚
// {"id":"43f89753cdc02d3ef1fad7e6d353c764","ext":"JPG","width":3024,"height":4032}

// bird
// {"id":"18a41b8037ebcd25f4078037fc97f969","ext":"PNG","width":395,"height":254}