// 加密
const crypto = require('crypto');
// 金鑰雜錯認證加密
const hmac = crypto.createHmac('sha1', 'd15e3a6e095ab9854ad7');
hmac.update(JSON.stringify(req.body), 'utf-8');
const expectedSignature = 'sha1=' + hmac.digest('hex');

// 機器人判斷
if (req.headers['x-baha-data-signature'] != expectedSignature) {
 console.log('not ok');
} else {
 console.log('ok');
}