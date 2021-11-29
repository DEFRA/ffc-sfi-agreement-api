const buildSubmitMessage = (submitMessage) => {
  const paymentAmount = submitMessage.selectedAmbitionLevel.level.paymentAmount
  const sbi = submitMessage.selectedOrganisation.sbi
  const callerId = submitMessage.callerId
  const organisationId = submitMessage.selectedOrganisation.organisationId
  return {
    agreementNumber: submitMessage.agreementNumber,
    sbi,
    callerId,
    organisationId,
    agreement: {
      paymentAmount,
      standards: buildStandards(submitMessage, paymentAmount)
    }
  }
}

const buildStandards = (submitMessage, paymentAmount) => {
  const selectedStandard = submitMessage.selectedStandard
  const ambitionLevel = submitMessage.selectedAmbitionLevel.name
  return [{
    code: selectedStandard.code,
    ambitionLevel,
    paymentAmount,
    landCovers: submitMessage.selectedLandCovers
  }]
}

module.exports = buildSubmitMessage
