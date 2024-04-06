const { sendErrorResponse } = require('../utils/responseUtils');

const apiKey = process.env.API_KEY;

module.exports = (req, res, next) => {
    const providedApiKey = req.headers['x-api-key'];
    if (apiKey) {
        if (providedApiKey && providedApiKey === apiKey) {
            next(); // Proceed to the next middleware
        } else {
            sendErrorResponse(res, 401, 'Unauthorized')
        }
    } else {
        next(); // Proceed to the next middleware
    }
};
