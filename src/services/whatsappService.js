const {Client, LocalAuth, RemoteAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {MongoStore} = require('wwebjs-mongo');
const mongoose = require('mongoose');
const packageJson = require('./package.json');
const version = packageJson.version;

console.log("Version:", version);

let client;

async function initializeClient() {
  let headless = true;
  let args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'];
  let userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';
  if (process.env.MONGODB_URI) {
    console.log('Auth Strategy: RemoteAuth');
    await mongoose.connect(process.env.MONGODB_URI);
    const store = new MongoStore({mongoose: mongoose});
    client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: process.env.BACKUP_SYNC_INTERVAL_MS
      }),
      puppeteer: {
        headless: headless,
        args: args
      },
      userAgent: userAgent,
    });

    client.on('remote_session_saved', () => {
      console.log('Session saved on DB');
    });

  } else {
    console.log('Auth Strategy: LocalAuth');
    client = new Client({
      authStrategy: new LocalAuth({
        clientId: process.env.SESSION_ID,
        dataPath: './sessions'
      }),
      puppeteer: {
        headless: headless,
        args: args
      },
      userAgent: userAgent,
    });
  }

  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    client.qr = qr
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
  });

  client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
  });

  client.on('ready', async () => {
    client.qr = null;
    console.log('Client is ready!');
    try {
      const state = await client.getState();
      console.log('Current state:', state);
    } catch (error) {
      console.error('Error fetching state:', error);
    }
  });

  client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
  });

  client.initialize();
}

initializeClient();

const _getMessageById = async (messageId, chatId) => {
  const chat = await client.getChatById(chatId)
  const messages = await chat.fetchMessages({limit: 100})
  const message = messages.find((message) => {
    return message.id.id === messageId
  })
  return message
}

exports.sendMessage = async (chatId, contentType, content) => {
  const message = await client.sendMessage(chatId, content);
  return message;
};

exports.deleteMessage = async (messageId, chatId, everyone) => {
  const message = await _getMessageById(messageId, chatId)
  if (!message) {
    throw new Error('Message not Found')
  }
  const result = await message.delete(everyone)
  return result;
};

exports.getState = async () => {
  const state = await client.getState();
  return state;
};

exports.sessionQrCode = async () => {
  if (!client) {
    throw new Error('session_not_found')
  }
  if (client.qr) {
    return client.qr
  }
  throw new Error('qr code not ready or already scanned')
};
