describe('candlesToCandles', () => {
  it('should update or create a new 1-minute candle', async () => {
    for (const demoTick of demoTicks) {
      const tick: Trade[] = demoTick;
      const candle = tradesToCandle(tick, 'tick');
      upsertCandle(candle);
      // console.log({clusterPoints: candle.clusterPoints});
      console.log({candle});
      await sleep(1000);
    }
    expect(true).toBe(true);
  }, 60000);
