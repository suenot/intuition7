// TODO: Need universal db interface for:
// MVP: NeDB and MongoDB
// In future: Clickhouse, Redis and custom db

import {Exchange, Instrument, Asset, Pair} from '../types';
import debug from "debug";
const log = debug("db");
