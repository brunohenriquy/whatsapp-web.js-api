const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: process.env.SESSION_ID, dataPath: './sessions' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('Client is ready!');
    try {
        const state = await client.getState();
        console.log('Current state:', state);
    } catch (error) {
        console.error('Error fetching state:', error);
    }
});

client.initialize();

const app = express();
app.use(express.json());

const sendResponse = (res, status, success, message) => {
  res.status(status).json({ success: success, message: message })
}

const sendErrorResponse = (res, status, message) => {
  sendResponse(res, status, false, message)
}

const sendOkResponse = (res, message) => {
  sendResponse(res, 200, true, message)
}

function authenticateApiKey(req, res, next) {
    const providedApiKey = req.headers['x-api-key'];
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        if (providedApiKey && providedApiKey === apiKey) {
            next(); // Proceed to the next middleware
        } else {
            sendErrorResponse(res, 401, 'Unauthorized')
        }
    } else {
        next(); // Proceed to the next middleware
    }
}

async function sendMessage(chatId, contentType, content) {
    message = await client.sendMessage(chatId, content);
    return message;
}

const _getMessageById = async (client, messageId, chatId) => {
  const chat = await client.getChatById(chatId)
  const messages = await chat.fetchMessages({ limit: 100 })
  const message = messages.find((message) => { return message.id.id === messageId })
  return message
}

app.post('/client/sendMessage/:sessionId', authenticateApiKey, async (req, res) => {
    const sessionId = req.params.sessionId;
    const { chatId, contentType, content } = req.body;

    try {
        const message = await sendMessage(chatId, contentType, content);
        sendOkResponse(res, message);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

app.post('/message/delete/:sessionId', authenticateApiKey, async (req, res) => {
    const sessionId = req.params.sessionId;
    const { chatId, messageId, everyone } = req.body;

    try {
        const message = await _getMessageById(client, messageId, chatId)
        if (!message) { throw new Error('Message not Found') }
        const result = await message.delete(everyone)
        sendOkResponse(res, result);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

app.get('/client/getState/:sessionId', authenticateApiKey, async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
        const state = await client.getState();
        sendOkResponse(res, state);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



