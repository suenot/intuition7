# Intuition 7

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:8080/ with your browser to see the result.

## Получение ордербука
http://localhost:7771/orderbook?base=ETH&quote=LTC&exchange=okex

## Получение истории ордербука
http://localhost:7771/orderbook-history?base=ETH&quote=LTC&exchange=okex

## Получение информации о биржах
http://localhost:7771/exchanges
http://localhost:7771/exchanges/binance
# Включить биржу
http://localhost:7771/exchanges/binance?active=true

## Получение информации о парах
http://localhost:7771/pairs

# Алгоритм
- есть функция работы парсеров, которая перезапускается, если меняется конфиг
  - получение ордербука в ccxt формате
  - перевод в стандартный формат
  - сохранение в store ордербука
  - сохранение в store истории ордербука

