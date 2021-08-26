const generateAgreementNumber = () => {
  return `AG${new Date().getTime()}`
}

module.exports = generateAgreementNumber
