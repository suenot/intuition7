# Intuition 7

## Development
To start the development server run:
```bash
bun dev:bun:debug
```

Open http://localhost:8080/ with your browser to see the result.

## Получение ордербука
http://localhost:7771/orderbook?base=ETH&quote=LTC&exchange=okex

## Получение истории ордербука
http://localhost:7771/orderbook-history?base=ETH&quote=LTC&exchange=okex

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

# Алгоритм
- есть функция работы парсеров, которая перезапускается, если меняется конфиг
  - получение ордербука в ccxt формате
  - перевод в стандартный формат
  - сохранение в store ордербука
  - сохранение в store истории ордербука

