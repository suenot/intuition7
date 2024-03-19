import * as jspb from 'google-protobuf'



export class Pair extends jspb.Message {
  getId(): string;
  setId(value: string): Pair;

  getBaseid(): string;
  setBaseid(value: string): Pair;

  getQuoteid(): string;
  setQuoteid(value: string): Pair;

  getActive(): boolean;
  setActive(value: boolean): Pair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pair.AsObject;
  static toObject(includeInstance: boolean, msg: Pair): Pair.AsObject;
  static serializeBinaryToWriter(message: Pair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pair;
  static deserializeBinaryFromReader(message: Pair, reader: jspb.BinaryReader): Pair;
}

export namespace Pair {
  export type AsObject = {
    id: string,
    baseid: string,
    quoteid: string,
    active: boolean,
  }
}

