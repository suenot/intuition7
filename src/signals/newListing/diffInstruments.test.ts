import { diffInstruments } from './diffInstruments';
import { Instrument } from '../../types';

const oldInstruments = [
  {
    "id": "ETH/BTC/binance",
    "exchangeId": "binance",
    "baseId": "ETH",
    "quoteId": "BTC",
    "pairId": "ETH/BTC",
    "active": false
  },
  {
    "id": "LTC/BTC/binance",
    "exchangeId": "binance",
    "baseId": "LTC",
    "quoteId": "BTC",
    "pairId": "LTC/BTC",
    "active": false
  }
]

const newInstruments = [
  {
    "id": "ETH/BTC/binance",
    "exchangeId": "binance",
    "baseId": "ETH",
    "quoteId": "BTC",
    "pairId": "ETH/BTC",
    "active": false
  },
  {
    "id": "LTC/BTC/binance",
    "exchangeId": "binance",
    "baseId": "LTC",
    "quoteId": "BTC",
    "pairId": "LTC/BTC",
    "active": false
  },
  {
    "id": "IOTA/BTC/binance",
    "exchangeId": "binance",
    "baseId": "IOTA",
    "quoteId": "BTC",
    "pairId": "IOTA/BTC",
    "active": false
  },
  {
    "id": "WAVES/BTC/binance",
    "exchangeId": "binance",
    "baseId": "WAVES",
    "quoteId": "BTC",
    "pairId": "WAVES/BTC",
    "active": false
  },
  {
    "id": "EOS/BTC/bittrex",
    "exchangeId": "bittrex",
    "baseId": "EOS",
    "quoteId": "BTC",
    "pairId": "EOS/BTC",
    "active": false
  }
]

const alreadyListingInstruments = [
  {
    "id": "IOTA/BTC/binance",
    "exchangeId": "binance",
    "baseId": "IOTA",
    "quoteId": "BTC",
    "pairId": "IOTA/BTC",
    "active": false
  },
]

const blacklistInstruments = [
  {
    "id": "EOS/BTC/bittrex",
    "exchangeId": "bittrex",
    "baseId": "EOS",
    "quoteId": "BTC",
    "pairId": "EOS/BTC",
    "active": false
  }
]

const expectedListingInstruments = [
  {
    "id": "WAVES/BTC/binance",
    "exchangeId": "binance",
    "baseId": "WAVES",
    "quoteId": "BTC",
    "pairId": "WAVES/BTC",
    "active": false
  }
]

// TODO: тест прошел слишком медленно, 4с
describe('diffInstruments', () => {
  it.only('should return list of a new instruments', async () => {
    const listingInstruments = diffInstruments({oldInstruments, newInstruments, alreadyListingInstruments, blacklistInstruments});
    expect(listingInstruments).toEqual(expectedListingInstruments);
  })
})