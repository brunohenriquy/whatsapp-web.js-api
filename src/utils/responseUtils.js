exports.sendResponse = (res, status, success, message) => {
  res.status(status).json({success: success, message: message});
};

exports.sendErrorResponse = (res, status, message) => {
  this.sendResponse(res, status, false, message);
};

exports.sendOkResponse = (res, message) => {
  this.sendResponse(res, 200, true, message);
};