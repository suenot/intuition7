import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("portfolio");

export const createPortfolio = async (
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
  
  // package
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: `@suenot/portfolio` } },
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

  // Portfolio
  const { data: [{ id: PortfolioId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Portfolio' } },
      },
    ] },
    out: { data: [
    ] },
  });
  log({PortfolioId});

  // portfolioValue
  const { data: [{ id: waletValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'portfolioValue' } },
      },
    ] },
    from_id: PortfolioId,
    to_id: NumberId,
  });
  log({waletValueId});

  // SymbolId (петличка от Portfolio к Portfolio)
  const { data: [{ id: symbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '💼' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'symbol' } },
      },
    ] },
    from_id: PortfolioId,
    to_id: PortfolioId,
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
    from_id: PortfolioId,
    to_id: PortfolioId,
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

  const WalletId = await deep.id('@suenot/wallet', 'Wallet');

  // ContainWallet
  const { data: [{ id: ContainWalletId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'ContainWallet' } },
      },
    ] },
    from_id: PortfolioId,
    to_id: WalletId,
  });
  log({ContainWalletId});

  return {packageId, PortfolioId, symbolId, NameId, nameSymbolId, ContainWalletId};
};