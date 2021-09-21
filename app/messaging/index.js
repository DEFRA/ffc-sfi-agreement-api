const sendMessage = require('./send-message')
const config = require('../config')

async function sendAgreementSubmitMessage (payload) {
  console.log('XXXXXXXX', payload, config.submitTopic)
  await sendMessage(payload, 'uk.gov.sfi.agreement.submit', config.submitTopic)
  console.info('Agreement submitted')
}

module.exports = {
  sendAgreementSubmitMessage
}
