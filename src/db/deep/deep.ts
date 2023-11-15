import _ from 'lodash';
import 'dotenv/config';
import latestVersion from 'latest-version';
import { incrementPatchVersion } from './incrementPatchVersion';

import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";
import { createProfitmaker } from "./profitmaker";
import { createUnit } from "./unit";
import { createUnitUi }from "./unit-ui";
import { createWallet } from "./wallet";
import { createWalletUi } from "./wallet-ui";
import { createPortfolio } from './portfolio';
import { createPortfolioUi } from './portfolio-ui';
import { createTransaction } from './transaction';
import { createEmission } from './emission';
import { createTransactionTests } from './transaction-tests';
import { createEmissionTests } from './emission-tests';
import { createPortfolioTests } from './portfolio-tests';
import { createPair } from './pair';
import { createExchange } from './exchange';
import { createInstrument } from './instrument';
import { removePackage } from "./removePackage";
import { createEmptyPackage } from './createEmptyPackage';
import { publishPackage } from './publishPackage';
import { TypesStore, createTypesStore } from "./typesStore";

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
  const Types: any = await createTypesStore({deep});
  console.log('end initStore');

  const packages: any[] = [
    {
      name: '@suenot/profitmaker',
      versionUpdate: false,
      createFn: createProfitmaker,
      path: './profitmaker',
    },
    {
      name: '@suenot/unit',
      versionUpdate: false,
      createFn: createUnit,
      path: './unit',
    },
    {
      name: '@suenot/unit-ui',
      versionUpdate: false,
      createFn: createUnitUi,
      path: './unit-ui',
    },
    {
      name: '@suenot/wallet',
      versionUpdate: false,
      createFn: createWallet,
      path: './wallet',
    },
    {
      name: '@suenot/wallet-ui',
      versionUpdate: false,
      createFn: createWalletUi,
      path: './wallet-ui',
    },
    {
      name: '@suenot/portfolio',
      versionUpdate: false,
      createFn: createPortfolio,
      path: './portfolio',
    },
    {
      name: '@suenot/portfolio-ui',
      versionUpdate: false,
      createFn: createPortfolioUi,
      path: './portfolio-ui',
    },
    {
      name: '@suenot/transaction',
      versionUpdate: false,
      createFn: createTransaction,
      path: './transaction',
    },
    {
      name: '@suenot/emission',
      versionUpdate: false,
      createFn: createEmission,
      path: './emission',
    },
    {
      name: '@suenot/transaction-tests',
      versionUpdate: false,
      createFn: createTransactionTests,
      path: './transaction-tests',
    },
    {
      name: '@suenot/emission-tests',
      versionUpdate: false,
      createFn: createEmissionTests,
      path: './emission-tests',
    },
    {
      name: '@suenot/portfolio-tests',
      versionUpdate: false,
      createFn: createPortfolioTests,
      path: './portfolio-tests',
    },
    {
      name: '@suenot/pair',
      versionUpdate: false,
      createFn: createPair,
      path: './pair',
    },
    {
      name: '@suenot/exchange',
      versionUpdate: false,
      createFn: createExchange,
      path: './exchange',
    },
    {
      name: '@suenot/instrument',
      versionUpdate: true,
      createFn: createInstrument,
      path: './instrument',
    },
  ]

  for (const deepPackage of packages) {
    // remove old package
    const resultRemovePackage = await removePackage({ deep, packageName: deepPackage.name });
    console.log({deepPackage, resultRemovePackage})

    // insert new package
    const packageName = deepPackage.name;
    var lastPackageVersion = '0.0.1';
    try {
      lastPackageVersion = await latestVersion(packageName);
    } catch (error) {}
    const packageVersion = deepPackage.versionUpdate ? incrementPatchVersion(lastPackageVersion) : lastPackageVersion;
    const {packageId, packageNamespaceId} = await createEmptyPackage({deep, Types, packageName, packageVersion});
    console.log(packageId, packageNamespaceId);
    // если успешно, то создавай типы для пакета
    deepPackage.createFn({deep, Types, packageName, packageId});
    // если успешно, то публикуй пакет
    if (deepPackage.versionUpdate) {
      const {publishId} = await publishPackage({deep, Types, packageName, packageId});
      console.log({publishId});
    }
  }
}
f();