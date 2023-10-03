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

# Алгоритм
- есть функция работы парсеров, которая перезапускается, если меняется конфиг
  - получение ордербука в ccxt формате
  - перевод в стандартный формат
  - сохранение в store ордербука
  - сохранение в store истории ордербука

