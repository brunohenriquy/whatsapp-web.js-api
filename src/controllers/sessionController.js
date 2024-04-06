const { getState } = require('../services/whatsappService');
const { sendOkResponse, sendErrorResponse } = require('../utils/responseUtils');

exports.getState = async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
        const state = await getState();
        sendOkResponse(res, state);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};
