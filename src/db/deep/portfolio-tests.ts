import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { TypesStore } from "./typesStore";
import debug from "debug";
const log = debug("portfolio-tests");

export const createPortfolioTests = async (
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
    string: { data: { value: `@suenot/portfolio-tests` } },
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
  const UnitNameId = await deep.id('@suenot/unit', 'Name');
  const UnitTickerId = await deep.id('@suenot/unit', 'Ticker');
  const UnitAvatarId = await deep.id('@suenot/unit', 'Avatar');
  const UnitDescriptionId = await deep.id('@suenot/unit', 'Description');
  const WalletId = await deep.id('@suenot/wallet', 'Wallet');
  const ContainUnitId = await deep.id('@suenot/wallet', 'ContainUnit');
  const TransactionId = await deep.id('@suenot/transaction', 'Transaction');
  // END TODO

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

  console.log({UnitNameId});

  // Создаем unit1 name
  const { data: [{ id: unit1NameId }] } = await deep.insert({
    type_id: UnitNameId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'unit1NameId' } },
      },
    ] },
    from_id: unitId1,
    to_id: unitId1,
    string: { data: { value: 'Dogecoin' } },
  });
  console.log({unit1NameId});

  // Создаем unit1 ticker
  const { data: [{ id: unit1TickerId }] } = await deep.insert({
    type_id: UnitTickerId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'unit1TickerId' } },
      },
    ] },
    out: { data: [
    ] },
    from_id: unitId1,
    to_id: unitId1,
    string: { data: { value: 'DOGE' } },
  });
  console.log({unit1TickerId});

  // Создаем unit1 avatar
  const { data: [{ id: unit1AvatarId }] } = await deep.insert({
    type_id: UnitAvatarId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'unit1AvatarId' } },
      },
    ] },
    out: { data: [
    ] },
    from_id: unitId1,
    to_id: unitId1,
    string: { data: { value: 'https://w7.pngwing.com/pngs/305/230/png-transparent-shiba-inu-dogecoin-akita-cryptocurrency-bitcoin-mammal-cat-like-mammal-carnivoran-thumbnail.png' } },
  });
  console.log({unit1AvatarId});

    // Создаем unit1 description
    const { data: [{ id: unit1DescriptionId }] } = await deep.insert({
      type_id: UnitDescriptionId,
      in: { data: [
        {
          type_id: ContainId,
          from_id: packageId,
          string: { data: { value: 'unit1DescriptionId' } },
        },
      ] },
      out: { data: [
      ] },
      from_id: unitId1,
      to_id: unitId1,
      string: { data: { value: 'Dogecoin is a popular cryptocurrency that started as a playful meme in 2013. It features the Shiba Inu dog from the "Doge" internet meme as its console.logo. Despite its humorous origins, Dogecoin has gained a dedicated following and is used for tipping content creators, charitable donations, and as a digital currency for various online transactions. It distinguishes itself with a vibrant and welcoming community and relatively low transaction fees.' } },
    });
    console.log({unit1DescriptionId});

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
      {
        type_id: ContainUnitId,
        to_id: unitId1,
      }
    ] },
    number: { data: { value: 333 } },
  });
  console.log({walletId1});

  // Создаем wallet2
  const { data: [{ id: walletId2 }] } = await deep.insert({
    type_id: WalletId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'walletId2' } },
      },
    ] },
    out: { data: [
      {
        type_id: ContainUnitId,
        to_id: unitId1,
      }
    ] },
    number: { data: { value: 444 } },
  });
  console.log({walletId2});

  const PortfolioId = await deep.id('@suenot/portfolio', 'Portfolio');
  const ContainWalletId = await deep.id('@suenot/portfolio', 'ContainWallet');

  // Создаем portfolio1
  const { data: [{ id: portfolio1Id }] } = await deep.insert({
    type_id: PortfolioId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'portfolio1Id' } },
      },
    ] },
    out: { data: [
      {
        type_id: ContainWalletId,
        to_id: walletId1,
      },
      {
        type_id: ContainWalletId,
        to_id: walletId2,
      }
    ] },
  });
  console.log({portfolio1Id});

  return {packageId, unitId1, walletId1, walletId2, portfolio1Id};
};