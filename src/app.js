const express = require('express');
const {sessionQrCode, sessionQrCodeImage} = require('./controllers/sessionController');
const {getState, sendMessage} = require('./controllers/clientController');
const {deleteMessage} = require('./controllers/messageController');
const apiKeyAuthMiddleware = require('./middlewares/apiKeyAuthMiddleware');

const app = express();

app.use(express.json());

app.get('/session/qr/:sessionId', apiKeyAuthMiddleware, sessionQrCode);
app.get('/session/qr/:sessionId/image', apiKeyAuthMiddleware, sessionQrCodeImage);

app.get('/client/getState/:sessionId', apiKeyAuthMiddleware, getState);
app.post('/client/sendMessage/:sessionId', apiKeyAuthMiddleware, sendMessage);

app.post('/message/delete/:sessionId', apiKeyAuthMiddleware, deleteMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
