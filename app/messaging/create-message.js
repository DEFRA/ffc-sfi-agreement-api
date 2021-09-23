const createMessage = (body, type) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-api'
  }
}

module.exports = createMessage
