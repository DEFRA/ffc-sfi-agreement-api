const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})
const { sendAgreementSubmitMessage } = require('../../../app/messaging')
const generateAgreementNumber = require('../../../app/agreement-number')
let message

describe('send agreement submit message', () => {
  beforeEach(async () => {
    const agreementNumber = generateAgreementNumber()
    const sbi = 123456789
    message = {
      agreementNumber,
      sbi,
      agreement: {
        agreementNumber,
        sbi,
        paymentAmount: 100
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('completes valid message', async () => {
    await sendAgreementSubmitMessage(message)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('completes valid message', async () => {
    await sendAgreementSubmitMessage(message)
    expect(mockSendMessage.mock.calls[0][0].body.agreementNumber).toEqual(message.agreementNumber)
    expect(mockSendMessage.mock.calls[0][0].body.sbi).toEqual(message.sbi)
    expect(mockSendMessage.mock.calls[0][0].body.agreement.paymentAmount).toEqual(message.agreement.paymentAmount)
  })
})
