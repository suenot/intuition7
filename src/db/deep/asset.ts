import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("asset");

export const createAsset = async (
  {deep, PackageId, ContainId, JoinId, SymbolId, TypeId, StringId, ValueId}:
  {
    deep: DeepClient,
    PackageId: number,
    ContainId: number,
    JoinId: number,
    SymbolId: number,
    TypeId: number,
    StringId: number,
    ValueId: number
  }) => {
  
  // package
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: `@suenot/asset` } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: deep.linkId,
      },
    ] },
    out: { data: [
      {
        type_id: JoinId,
        to_id: await deep.id('deep', 'users', 'packages'),
      },
      {
        type_id: JoinId,
        to_id: await deep.id('deep', 'admin'),
      },
    ] },
  });
  log({packageId});

  // Asset
  const { data: [{ id: AssetId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Asset' } },
      },
    ] },
    out: { data: [
    ] },
  });
  log({AssetId});

  // SymbolId (петличка от Asset к Asset)
  const { data: [{ id: symbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '💎' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'symbol' } },
      },
    ] },
    from_id: AssetId,
    to_id: AssetId,
  });
  log({symbolId});

  // Name
  const { data: [{ id: NameId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Name' } },
      },
    ] },
    from_id: AssetId,
    to_id: AssetId,
  });
  log({NameId});

  // nameSymbol (петличка от Name к Name)
  const { data: [{ id: nameSymbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '🔤' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'nameSymbol' } },
      },
    ] },
    from_id: NameId,
    to_id: NameId,
  });
  log({nameSymbolId});

  // nameValue
  const { data: [{ id: nameValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'nameValue' } },
      },
    ] },
    from_id: NameId,
    to_id: StringId,
  });
  log({nameValueId});

  // Ticker
  const { data: [{ id: TickerId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Ticker' } },
      },
    ] },
    from_id: AssetId,
    to_id: AssetId,
  });
  log({TickerId});

  // tickerSymbol
  const { data: [{ id: tickerSymbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '📛' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'tickerSymbol' } },
      },
    ] },
    from_id: TickerId,
    to_id: TickerId,
  });
  log({tickerSymbolId});

  // tickerValue
  const { data: [{ id: tickerValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'tickerValue' } },
      },
    ] },
    from_id: TickerId,
    to_id: StringId,
  });
  log({tickerValueId});

  return {packageId, AssetId, symbolId, NameId, nameSymbolId, TickerId, tickerSymbolId};
};