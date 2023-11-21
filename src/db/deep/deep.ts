import _ from 'lodash';
import 'dotenv/config';
import latestVersion from 'latest-version';
import { incrementPatchVersion } from './incrementPatchVersion';

import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";
import { createProfitmaker } from "./profitmaker";
import { createUnit } from "./unit";
import { createUnitUi }from "./unit-ui";
import { createUnitUiEn } from './unit-ui-en';
import { createUnitUiRu } from './unit-ui-ru';
import { createWallet } from "./wallet";
import { createWalletUi } from "./wallet-ui";
import { createPortfolio } from './portfolio';
import { createPortfolioUi } from './portfolio-ui';
import { createTransaction } from './transaction';
import { createTransactionUi } from './transaction-ui';
import { createEmission } from './emission';
import { createEmissionUi } from './emission-ui';
import { createTransactionTests } from './transaction-tests';
import { createEmissionTests } from './emission-tests';
import { createPortfolioTests } from './portfolio-tests';
import { createPair } from './pair';
import { createExchange } from './exchange';
import { createInstrument } from './instrument';
import { createLanguage } from './language';
import { createLocale } from './locale';
import { removePackage } from "./removePackage";
import { createEmptyPackage } from './createEmptyPackage';
import { publishPackage } from './publishPackage';
import { TypesStore, createTypesStore } from "./typesStore";

import debug from "debug";
const log = debug("deep");

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
  log('initStore');
  const Types: any = await createTypesStore({deep});
  log('end initStore');

  const packages: any[] = [
    {
      name: '@suenot/asset',
    },
    {
      name: '@suenot/asset-ui',
    },
    {
      name: '@suenot/profitmaker',
      versionUpdate: false,
      createFn: createProfitmaker,
      path: './profitmaker',
    },
    {
      name: '@suenot/language',
      versionUpdate: false,
      createFn: createLanguage,
      path: './language',
    },
    {
      name: '@suenot/locale',
      versionUpdate: false,
      createFn: createLocale,
      path: './locale',
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
      name: '@suenot/transaction-ui',
      versionUpdate: false,
      createFn: createTransactionUi,
      path: './transaction-ui',
    },
    {
      name: '@suenot/emission',
      versionUpdate: false,
      createFn: createEmission,
      path: './emission',
    },
    {
      name: '@suenot/emission-ui',
      versionUpdate: false,
      createFn: createEmissionUi,
      path: './emission-ui',
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
      versionUpdate: false,
      createFn: createInstrument,
      path: './instrument',
    },
    {
      name: '@suenot/unit-ui-en',
      versionUpdate: false,
      createFn: createUnitUiEn,
      path: './unit-ui-en',
    },
    {
      name: '@suenot/unit-ui-ru',
      versionUpdate: true,
      createFn: createUnitUiRu,
      path: './unit-ui-ru',
    },
  ]

  for (const deepPackage of packages) {
    // remove old package
    const resultRemovePackage = await removePackage({ deep, packageName: deepPackage.name });
    log({deepPackage, resultRemovePackage})

    // // insert new package
    const packageName = deepPackage.name;
    var lastPackageVersion = '0.0.1';
    try {
      lastPackageVersion = await latestVersion(packageName);
    } catch (error) {}
    log('Generating package version #️⃣');
    const packageVersion = deepPackage.versionUpdate ? incrementPatchVersion(lastPackageVersion) : lastPackageVersion;
    log(`Package ${packageName} version is #️⃣${packageVersion}`);
    log('Generating package 📦 and namespace 🎁');
    const {packageId, packageNamespaceId} = await createEmptyPackage({deep, Types, packageName, packageVersion});
    log(packageId, packageNamespaceId);
    // TODO: если успешно, то создавай типы для пакета
    log('Creating package types ⭐', {packageName, packageId, packageNamespaceId})
    deepPackage.createFn({deep, Types, packageName, packageId});
    // TODO: если успешно, то публикуй пакет
    // log('Publishing package 🚀', {packageName, packageId});
    // if (deepPackage.versionUpdate) {
    //   const {publishId} = await publishPackage({deep, Types, packageName, packageId});
    //   log({publishId});
    // }
  }
}
f();