const path = require('path')

// 連線設定 3000 || process.env.PORT, 
module.exports = {
    port: process.env.PORT,    
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
