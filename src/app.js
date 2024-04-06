const express = require('express');
const { sendMessage, deleteMessage } = require('./controllers/messageController');
const { getState } = require('./controllers/sessionController');
const apiKeyAuthMiddleware = require('./middlewares/apiKeyAuthMiddleware');

const app = express();

app.use(express.json());

app.post('/client/sendMessage/:sessionId', apiKeyAuthMiddleware, sendMessage);
app.post('/message/delete/:sessionId', apiKeyAuthMiddleware, deleteMessage);
app.get('/client/getState/:sessionId', apiKeyAuthMiddleware, getState);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
