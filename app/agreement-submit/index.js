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
  const selectedParcels = submitMessage.selectedParcels
  const selectedStandard = submitMessage.selectedStandard
  const ambitionLevel = submitMessage.selectedAmbitionLevel.name
  return [{
    id: selectedStandard.code,
    ambitionLevel,
    paymentAmount,
    parcels: selectedParcels.map(parcel => ({
      id: parcel.id,
      area: parcel.area
    }))
  }]
}

module.exports = buildSubmitMessage
