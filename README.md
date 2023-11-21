# Intuition 7

## Development
To start the development server run:
```bash
bun dev:bun:debug
```

Open http://localhost:8080/ with your browser to see the result.

## Получение ордербука
http://localhost:7771/orderbook?base=ETH
http://localhost:7771/orderbook?base=ETH&quote=BTC
http://localhost:7771/orderbook?base=ETH&quote=BTC&exchange=binance

## Получение истории ордербука
- http://localhost:7771/orderbook-history?base=ETH
- http://localhost:7771/orderbook-history?base=ETH&quote=BTC
- http://localhost:7771/orderbook-history?base=ETH&quote=BTC&exchange=binance

## Получение информации о биржах
http://localhost:7771/exchanges
http://localhost:7771/exchanges/binance
## Включить биржу
http://localhost:7771/exchanges/binance?active=true

## Получение информации о парах
http://localhost:7771/pairs
http://localhost:7771/pairs?id=LTC/BTC

## Включить пару
http://localhost:7771/pairs?id=LTC/BTC&active=true

## Получение информации об ассетах
http://localhost:7771/assets
http://localhost:7771/assets?id=LTC

## Включить ассет
http://localhost:7771/pairs?id=LTC&active=true

## Получение информации об инструментах
http://localhost:7771/instruments
http://localhost:7771/instruments?id=LTC/BTC/binance

## Включить инструмент
http://localhost:7771/instruments?id=LTC/BTC/binance&active=true

## Алгоритм
- есть функция работы парсеров, которая перезапускается, если меняется конфиг
  - получение ордербука в ccxt формате
  - перевод в стандартный формат
  - сохранение в store ордербука
  - сохранение в store истории ордербука


## Planned Schema for Historical Data

To get all pairs where base is ETH and quote is BTC:
```
http://149.102.136.233:7771/orderbook-history?base=ETH&quote=BTC?from=1111&to=1112
```

To get all pairs where base is ETH:
```bash
http://149.102.136.233:7771/orderbook-history?base=ETH?from=1111&to=1112
```
http://149.102.136.233:7771/orderbook-history?base=ETH&quote=BTC?from=1111&to=1112
```
Example of the orderbooksHistory data structure:
```json
[
 {
  "timestamp": 1111,
  "orderbooks": {
   "ETH/BTC/binance": {
    "baseId": "ETH",
    "quoteId": "BTC",
    "exchangeId": "binance",
    "asks": "Asks[]",
    "bids": "Bids[]"
   },
   "ETH/BTC/okex": {
    "baseId": "ETH",
    "quoteId": "BTC",
    "exchangeId": "binance",
    "asks": "Asks[]",
    "bids": "Bids[]"
   }
  }
]
```
 },
 {
  timestamp: 1112,
  ...
 }
]
```bash

