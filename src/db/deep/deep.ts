import _ from 'lodash';
import 'dotenv/config';
import latestVersion from 'latest-version';
import { incrementPatchVersion } from './incrementPatchVersion';

import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";
// import { createProfitmaker } from "./profitmaker";
import { createUnit } from "./unit";
import { createUnitUi }from "./unit-ui";
// import { createUnitUiEn } from './unit-ui-en';
// import { createUnitUiRu } from './unit-ui-ru';
import { createWallet } from "./wallet";
import { createWalletUi } from "./wallet-ui";
import { createPortfolio } from './portfolio';
import { createPortfolioUi } from './portfolio-ui';
// import { createTransaction } from './transaction';
// import { createTransactionUi } from './transaction-ui';
// import { createEmission } from './emission';
// import { createEmissionUi } from './emission-ui';
// import { createTransactionTests } from './transaction-tests';
// import { createEmissionTests } from './emission-tests';
import { createPortfolioTests } from './portfolio-tests';
import { createPair } from './pair';
import { createExchange } from './exchange';
import { createInstrument } from './instrument';
import { createLanguage } from './language';
import { createLocale } from './locale';
import { createName } from './name';
import { createDescription } from './description';
import { createTicker } from './ticker';
import { createAvatar } from './avatar';
import { createPaymentUi } from './payment-ui';
import { createPaymentTests } from './payment-tests';
import { createPaymentsSymbols } from './payments-symbols';
import { createAvatarEditUi } from './avatar-edit-ui';
import { createLocaleEditUi } from './locale-edit-ui';

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
      name: '@suenot/payments-symbols',
      versionUpdate: false,
      upload: true,
      createFn: createPaymentsSymbols,
      path: './payments-symbols',
    },
    {
      name: '@suenot/name',
      versionUpdate: false,
      upload: true,
      createFn: createName,
      path: './name',
    },
    {
      name: '@suenot/description',
      versionUpdate: false,
      upload: true,
      createFn: createDescription,
      path: './description',
    },
    {
      name: '@suenot/ticker',
      versionUpdate: false,
      upload: true,
      createFn: createTicker,
      path: './name',
    },
    {
      name: '@suenot/avatar',
      versionUpdate: false,
      upload: true,
      createFn: createAvatar,
      path: './avatar',
    },
    {
      name: '@suenot/unit',
      versionUpdate: false,
      upload: true,
      createFn: createUnit,
      path: './unit',
    },
    {
      name: '@suenot/wallet',
      versionUpdate: false,
      upload: true,
      createFn: createWallet,
      path: './wallet',
    },
    {
      name: '@suenot/unit-ui',
      versionUpdate: false,
      upload: true,
      createFn: createUnitUi,
      path: './unit-ui',
    },
    {
      name: '@suenot/wallet-ui',
      versionUpdate: false,
      upload: true,
      createFn: createWalletUi,
      path: './wallet-ui',
    },
    {
      name: '@suenot/payment-ui',
      versionUpdate: false,
      upload: true,
      createFn: createPaymentUi,
      path: './payment-ui',
    },
    {
      name: '@suenot/payment-tests',
      versionUpdate: false,
      upload: true,
      createFn: createPaymentTests,
      path: './payment-tests',
    },
    // {
    //   name: '@suenot/profitmaker',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createProfitmaker,
    //   path: './profitmaker',
    // },
    // {
    //   name: '@suenot/language',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createLanguage,
    //   path: './language',
    // },
    // {
    //   name: '@suenot/locale',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createLocale,
    //   path: './locale',
    // },
    // {
    //   name: '@suenot/portfolio',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createPortfolio,
    //   path: './portfolio',
    // },
    // {
    //   name: '@suenot/portfolio-ui',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createPortfolioUi,
    //   path: './portfolio-ui',
    // },
    // {
    //   name: '@suenot/transaction',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createTransaction,
    //   path: './transaction',
    // },
    // {
    //   name: '@suenot/transaction-ui',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createTransactionUi,
    //   path: './transaction-ui',
    // },
    // {
    //   name: '@suenot/emission',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createEmission,
    //   path: './emission',
    // },
    // {
    //   name: '@suenot/emission-ui',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createEmissionUi,
    //   path: './emission-ui',
    // },
    // {
    //   name: '@suenot/transaction-tests',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createTransactionTests,
    //   path: './transaction-tests',
    // },
    // {
    //   name: '@suenot/emission-tests',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createEmissionTests,
    //   path: './emission-tests',
    // },
    // {
    //   name: '@suenot/portfolio-tests',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createPortfolioTests,
    //   path: './portfolio-tests',
    // },
    // {
    //   name: '@suenot/pair',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createPair,
    //   path: './pair',
    // },
    // {
    //   name: '@suenot/exchange',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createExchange,
    //   path: './exchange',
    // },
    // {
    //   name: '@suenot/instrument',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createInstrument,
    //   path: './instrument',
    // },
    // где-то здесь ошибка (так как идет связь от пакета до synctextfile)
    // {
    //   name: '@suenot/unit-ui-ru',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createUnitUiRu,
    //   path: './unit-ui-ru',
    // },
    // {
    //   name: '@suenot/unit-ui-en',
    //   versionUpdate: false,
    //   upload: true,
    //   createFn: createUnitUiEn,
    //   path: './unit-ui-en',
    // },
  ]

  for (const deepPackage of packages) {
    // remove old package
    const resultRemovePackage = await removePackage({ deep, packageName: deepPackage.name });
    log({deepPackage, resultRemovePackage})
  }

  for (const deepPackage of packages) {
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
    await deepPackage.createFn({deep, Types, packageName, packageId});
    // TODO: если успешно, то публикуй пакет
    // log('Publishing package 🚀', {packageName, packageId});
    // if (deepPackage.versionUpdate) {
    //   const {publishId} = await publishPackage({deep, Types, packageName, packageId});
    //   log({publishId});
    // }
  }
}
f();