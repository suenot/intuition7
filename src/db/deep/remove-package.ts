import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("remove-package");

export const removePackage =  async ({deep, packageName}: {deep: DeepClient, packageName: string}) => {
  var packageId: number | undefined = undefined;
  var packageNamespaceId: number | undefined = undefined;
  var deletedLinks: any[] = [];
  do {

    try {
      packageId = await deep.id(packageName);
    } catch (error) {}

    try {
      const { data: [{ id: packageNamespaceId }] } = await deep.select({
        to_id: packageId,
        type_id: {
          _id: [
            '@deep-foundation/core', 'PackageNamespace'
          ]
        }
      });
      console.log({packageId, packageNamespaceId});

      const resultDelete = await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            to_id: packageNamespaceId,
          },
        },
      });
      console.log({resultDelete})
      deletedLinks = [...deletedLinks, ...resultDelete?.data]

    } catch (error) {}

    try {
      const { data: [{ id: containerLinkId }] } = await deep.select({
        to_id: packageId,
        type_id: {
          _id: [
            '@deep-foundation/core', 'Contain'
          ]
        }
      });
      console.log({packageId, containerLinkId});
      
      const resultDelete = await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            to_id: packageId,
          },
        },
      });
      console.log({resultDelete})
      deletedLinks = [...deletedLinks, ...resultDelete?.data]
    } catch (error) {
      packageId = undefined;
    }
    try {
      packageId = await deep.id(packageName);
    } catch (error) {}
  } while (packageId || packageNamespaceId)
  console.log({deletedLinks})
  return deletedLinks;
}