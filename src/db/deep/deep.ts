import _ from 'lodash';
import 'dotenv/config';
import latestVersion from 'latest-version';
import { incrementPatchVersion } from './incrementPatchVersion';

import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";
import { createProfitmaker } from "./profitmaker";
import { createAsset } from "./asset";
import { createAssetUi } from "./asset-ui";
import { createWallet } from "./wallet";
import { createWalletUi } from "./wallet-ui";
import { createPortfolio } from './portfolio';
import { createPortfolioUi } from './portfolio-ui';
import { createTransaction } from './transaction';
import { createEmission } from './emission';
import { createTransactionTests } from './transaction-tests';
import { createEmissionTests } from './emission-tests';
import { createPortfolioTests } from './portfolio-tests';
import { removePackage } from "./remove-package";
import { createTypesStore } from "./types-store";

const apolloClient = generateApolloClient({
  path: process.env.PUBLIC_GQL_PATH,
  ssl: Boolean(process.env.PUBLIC_GQL_SSL),
  token: process.env.PRIVATE_GQL_TOKEN,
});
const unloginedDeep = new DeepClient({ apolloClient });
const guest = await unloginedDeep.guest();
const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
const admin = await guestDeep.login({
  linkId: await guestDeep.id('deep', 'admin'),
});
export const deep = new DeepClient({ deep: guestDeep, ...admin });

const f = async () => {
  console.log('initStore');
  const Types = await createTypesStore({deep});
  console.log('end initStore');

  const packages: any[] = [
    // {
    //   name: '@suenot/profitmaker',
    //   versionUpdate: false,
    //   createFn: createProfitmaker,
    //   path: './profitmaker',
    // },
    {
      name: '@suenot/asset',
      versionUpdate: false,
      createFn: createAsset,
      path: './asset',
    },
    // {
    //   name: '@suenot/asset-ui',
    //   versionUpdate: false,
    //   createFn: createAssetUi,
    //   path: './asset-ui',
    // },
    // {
    //   name: '@suenot/wallet',
    //   versionUpdate: false,
    //   createFn: createWallet,
    //   path: './wallet',
    // },
    // {
    //   name: '@suenot/wallet-ui',
    //   versionUpdate: false,
    //   createFn: createWalletUi,
    //   path: './wallet-ui',
    // },
    // {
    //   name: '@suenot/portfolio',
    //   versionUpdate: false,
    //   createFn: createPortfolio,
    //   path: './portfolio',
    // },
    // {
    //   name: '@suenot/portfolio-ui',
    //   versionUpdate: false,
    //   createFn: createPortfolioUi,
    //   path: './portfolio-ui',
    // },
    // {
    //   name: '@suenot/transaction',
    //   versionUpdate: false,
    //   createFn: createTransaction,
    //   path: './transaction',
    // },
    // {
    //   name: '@suenot/emission',
    //   versionUpdate: false,
    //   createFn: createEmission,
    //   path: './emission',
    // },
    // {
    //   name: '@suenot/transaction-tests',
    //   versionUpdate: true,
    //   createFn: createTransactionTests,
    //   path: './transaction-tests',
    // },
    // {
    //   name: '@suenot/emission-tests',
    //   versionUpdate: true,
    //   createFn: createEmissionTests,
    //   path: './emission-tests',
    // },
    // {
    //   name: '@suenot/portfolio-tests',
    //   versionUpdate: true,
    //   createFn: createPortfolioTests,
    //   path: './portfolio-tests',
    // },
  ]

  for (const deepPackage of packages) {
    // remove old package
    const resultRemovePackage = await removePackage({ deep, packageName: deepPackage.name });
    console.log({deepPackage, resultRemovePackage})

    // insert new package
    const packageName = deepPackage.name;
    var lastPackageVersion = '0.0.0';
    try {
      lastPackageVersion = await latestVersion(packageName);
    } catch (error) {}
    const packageVersion = deepPackage.versionUpdate ? incrementPatchVersion(lastPackageVersion) : lastPackageVersion;
    deepPackage.createFn({deep, Types, packageName, packageVersion});
  }
}
f();