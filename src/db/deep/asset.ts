import latestVersion from 'latest-version';
import { incrementPatchVersion } from './incrementPatchVersion';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("asset");

const PACKAGE_NAME = '@suenot/asset';
const PACKAGE_VERSION = incrementPatchVersion(await latestVersion(PACKAGE_NAME));


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
  console.log({PACKAGE_NAME, PACKAGE_VERSION});
  
  const PackageNamespaceId = await deep.id('@deep-foundation/core', 'PackageNamespace');
  const PackageVersionId = await deep.id('@deep-foundation/core', 'PackageVersion');
  const PackageActiveId = await deep.id('@deep-foundation/core', 'PackageActive');
  const PublishId = await deep.id('@deep-foundation/npm-packager', 'Publish');
  const PackageQueryId = await deep.id('@deep-foundation/core', 'PackageQuery');

  // package
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: PACKAGE_NAME } },
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

  // package namespace
  const { data: [{ id: packageNamespaceId }] } = await deep.insert({
    type_id: PackageNamespaceId,
    string: { data: { value: PACKAGE_NAME } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: deep.linkId,
      },
    ] },
    out: { data: [
      {
        type_id: ContainId,
        to_id: packageId,
      },
      {
        type_id: PackageVersionId,
        to_id: packageId,
        string: { data: { value: PACKAGE_VERSION } },
      },
      {
        type_id: PackageActiveId,
        to_id: packageId,
      },
    ] },
  });
  console.log({packageNamespaceId});

  // publish
  const { data: [{ id: publishId }] } = await deep.insert({
    type_id: PublishId,
    from_id: packageId,
    to: {
      type_id: PackageQueryId,
      string: { data: { value: PACKAGE_NAME } },
    },
    in: { data: [
      {
        type_id: ContainId,
        from_id: deep.linkId,
      },
    ] },
  });
  console.log({publishId});

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

  // Avatar
  const { data: [{ id: AvatarId }] } = await deep.insert({
    type_id: TypeId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'Avatar' } },
      },
    ] },
    from_id: AssetId,
    to_id: AssetId,
  });
  log({AvatarId});

  // avatarSymbol
  const { data: [{ id: avatarSymbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '🖼️' } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'avatarSymbol' } },
      },
    ] },
    from_id: AvatarId,
    to_id: AvatarId,
  });
  log({avatarSymbolId});

  // avatarValue
  const { data: [{ id: avatarValueId }] } = await deep.insert({
    type_id: ValueId,
    in: { data: [
      {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: 'avatarValue' } },
      },
    ] },
    from_id: AvatarId,
    to_id: StringId,
  });
  log({avatarValueId});

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
    from_id: AssetId,
    to_id: AssetId,
  });
  log({DescriptionId});

  // descriptionSymbol
  const { data: [{ id: descriptionSymbolId }] } = await deep.insert({
    type_id: SymbolId,
    string: { data: { value: '✍️' } },
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

  return { packageId, AssetId, symbolId, NameId, nameSymbolId, TickerId, tickerSymbolId, AvatarId, avatarSymbolId, avatarValueId, DescriptionId, descriptionSymbolId, descriptionValueId };
};