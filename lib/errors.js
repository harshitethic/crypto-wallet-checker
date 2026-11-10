'use strict';
// Never log upstream messages/configuration: Axios and Telegram errors may
// contain credential-bearing URLs or full request objects.
function errorCode(error) {
    const allowed = new Set(['ETIMEDOUT', 'ECONNABORTED', 'ECONNRESET',
        'ECONNREFUSED', 'ENOTFOUND', 'ERR_CANCELED']);
    return allowed.has(error?.code) ? error.code : 'REQUEST_FAILED';
}
module.exports = {errorCode};
