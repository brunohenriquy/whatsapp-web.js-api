const {getState, sendMessage} = require('../services/whatsappService');
const {sendOkResponse, sendErrorResponse} = require('../utils/responseUtils');

exports.getState = async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const state = await getState();
    sendOkResponse(res, state);
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

exports.sendMessage = async (req, res) => {
  const sessionId = req.params.sessionId;
  const {chatId, contentType, content} = req.body;

  try {
    const message = await sendMessage(chatId, contentType, content);
    sendOkResponse(res, message);
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};
