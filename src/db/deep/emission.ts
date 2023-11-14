import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { TypesStore } from "./typesStore";
import debug from "debug";
import * as fs from "fs";
import * as path from 'path';
const __dirname = path.resolve();
const log = debug("emission");

export const createEmission = async ({deep, Types, packageName, packageId}: {
  deep: DeepClient,
  packageName: string,
  Types: TypesStore,
  packageId: number,
}) => {
  const {
    ContainId,
    SymbolId,
    TypeId,
    StringId,
    ValueId,
    NumberId,
    SyncTextFileId,
    HandlerId,
    HandleInsertId,
    dockerSupportsBunJsId,
  } = Types;
  console.log({ContainId, SymbolId, TypeId, StringId, ValueId, NumberId, SyncTextFileId, HandlerId, HandleInsertId, dockerSupportsBunJsId});

  const UnitId = await deep.id('@suenot/unit', 'Unit');
  const WalletId = await deep.id('@suenot/wallet', 'Wallet');

  // Emission
  const { data: [{ id: EmissionId }] } = await deep.insert({
    type_id: TypeId,
    // ASK: можно добавить, что она от Unit к Wallet, а так Any к Any
    // ASK: может эмиссия это просто один из видов транзакций? Но у нее свои хендлеры (она не снимает деньги с ассета, но эту логику можно объединить в одном insert handler)
    from_id: UnitId, // UnitId,
    to_id: WalletId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Emission' } },
      },
    ] },
    out: { data: [
    ] },
  });
  log({EmissionId});

  // emissionValue
  const { data: [{ id: emissionValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'emissionValue' } },
      },
    ] },
    from_id: EmissionId,
    to_id: NumberId,
  });
  log({emissionValueId});

  // SymbolId (петличка от Emission к Emission)
  const { data: [{ id: symbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '🖨️' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'symbol' } },
      },
    ] },
    from_id: EmissionId,
    to_id: EmissionId,
  });
  log({symbolId});

  // Description
  const { data: [{ id: DescriptionId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Description' } },
      },
    ] },
    from_id: EmissionId,
    to_id: EmissionId,
  });
  log({DescriptionId});

  // descriptionSymbol (петличка от Name к Name)
  const { data: [{ id: descriptionSymbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '🔤' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'descriptionSymbol' } },
      },
    ] },
    from_id: DescriptionId,
    to_id: DescriptionId,
  });
  log({descriptionSymbolId});

  // descriptionValue
  const { data: [{ id: descriptionValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'descriptionValue' } },
      },
    ] },
    from_id: DescriptionId,
    to_id: StringId,
  });
  log({descriptionValueId});

  // syncTextFile
  const { data: [{ id: syncTextFile }] } = await deep.insert({
    type_id: SyncTextFileId,
    string: { data: {
      value: fs.readFileSync(path.join(__dirname, 'src', 'db', 'deep', 'emission-insert-handler.ts'), { encoding: 'utf-8' })
    } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'emissionSyncTextFile' } },
      },
    ] },
  });
  log({syncTextFile});

  // handler
  const { data: [{ id: handlerId }] } = await deep.insert({
    type_id: HandlerId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'emissionHandler' } },
      },
    ] },
    from_id: dockerSupportsBunJsId,
    to_id: syncTextFile,
  });
  log({handlerId});

  // handleInsert
  const { data: [{ id: handleInsertId }] } = await deep.insert({
    type_id: HandleInsertId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'emissionHandleInsert' } },
      },
    ] },
    from_id: EmissionId,
    to_id: handlerId,
  });
  log({handleInsertId});


  return {packageId, EmissionId, emissionValueId, symbolId, DescriptionId, descriptionSymbolId, descriptionValueId, syncTextFile, handlerId, handleInsertId};
};

