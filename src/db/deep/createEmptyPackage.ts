import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { TypesStore } from "./typesStore";
import debug from "debug";
const log = debug("create-empty-package");

export const createEmptyPackage = async ({deep, Types, packageName, packageVersion}: {
  deep: DeepClient,
  packageName: string,
  packageVersion: string,
  Types: TypesStore,
}) => {
  const {
    PackageNamespaceId,
    PackageVersionId,
    PackageActiveId,
    PackageId,
    ContainId,
    JoinId,
  } = Types;
  console.log({packageName, packageVersion, PackageId, ContainId, JoinId});

  const npmPackagerId = await deep.id('@deep-foundation/npm-packager');

  // package
  const { data: [{ id: packageId }] } = await deep.insert({
    type_id: PackageId,
    string: { data: { value: packageName } },
    in: { data: [
      {
        type_id: ContainId,
        from_id: deep.linkId,
      },
      {
        type_id: ContainId,
        from_id: npmPackagerId,
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
    string: { data: { value: packageName } },
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
        string: { data: { value: packageVersion } },
      },
      {
        type_id: PackageActiveId,
        to_id: packageId,
      },
    ] },
  });
  console.log({packageNamespaceId});
  return {packageId, packageNamespaceId};
}