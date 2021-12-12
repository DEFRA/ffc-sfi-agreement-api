const sendMessage = require('./send-message')
const config = require('../config')
const util = require('util')

async function sendAgreementSubmitMessage (body) {
  await sendMessage(body, 'uk.gov.sfi.agreement.submit', config.submitTopic)
  console.info('Agreement submitted', util.inspect(body, false, null, true))
}

module.exports = {
  sendAgreementSubmitMessage
}
