import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
import * as fs from "fs";
import * as path from 'path';
const log = debug("asset-ui");
const __dirname = path.resolve();

export const createAssetUi = async (
  {deep, PackageId, ContainId, JoinId, TsxId, HandleClientId, HandlerId, clientSupportsJsId}:
  {
    deep: DeepClient,
    PackageId: number,
    ContainId: number,
    JoinId: number,
    TsxId: number,
    HandleClientId: number,
    HandlerId: number,
    clientSupportsJsId: number
  }) => {
    console.log('createAssetUi')
  
  // package
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: `@suenot/asset-ui` } },
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

  
  // tsxId
  // const reservedIds = await deep.reserve(1);
  const { data: [{ id: tsxId }] } = await deep.insert({
    // id: reservedIds.pop(),
    type_id: TsxId,
    string: {
      data: {
        value: fs.readFileSync(path.join(__dirname, 'src', 'db', 'deep', 'asset-ui.tsx'), { encoding: 'utf-8' })
      },
    },
    in: {
      data: {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: "assetTsx" } },
      }
    }
  });
  log({tsxId});
  console.log({clientSupportsJsId});
  console.log({HandleClientId});
  console.log({HandlerId});
  const AssetId = await deep.id('@suenot/asset', 'Asset');
  console.log({AssetId});

  // handler
  const { data: [{ id: handlerId }] } = await deep.insert({
    type_id: HandlerId,
    in: {
      data: {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: "assetHandler" } },
      }
    },
    from_id: clientSupportsJsId,
    to_id: tsxId,
  });
  log({handlerId});

  // handleClient
  const { data: [{ id: handleClientId }] } = await deep.insert({
    type_id: HandleClientId,
    in: {
      data: {
        type_id: ContainId,
        from_id: packageId,
        string: { data: { value: "assetHandleClient" } },
      }
    },
    from_id: AssetId,
    to_id: handlerId,
  });
  log({handleClientId});

  return {packageId, tsxId, handlerId, handleClientId};
};