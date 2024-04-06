const { sendMessage, deleteMessage } = require('../services/whatsappService');
const { sendOkResponse, sendErrorResponse } = require('../utils/responseUtils');

exports.sendMessage = async (req, res) => {
    const sessionId = req.params.sessionId;
    const { chatId, contentType, content } = req.body;

    try {
        const message = await sendMessage(chatId, contentType, content);
        sendOkResponse(res, message);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

exports.deleteMessage = async (req, res) => {
    const sessionId = req.params.sessionId;
    const { chatId, messageId, everyone } = req.body;

    try {
        const result = await deleteMessage(messageId, chatId, everyone);
        sendOkResponse(res, result);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};
