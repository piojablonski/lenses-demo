import { findMessages } from './'

const testData = [
  {
    key: "5397076989446422",
    offset: 21489934,
    partition: 0,
    timestamp: 1561968263681,
    topic: "cc_payments",
    value: '{"id":"txn1561968263681","time":"2019-07-01T08:04:23.681Z","amount":2682.92,"currency":"USD","creditCardId":"5397076989446422","merchantId":40}'
  },
  {
    key: "5373595752176476",
    offset: 21489935,
    partition: 0,
    timestamp: 1561968263881,
    topic: "cc_payments",
    value: '{"id":"txn1561968263881","time":"2019-07-01T08:04:23.881Z","amount":4469.6,"currency":"GBP","creditCardId":"5373595752176476","merchantId":72}'
  },
  {
    key: "5524874546065610",
    offset: 21489936,
    partition: 0,
    timestamp: 1561968264082,
    topic: "cc_payments",
    value: '{"id":"txn1561968264082","time":"2019-07-01T08:04:24.082Z","amount":3739.19,"currency":"EUR","creditCardId":"5524874546065610","merchantId":63}'
  }
]

describe('findMessages', () => {
  test('return empty array when when searchQuery is empty', () => {
    const actual = findMessages(testData, '')
    const expected = []
    expect(actual).toEqual(expected)
  })

  test('return empty messages array if messages is undefined', () => {
    const actual = findMessages(undefined, '')
    const expected = []
    expect(actual).toEqual(expected)
  })

  test.each([
    ['txn', [0, 1, 2]],
    ['EUR', [2]],
    ['eur', [2]]
  ])('%# filtering data set with searchQuery: %s', (searchQuery, expected) => {
    const actual = findMessages(testData, searchQuery)
    expect(actual).toEqual(expected)
  })
})