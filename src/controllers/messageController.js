const {deleteMessage} = require('../services/whatsappService');
const {sendOkResponse, sendErrorResponse} = require('../utils/responseUtils');

exports.deleteMessage = async (req, res) => {
  const sessionId = req.params.sessionId;
  const {chatId, messageId, everyone} = req.body;

  try {
    const result = await deleteMessage(messageId, chatId, everyone);
    sendOkResponse(res, result);
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};
