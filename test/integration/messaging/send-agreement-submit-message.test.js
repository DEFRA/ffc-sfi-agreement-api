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
        paymentAmount: '4383801.50',
        standards: [
          {
            id: '110',
            ambitionLevel: 'Introductory',
            paymentAmount: '4383801.50',
            parcels: [
              {
                id: 'TQ22526635',
                area: 13.387652
              },
              {
                id: 'TQ21529203',
                area: 3.473123
              }
            ]
          }
        ]
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
