import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("portfolio");

export const createEmissionTests = async (
  {deep, PackageId, ContainId, JoinId, SymbolId, TypeId, NumberId, StringId, ValueId}:
  {
    deep: DeepClient,
    PackageId: number,
    ContainId: number,
    JoinId: number,
    SymbolId: number,
    TypeId: number,
    StringId: number,
    NumberId: number,
    ValueId: number
  }) => {
  
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: `@suenot/emission-tests` } },
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
  console.log({packageId});

  // TODO: перенести в deep.ts
  const UnitId = await deep.id('@suenot/unit', 'Unit');
  const WalletId = await deep.id('@suenot/wallet', 'Wallet');
  const EmissionId = await deep.id('@suenot/emission', 'Emission');
  // TODO: END

  // Создаем unit1
  const { data: [{ id: unitId1 }] } = await deep.insert({
    type_id: UnitId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'unitId1' } },
      },
    ] },
    out: { data: [
    ] },
  });
  console.log({unitId1});

  // Создаем wallet1
  const { data: [{ id: walletId1 }] } = await deep.insert({
    type_id: WalletId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'walletId1' } },
      },
    ] },
    out: { data: [
    ] },
  });
  console.log({walletId1});

  // Создаем emission1
  const { data: [{ id: emissionId1 }] } = await deep.insert({
    type_id: EmissionId,
    from_id: unitId1,
    to_id: walletId1,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'emissionId1' } },
      },
    ] },
    number: { data: { value: 999.99 } },
  });
  console.log({emissionId1});

  return {packageId, unitId1, walletId1, emissionId1};
};