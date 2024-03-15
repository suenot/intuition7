# Parsing
get_exchanges - Get list of exchanges
get_market_data - Get market data from ccxt and save in core format
parse_candles
parse_trades
parse_order_books

# Timeframe utils
get_next_timeframe
get_timefram_milliseconds

# Convert ccxt data to core format
trades_ccxt_to_core
order_books_ccxt_to_core

# Generating candles in core format
trades_to_candle
candles_to_candle

# Upsert data to db
upsert_candles
upsert_trades
upsert_order_books

# Utils
to_shift - Function for shifting elements in an array to ensure that the total number of elements in baseArray and newArray does not exceed the value of max. The old data is preserved.
calculate_lag - Calculate diff between two dates in seconds
sleep