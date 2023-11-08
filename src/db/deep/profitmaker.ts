import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("profitmaker");

export const createProfitmaker = async ({deep, PackageId, ContainId, JoinId}: {deep: DeepClient, PackageId: number, ContainId: number, JoinId: number}) => {
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: `@suenot/profitmaker` } },
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
  return packageId;
};