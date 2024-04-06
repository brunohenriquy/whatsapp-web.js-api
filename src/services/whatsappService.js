const { Client, LocalAuth } = require('whatsapp-web.js');
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

const _getMessageById = async (messageId, chatId) => {
  const chat = await client.getChatById(chatId)
  const messages = await chat.fetchMessages({ limit: 100 })
  const message = messages.find((message) => { return message.id.id === messageId })
  return message
}

exports.sendMessage = async (chatId, contentType, content) => {
    const message = await client.sendMessage(chatId, content);
    return message;
};

exports.deleteMessage = async (messageId, chatId, everyone) => {
    const message = await _getMessageById(messageId, chatId)
    if (!message) { throw new Error('Message not Found') }
    const result = await message.delete(everyone)
    return result;
};

exports.getState = async () => {
    const state = await client.getState();
    return state;
};
