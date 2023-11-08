import _ from 'lodash';
import 'dotenv/config';

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
import { removePackage } from "./remove-package";

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
const deep = new DeepClient({ deep: guestDeep, ...admin });

const delay = (time = 1000) => new Promise(res => setTimeout(res, time));

const f = async () => {
  const UserId = await deep.id('@deep-foundation/core', 'User');
  const TypeId = await deep.id('@deep-foundation/core', 'Type');
  const AnyId = await deep.id('@deep-foundation/core', 'Any');
  const JoinId = await deep.id('@deep-foundation/core', 'Join');
  const ContainId = await deep.id('@deep-foundation/core', 'Contain');
  const ValueId = await deep.id('@deep-foundation/core', 'Value');
  const StringId = await deep.id('@deep-foundation/core', 'String');
  const NumberId = await deep.id('@deep-foundation/core', 'Number');
  const PackageId = await deep.id('@deep-foundation/core', 'Package');
  const SymbolId = await deep.id('@deep-foundation/core', 'Symbol');

  const SyncTextFileId = await deep.id('@deep-foundation/core', 'SyncTextFile');
  const dockerSupportsJsId = await deep.id('@deep-foundation/core', 'dockerSupportsJs');
  const dockerSupportsBunJsId = await deep.id('@archer-lotos/bun-js-docker-isolation-provider', 'dockerSupportsBunJs');
  const HandlerId = await deep.id('@deep-foundation/core', 'Handler');
  const HandleInsertId = await deep.id('@deep-foundation/core', 'HandleInsert');
  const HandleDeleteId = await deep.id('@deep-foundation/core', 'HandleDelete');

  const TreeId = await deep.id('@deep-foundation/core', 'Tree');
  const TreeIncludeNodeId = await deep.id('@deep-foundation/core', 'TreeIncludeNode');
  const TreeIncludeUpId = await deep.id('@deep-foundation/core', 'TreeIncludeUp');
  const TreeIncludeFromCurrentId = await deep.id('@deep-foundation/core', 'TreeIncludeFromCurrent');

  const RuleId = await deep.id('@deep-foundation/core', 'Rule');
  const RuleSubjectId = await deep.id('@deep-foundation/core', 'RuleSubject');
  const RuleObjectId = await deep.id('@deep-foundation/core', 'RuleObject');
  const RuleActionId = await deep.id('@deep-foundation/core', 'RuleAction');
  const SelectorId = await deep.id('@deep-foundation/core', 'Selector');
  const SelectorIncludeId = await deep.id('@deep-foundation/core', 'SelectorInclude');
  const SelectorExcludeId = await deep.id('@deep-foundation/core', 'SelectorExclude');
  const SelectorTreeId = await deep.id('@deep-foundation/core', 'SelectorTree');
  const containTreeId = await deep.id('@deep-foundation/core', 'containTree');
  const AllowInsertTypeId = await deep.id('@deep-foundation/core', 'AllowInsertType');
  const AllowDeleteTypeId = await deep.id('@deep-foundation/core', 'AllowDeleteType');
  const SelectorFilterId = await deep.id('@deep-foundation/core', 'SelectorFilter');
  const QueryId = await deep.id('@deep-foundation/core', 'Query');
  const TsxId = await deep.id('@deep-foundation/tsx', 'TSX');
  const HandleClientId = await deep.id('@deep-foundation/core', 'HandleClient');
  const clientSupportsJsId = await deep.id('@deep-foundation/core', 'clientSupportsJs');
  // const AssetId = await deep.id('@suenot/portfolios', 'Asset');
  // const HandlerContainId = await deep.id('@deep-foundation/core', 'HandlerContain');
  const usersId = await deep.id('deep', 'users');

  // Удаляем пакеты для чистой разработки
  const resultRemoveProfitmaker = await removePackage({ deep, packageName: '@suenot/profitmaker' });
  console.log({resultRemoveProfitmaker})
  const resultRemoveAsset = await removePackage({ deep, packageName: '@suenot/asset' });
  console.log({resultRemoveAsset})
  const resultRemoveAssetUi = await removePackage({ deep, packageName: '@suenot/asset-ui' });
  console.log({resultRemoveAssetUi})
  const resultRemoveWallet = await removePackage({ deep, packageName: '@suenot/wallet' });
  console.log({resultRemoveWallet})
  const resultRemoveWalletUi = await removePackage({ deep, packageName: '@suenot/wallet-ui' });
  console.log({resultRemoveWalletUi})
  const resultRemovePortfolio = await removePackage({ deep, packageName: '@suenot/portfolio' });
  console.log({resultRemovePortfolio})
  const resultRemovePortfolioUi = await removePackage({ deep, packageName: '@suenot/portfolio-ui' });
  console.log({resultRemovePortfolioUi})
  const resultRemoveTransaction = await removePackage({ deep, packageName: '@suenot/transaction' });
  console.log({resultRemoveTransaction})
  const resultRemoveEmission = await removePackage({ deep, packageName: '@suenot/emission' });
  console.log({resultRemoveEmission});

  await delay(1000);

  // Создаем пакет profitmaker
  await createProfitmaker({ deep, PackageId, ContainId, JoinId });
  
  // Создаем пакет assets
  const resultCreateAsset = await createAsset({ deep, PackageId, ContainId, JoinId, SymbolId, TypeId, StringId, ValueId });
  console.log({resultCreateAsset})

  // Создаем пакет assets-ui
  const resultCreateAssetUi = await createAssetUi({ deep, PackageId, ContainId, JoinId, TsxId, HandleClientId, clientSupportsJsId, HandlerId });
  console.log({resultCreateAssetUi})

  // Создаем пакет wallets
  const resultCreateWallet = await createWallet({ deep, PackageId, ContainId, JoinId, SymbolId, TypeId, StringId, NumberId, ValueId });
  console.log({resultCreateWallet})

  // Создаем пакет wallets-ui
  const resultCreateWalletUi = await createWalletUi({ deep, PackageId, ContainId, JoinId, TsxId, HandleClientId, clientSupportsJsId, HandlerId });
  console.log({resultCreateWalletUi})

  // Создаем пакет portfolio
  const resultCreatePortfolio = await createPortfolio({ deep, PackageId, ContainId, JoinId, SymbolId, TypeId, StringId, NumberId, ValueId });
  console.log({resultCreatePortfolio})

  // Создаем пакет portfolio-ui
  const resultCreatePortfolioUi = await createPortfolioUi({ deep, PackageId, ContainId, JoinId, TsxId, HandleClientId, clientSupportsJsId, HandlerId });

  // Создаем пакет transaction (wallets required)
  const resultCreateTransaction = await createTransaction({deep, PackageId, ContainId, JoinId, SymbolId, TypeId, NumberId, StringId, ValueId, SyncTextFileId, HandlerId, HandleInsertId, dockerSupportsBunJsId});
  console.log({resultCreateTransaction})

  // Создаем пакет emission (assets and wallet required)
  const resultCreateEmission = await createEmission({deep, PackageId, ContainId, JoinId, SymbolId, TypeId, NumberId, StringId, ValueId, SyncTextFileId, HandlerId, HandleInsertId, dockerSupportsBunJsId});
  console.log({resultCreateEmission})

  // Создаем пакет transaction-tests
  const resultRemoveTransactionTests = await removePackage({ deep, packageName: '@suenot/transaction-tests' });
  console.log({resultRemoveTransactionTests})
  
  const resultCreateTransactionTests = await createTransactionTests({deep, PackageId, ContainId, JoinId, SymbolId, TypeId, NumberId, StringId, ValueId})
  console.log({resultCreateTransactionTests})

  // Создаем пакет emission-tests
  const resultRemoveEmissionTests = await removePackage({ deep, packageName: '@suenot/emission-tests' });
  console.log({resultRemoveEmissionTests})

  const resultCreateEmissionTests = await createEmissionTests({deep, PackageId, ContainId, JoinId, SymbolId, TypeId, NumberId, StringId, ValueId})
  console.log({resultCreateEmissionTests})

}
f();