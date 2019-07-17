import axios from 'axios'

let hahabot = require('../config/config').hahaBot
// api 網址
const hahaAPI  = 'https://us-central1-hahamut-8888.cloudfunctions.net/messagePush?access_token=' + hahabot.AccessToken

export default () => {
  return axios.create({
    baseURL: `hahaAPI`

  })
}
