const buildSubmitMessage = (submitMessage) => {
  const paymentAmount = submitMessage.selectedAmbitionLevel.level.paymentAmount
  return {
    agreementNumber: submitMessage.agreementNumber,
    sbi: submitMessage.selectedSbi.sbi,
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
