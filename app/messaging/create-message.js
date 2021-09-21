const createMessage = (body, type, messageId) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-api',
    messageId
  }
}

module.exports = createMessage
