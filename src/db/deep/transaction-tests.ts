import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("portfolio");

export const createTransactionTests = async (
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
    string: { data: { value: `@suenot/transaction-tests` } },
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
  const AssetId = await deep.id('@suenot/asset', 'Asset');
  const AssetNameId = await deep.id('@suenot/asset', 'Name');
  const AssetTickerId = await deep.id('@suenot/asset', 'Ticker');
  const AssetAvatarId = await deep.id('@suenot/asset', 'Avatar');
  const AssetDescriptionId = await deep.id('@suenot/asset', 'Description');
  const WalletId = await deep.id('@suenot/wallet', 'Wallet');
  const WalletNameId = await deep.id('@suenot/wallet', 'Name');
  const WalletDescriptionId = await deep.id('@suenot/wallet', 'Description');
  const WalletAvatarId = await deep.id('@suenot/wallet', 'Avatar');
  const ContainAssetId = await deep.id('@suenot/wallet', 'ContainAsset');
  const TransactionId = await deep.id('@suenot/transaction', 'Transaction');
  // END TODO

  // Создаем asset1
  const { data: [{ id: assetId1 }] } = await deep.insert({
    type_id: AssetId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'asset1' } },
      },
    ] },
    out: { data: [
    ] },
  });
  console.log({assetId1});

  console.log({AssetNameId});

  // Создаем asset1 name
  const { data: [{ id: asset1NameId }] } = await deep.insert({
    type_id: AssetNameId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'asset1Name' } },
      },
    ] },
    from_id: assetId1,
    to_id: assetId1,
    string: { data: { value: 'Dogecoin' } },
  });
  console.log({asset1NameId});

  // Создаем asset1 ticker
  const { data: [{ id: asset1TickerId }] } = await deep.insert({
    type_id: AssetTickerId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'asset1Ticker' } },
      },
    ] },
    out: { data: [
    ] },
    from_id: assetId1,
    to_id: assetId1,
    string: { data: { value: 'DOGE' } },
  });
  console.log({asset1TickerId});

  // Создаем asset1 avatar
  const { data: [{ id: asset1AvatarId }] } = await deep.insert({
    type_id: AssetAvatarId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'asset1Avatar' } },
      },
    ] },
    out: { data: [
    ] },
    from_id: assetId1,
    to_id: assetId1,
    string: { data: { value: 'https://w7.pngwing.com/pngs/305/230/png-transparent-shiba-inu-dogecoin-akita-cryptocurrency-bitcoin-mammal-cat-like-mammal-carnivoran-thumbnail.png' } },
  });
  console.log({asset1AvatarId});

    // Создаем asset1 description
    const { data: [{ id: asset1DescriptionId }] } = await deep.insert({
      type_id: AssetDescriptionId,
      in: { data: [
        {
          type_id: ContainId,
          from_id: packageId,
          string: { data: { value: 'asset1Description' } },
        },
      ] },
      out: { data: [
      ] },
      from_id: assetId1,
      to_id: assetId1,
      string: { data: { value: 'Dogecoin is a popular cryptocurrency that started as a playful meme in 2013. It features the Shiba Inu dog from the "Doge" internet meme as its console.logo. Despite its humorous origins, Dogecoin has gained a dedicated following and is used for tipping content creators, charitable donations, and as a digital currency for various online transactions. It distinguishes itself with a vibrant and welcoming community and relatively low transaction fees.' } },
    });
    console.log({asset1DescriptionId});

  // Создаем wallet1
  const { data: [{ id: walletId1 }] } = await deep.insert({
    type_id: WalletId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'wallet1' } },
      },
    ] },
    out: { data: [
      {
        type_id: ContainAssetId,
        to_id: assetId1,
      }
    ] },
    number: { data: { value: 333 } },
  });
  console.log({walletId1});

  // Создаем wallet1 name
  const { data: [{ id: wallet1NameId }] } = await deep.insert({
    type_id: WalletNameId,
    from_id: walletId1,
    to_id: walletId1,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'wallet1Name' } },
      },
    ] },
    string: { data: { value: "For cat's toys" } },
  });
  console.log({wallet1NameId});

  // Создаем wallet1 description
  const { data: [{ id: wallet1DescriptionId }] } = await deep.insert({
    type_id: WalletDescriptionId,
    from_id: walletId1,
    to_id: walletId1,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'wallet1Description' } },
      },
    ] },
    string: { data: { value: "Buying toys for cats is essential for their physical and mental well-being, and it enhances the quality of their life while fostering a closer connection with their human companions." } },
  });
  console.log({wallet1DescriptionId});

    // Создаем wallet1 avatar
    const { data: [{ id: wallet1AvatarId }] } = await deep.insert({
      type_id: WalletAvatarId,
      from_id: walletId1,
      to_id: walletId1,
      in: { data: [
        {
          type_id: ContainId,
          from_id: packageId,
          string: { data: { value: 'wallet1Avatar' } },
        },
      ] },
      string: { data: { value: "https://github.com/suenot/portfolio-icons/blob/main/cat.jpeg?raw=true" } },
    });
    console.log({wallet1AvatarId});

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
        type_id: ContainAssetId,
        to_id: assetId1,
      }
    ] },
    number: { data: { value: 444 } },
  });
  console.log({walletId2});
  

  // Создаем transaction1
  const { data: [{ id: transactionId1 }] } = await deep.insert({
    type_id: TransactionId,
    from_id: walletId1,
    to_id: walletId2,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'transactionId1' } },
      },
    ] },
    out: { data: [
    ] },
    number: { data: { value: 222.00000001 } },
  });
  console.log({transactionId1});

  return {packageId, assetId1, walletId1, walletId2, transactionId1};
};