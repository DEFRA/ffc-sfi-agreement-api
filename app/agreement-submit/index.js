const buildSubmitMessage = (submitMessage) => {
  return {
    agreementNumber: submitMessage.agreementNumber,
    sbi: submitMessage.selectedSbi.sbi,
    agreement: {
      standards: buildStandards(submitMessage)
    }
  }
}

const buildStandards = (submitMessage) => {
  const selectedParcels = submitMessage.selectedParcels
  const selectedStandard = submitMessage.selectedStandard
  const ambitionLevel = submitMessage.selectedAmbitionLevel.name
  const paymentAmount = submitMessage.selectedAmbitionLevel.level.paymentAmount
  return {
    id: selectedStandard.code,
    ambitionLevel,
    paymentAmount,
    parcels: selectedParcels.map(parcel => ({
      id: parcel.id,
      area: parcel.area
    }))
  }
}

module.exports = buildSubmitMessage
