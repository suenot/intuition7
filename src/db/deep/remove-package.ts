import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import debug from "debug";
const log = debug("remove-package");

export const removePackage =  async ({deep, packageName}: {deep: DeepClient, packageName: string}) => {
  var packageId: number | undefined = undefined;
  var deletedLinks: any[] = [];
  do {
    try {
      packageId = await deep.id(packageName);
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
      packageId = await deep.id(packageName);
      console.log({resultDelete})
      deletedLinks = [...deletedLinks, ...resultDelete?.data]
    } catch (error) {
      packageId = undefined;
    }
  } while (packageId)
  console.log({deletedLinks})
  return deletedLinks;
}