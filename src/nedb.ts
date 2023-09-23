import Datastore from 'nedb';

export const initNedb = () => {
  // Create a new datastore for exchanges
  const exchanges = new Datastore({ filename: 'exchanges.db', autoload: true });

  // Create a new datastore for instruments
  const instruments = new Datastore({ filename: 'instruments.db', autoload: true });

  // Insert an exchange into the exchanges datastore
  exchanges.insert({ name: 'Binance', enabled: true }, function (err, newDoc) {
    if (err) console.log(err);
  });

  // Insert an instrument into the instruments datastore
  instruments.insert({ exchange: 'Binance', pair: 'BTC/USDT', enabled: true }, function (err, newDoc) {
    if (err) console.log(err);
  });
};