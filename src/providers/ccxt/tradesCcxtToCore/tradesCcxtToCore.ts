import { Trade as CcxtTrade, TradeSubscription as CcxtTradeSubscription } from '../ccxtTypes';
// export interface CcxtTrade {
//   amount: number;                  // amount of base currency
//   datetime: string;                // ISO8601 datetime with milliseconds;
//   id: string;                      // string trade id
//   info: any;                        // the original decoded JSON as is
//   order?: string;                  // string order id or undefined/None/null
//   price: number;                   // float price in quote currency
//   timestamp: number;               // Unix timestamp in milliseconds
//   type?: string;                   // order type, 'market', 'limit', ... or undefined/None/null
//   side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
//   symbol: string;                  // symbol in CCXT format
//   takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
//   cost: number;                    // total cost (including fees), `price * amount`
//   fee?: Fee;
//   fees?: Fee[];
// }

import { Trade } from '../../../types';
// export interface Trade {
//   id: string,
//   price: number,
//   amount: number,
//   type?: string, // 'market', 'limit', ... or undefined/None/null
//   total: number,
//   timestamp: number,
//   info: any; // the original decoded JSON as is
//   order?: string; // string order id or undefined/None/null
//   side: 'buy' | 'sell' | string;            // direction of the trade, 'buy' or 'sell'
//   takerOrMaker?: 'taker' | 'maker' | string; // string, 'taker' or 'maker'
//   cost: number;  // total cost (including fees), `price * amount`
//   pairId: string; // symbol in CCXT format
//   instrumentId: string;
//   exchangeId: string;
//   fee?: Fee;
//   fees?: Fee[];
// }

export const tradeCcxtToCore = ({tradeCcxt, exchangeId}: {tradeCcxt: CcxtTrade, exchangeId: string}): Trade => {
  const pairId = tradeCcxt?.symbol;
  const baseId = pairId.split('/')[0];
  const quoteId = pairId.split('/')[1];
  const instrumentId = `${baseId}/${quoteId}/${exchangeId}`;

  // Convert CCXT trade data to the specified format
  return {
    id: tradeCcxt.id,
    price: tradeCcxt.price,
    amount: tradeCcxt.amount,
    type: tradeCcxt.type,
    total: tradeCcxt.price * tradeCcxt.amount,
    timestamp: tradeCcxt.timestamp,
    info: tradeCcxt.info,
    order: tradeCcxt.order,
    side: tradeCcxt.side,
    takerOrMaker: tradeCcxt.takerOrMaker,
    cost: tradeCcxt.cost,
    pairId,
    instrumentId,
    exchangeId,
    baseId,
    quoteId,
    fee: tradeCcxt.fee,
    fees: tradeCcxt.fees,
  };
}