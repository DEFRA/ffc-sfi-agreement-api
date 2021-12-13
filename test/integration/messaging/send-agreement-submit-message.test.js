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
let message

describe('send agreement submit message', () => {
  beforeEach(async () => {
    const agreementNumber = 'AG123456789'
    const sbi = 123456789
    message = {
      agreementNumber,
      organisation: {
        sbi
      },
      action: {
        paymentAmount: '4383801.50'
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
    expect(mockSendMessage.mock.calls[0][0].body.organisation.sbi).toEqual(message.organisation.sbi)
    expect(mockSendMessage.mock.calls[0][0].body.action.paymentAmount).toEqual(message.action.paymentAmount)
  })
})
