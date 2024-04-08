const {sessionQrCode} = require('../services/whatsappService');
const {sendOkResponse, sendErrorResponse} = require('../utils/responseUtils');
const qr_image = require('qr-image')


exports.sessionQrCode = async (req, res) => {
  try {
    const sessionId = req.params.sessionId
    const qr = await sessionQrCode()
    return res.json({success: true, qr: qr})
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

exports.sessionQrCodeImage = async (req, res) => {
  try {
    const sessionId = req.params.sessionId
    const qr = await sessionQrCode()
    const qrImage = qr_image.image(qr)

    res.writeHead(200, {
      'Content-Type': 'image/png'
    })
    return qrImage.pipe(res)
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}
