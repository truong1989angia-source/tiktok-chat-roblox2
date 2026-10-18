const { TikTokConnectionWrapper } = require('tiktok-live-connector');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const tiktokUsername = "an.thich.roblox3";
let chatQueue = [];

let tiktokLiveConnection = new TikTokConnectionWrapper(tiktokUsername);

function connectTikTok() {
    tiktokLiveConnection.connect().then(state => {
        console.log(`Đã kết nối TikTok Live của @${tiktokUsername}`);
    }).catch(err => {
        console.log('Chưa phát Live hoặc lỗi kết nối. Đang thử lại sau 15 giây...');
        setTimeout(connectTikTok, 15000);
    });
}

connectTikTok();

tiktokLiveConnection.on('chat', data => {
    chatQueue.push({
        user: data.uniqueId,
        comment: data.comment
    });
    if (chatQueue.length > 50) chatQueue.shift();
});

app.get('/get-chat', (req, res) => {
    const dataToSend = [...chatQueue];
    chatQueue = [];
    res.json(dataToSend);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
