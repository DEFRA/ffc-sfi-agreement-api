const sendMessage = require('./send-message')
const config = require('../config')

async function sendAgreementSubmitMessage (payload) {
  await sendMessage(payload, 'uk.gov.sfi.agreement.submit', config.submitTopic)
  console.info('Agreement submitted')
}

module.exports = {
  sendAgreementSubmitMessage
}
