import { Exchange, Instrument, Asset, Pair } from "../../types";
import debug from "debug";
const log = debug("mongo");

export const mongoInstances = {};

// Need upsert all keys except `active`
import { MongoClient } from "mongodb";
import { Exchange, Instrument, Asset, Pair } from "../../types";

export class MongoDB {
  private url: string;
  private user: string;
  private pass: string;
  private port: number;
  private dbName: string;
  private client: MongoClient;

  constructor(
    url: string,
    user: string,
    pass: string,
    port: number,
    dbName: string,
  ) {
    this.url = url;
    this.user = user;
    this.pass = pass;
    this.port = port;
    this.dbName = dbName;
  }

  async init() {
    this.client = new MongoClient(this.url, {
      auth: {
        user: this.user,
        password: this.pass,
      },
      useUnifiedTopology: true,
    });

    await this.client.connect();
    console.log("Connected to MongoDB server");
  }

  async upsertExchange(exchange: Exchange) {
    const db = this.client.db(this.dbName);
    const collection = db.collection("exchanges");
    await collection.updateOne(
      { _id: exchange._id },
      { $set: exchange },
      { upsert: true },
    );
  }

  async upsertAsset(asset: Asset) {
    const db = this.client.db(this.dbName);
    const collection = db.collection("assets");
    await collection.updateOne(
      { _id: asset._id },
      { $set: asset },
      { upsert: true },
    );
  }

  async upsertPair(pair: Pair) {
    const db = this.client.db(this.dbName);
    const collection = db.collection("pairs");
    await collection.updateOne(
      { _id: pair._id },
      { $set: pair },
      { upsert: true },
    );
  }

  async upsertInstrument(instrument: Instrument) {
    const db = this.client.db(this.dbName);
    const collection = db.collection("instruments");
    await collection.updateOne(
      { _id: instrument._id },
      { $set: instrument },
      { upsert: true },
    );
  }
}
