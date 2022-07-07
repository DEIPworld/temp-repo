import config from './../config';
import types from './types.json';
import { ApiPromise } from '@polkadot/api/promise';
import { HttpProvider } from '@polkadot/rpc-provider';
import { TypeRegistry } from '@polkadot/types/create';
import { Metadata } from '@polkadot/types';
import { logInfo, logSuccess, logError, logJsonResult } from './../log';
import { keccakAsHex, randomAsHex } from '@polkadot/util-crypto';
import { 
  getFaucetSeedAccount, 
  genSeedAccount, 
  daoIdToSubstrateAddress, 
  getSubstrateMultiAddress, 
  getDefaultDomain, 
  waitAsync 
} from './../utils';
import {
  getAccountAsync,
  getProjectAsync,
  getProposalAsync,
  getFungibleTokenAsync,
  getFungibleTokenBalanceByOwnerAsync,
  getInvestmentOpportunityAsync,
  getContractAgreementAsync,
  sendTxAsync
} from './rpc';



async function setup() {
  const typesRegistry = new TypeRegistry();
  typesRegistry.register(types);

  const provider = new HttpProvider(config.DEIP_FULL_NODE_URL);

  const api = await ApiPromise.create({ provider, registry: typesRegistry });
  const [chain, nodeName, nodeVersion, rpcMetadata] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.rpc.state.getMetadata()
  ]);
  api.registry.setMetadata(new Metadata(typesRegistry, rpcMetadata));
  console.log(`Connected to DEIP Appchain node ${chain.toString()} using ${nodeName.toString()} v${nodeVersion.toString()}`);
  return api;
}


async function sendTxAndWaitAsync(rawTx, timeout = config.CHAIN_BLOCK_INTERVAL_MILLIS) {
  await sendTxAsync(rawTx);
  await waitAsync(timeout);
}


async function fundAddressFromFaucet(addrees, api) {
  const tx = api.tx.balances.transfer(addrees, config.FAUCET_ACCOUNT.fundingAmount);
  await tx.signAsync(getFaucetSeedAccount());
  await sendTxAndWaitAsync(tx.toHex());
}



async function run(api) {



  /**
   * Create Alice DAO actor
   */
  logInfo(`Creating Alice DAO ...`);
  const alice = genSeedAccount("alice");
  await fundAddressFromFaucet(alice.address, api);
  const aliceDaoId = randomAsHex(20);
  const aliceDaoAddress = daoIdToSubstrateAddress(aliceDaoId, api);
  const createAliceDaoOp = api.tx.deipDao.create(
    /* ID */ aliceDaoId,
    /* Authority */ {
      "signatories": [alice.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Alice DAO" }), 256)
  );
  const createAliceDaoTx = api.tx.utility.batchAll([
    createAliceDaoOp
  ]);
  await createAliceDaoTx.signAsync(alice);
  await sendTxAndWaitAsync(createAliceDaoTx.toHex());
  await fundAddressFromFaucet(aliceDaoAddress, api);
  const aliceDao = await getAccountAsync(aliceDaoId);
  logJsonResult(`Alice DAO created`, aliceDao);



  /**
   * Create Bob DAO actor
   */
  logInfo(`Creating Bob DAO ...`);
  const bob = genSeedAccount("bob");
  await fundAddressFromFaucet(bob.address, api);
  const bobDaoId = randomAsHex(20);
  const bobDaoAddress = daoIdToSubstrateAddress(bobDaoId, api);
  const createBobDaoOp = api.tx.deipDao.create(
    /* ID */ bobDaoId,
    /* Authority */ {
      "signatories": [bob.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Bob DAO" }), 256)
  );
  const createBobDaoTx = api.tx.utility.batchAll([
    createBobDaoOp
  ]);
  await createBobDaoTx.signAsync(bob);
  await sendTxAndWaitAsync(createBobDaoTx.toHex());
  await fundAddressFromFaucet(bobDaoAddress, api);
  const bobDao = await getAccountAsync(bobDaoId);
  logJsonResult(`Bob DAO created`, bobDao);



  /**
   * Create Charlie DAO actor
   */
  logInfo(`Creating Charlie DAO ...`);
  const charlie = genSeedAccount("charlie");
  await fundAddressFromFaucet(charlie.address, api);
  const charlieDaoId = randomAsHex(20);
  const charlieDaoAddress = daoIdToSubstrateAddress(charlieDaoId, api);
  const createCharlieDaoOp = api.tx.deipDao.create(
    /* ID */ charlieDaoId,
    /* Authority */ {
      "signatories": [charlie.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Charlie DAO" }), 256)
  );
  const createCharlieDaoTx = api.tx.utility.batchAll([
    createCharlieDaoOp
  ]);
  await createCharlieDaoTx.signAsync(charlie);
  await sendTxAndWaitAsync(createCharlieDaoTx.toHex());
  await fundAddressFromFaucet(charlieDaoAddress, api);
  const charlieDao = await getAccountAsync(charlieDaoId);
  logJsonResult(`Charlie DAO created`, charlieDao);



  /**
   * Create Dave DAO actor
   */
  logInfo(`Creating Dave DAO ...`);
  const dave = genSeedAccount("dave");
  await fundAddressFromFaucet(dave.address, api);
  const daveDaoId = randomAsHex(20);
  const daveDaoAddress = daoIdToSubstrateAddress(daveDaoId, api);
  const createDaveDaoOp = api.tx.deipDao.create(
    /* ID */ daveDaoId,
    /* Authority */ {
      "signatories": [dave.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Dave DAO" }), 256)
  );
  const createDaveDaoTx = api.tx.utility.batchAll([
    createDaveDaoOp
  ]);
  await createDaveDaoTx.signAsync(dave);
  await sendTxAndWaitAsync(createDaveDaoTx.toHex());
  await fundAddressFromFaucet(daveDaoAddress, api);
  const daveDao = await getAccountAsync(daveDaoId);
  logJsonResult(`Dave DAO created`, daveDao);



  /**
   * Create Eve DAO actor
   */
  logInfo(`Creating Eve DAO ...`);
  const eve = genSeedAccount("eve");
  await fundAddressFromFaucet(eve.address, api);
  const eveDaoId = randomAsHex(20);
  const eveDaoAddress = daoIdToSubstrateAddress(eveDaoId, api);
  const createEveDaoOp = api.tx.deipDao.create(
    /* ID */ eveDaoId,
    /* Authority */ {
      "signatories": [eve.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Eve DAO" }), 256)
  );
  const createEveDaoTx = api.tx.utility.batchAll([
    createEveDaoOp
  ]);
  await createEveDaoTx.signAsync(eve);
  await sendTxAndWaitAsync(createEveDaoTx.toHex());
  await fundAddressFromFaucet(eveDaoAddress, api);
  const eveDao = await getAccountAsync(eveDaoId);
  logJsonResult(`Eve DAO created`, eveDao);



  /**
   * Create Alice-Bob multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Alice-Bob multisig DAO ...`);
  const aliceBobDaoId = randomAsHex(20);
  const aliceBobDaoAddress = daoIdToSubstrateAddress(aliceBobDaoId, api);
  const createAliceBobDaoOp = api.tx.deipDao.create(
    /* ID */ aliceBobDaoId,
    /* Authority */ {
      "signatories": [aliceDaoAddress, bobDaoAddress],
      "threshold": 1
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Alice-Bob multisig DAO" }), 256)
  );

  const createAliceBobDaoTx = api.tx.utility.batchAll([
    api.tx.deipDao.onBehalf(aliceDaoId, api.tx.multisig.asMultiThreshold1([bobDaoAddress], createAliceBobDaoOp))
  ]);
  await createAliceBobDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createAliceBobDaoTx.toHex());
  await fundAddressFromFaucet(aliceBobDaoAddress, api);
  const aliceBobDao = await getAccountAsync(aliceBobDaoId);
  logJsonResult(`Alice-Bob multisig DAO created`, aliceBobDao);



  /**
   * Create Eve-Charlie multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Eve-Charlie multisig DAO ...`);
  const eveCharlieDaoId = randomAsHex(20);
  const eveCharlieDaoAddress = daoIdToSubstrateAddress(eveCharlieDaoId, api);
  const createEveCharlieDaoOp = api.tx.deipDao.create(
    /* ID */ eveCharlieDaoId,
    /* Authority */ {
      "signatories": [eveDaoAddress, charlieDaoAddress],
      "threshold": 1
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Eve-Charlie multisig DAO" }), 256)
  );

  const createEveCharlieDaoTx = api.tx.utility.batchAll([
    api.tx.deipDao.onBehalf(eveDaoId, api.tx.multisig.asMultiThreshold1([charlieDaoAddress], createEveCharlieDaoOp))
  ]);
  await createEveCharlieDaoTx.signAsync(eve); // 1st approval from Eve DAO (final)
  await sendTxAndWaitAsync(createEveCharlieDaoTx.toHex());
  await fundAddressFromFaucet(eveCharlieDaoAddress, api);
  const eveCharlieDao = await getAccountAsync(eveCharlieDaoId);
  logJsonResult(`Eve-Charlie multisig DAO created`, eveCharlieDao);



  /**
   * Create Bob-Dave multisig DAO actor with a threshold equal to 2 signatures
   */
  logInfo(`Creating Bob-Dave multisig DAO ...`);
  const bobDaveDaoId = randomAsHex(20);
  const bobDaveDaoAddress = daoIdToSubstrateAddress(bobDaveDaoId, api);
  const bobDaveMultiAddress = getSubstrateMultiAddress([bobDaoAddress, daveDaoAddress], 2);
  const createBobDaveDaoOp = api.tx.deipDao.create(
    /* ID */ bobDaveDaoId,
    /* Authority */ {
      "signatories": [bobDaoAddress, daveDaoAddress],
      "threshold": 2
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Bob-Dave multisig DAO" }), 256)
  );
  const { weight } = await createBobDaveDaoOp.paymentInfo(bobDaveMultiAddress);
  const createBobDaveDaoByBobTx = api.tx.utility.batchAll([
    api.tx.deipDao.onBehalf(bobDaoId, api.tx.multisig.approveAsMulti(2, [daveDaoAddress], null, createBobDaveDaoOp.method.hash, weight))
  ]);
  await createBobDaveDaoByBobTx.signAsync(bob); // 1st approval from Bob DAO
  await sendTxAndWaitAsync(createBobDaveDaoByBobTx.toHex());
  const multisigInfo1 = await api.query.multisig.multisigs(bobDaveMultiAddress, createBobDaveDaoOp.method.hash);
  const timepoint = multisigInfo1.isSome ? multisigInfo1.unwrap().when : null;
  const createBobDaveDaoByDaveTx = api.tx.utility.batchAll([
    api.tx.deipDao.onBehalf(daveDaoId, api.tx.multisig.asMulti(2, [bobDaoAddress], timepoint, createBobDaveDaoOp.method.toHex(), true, weight))
  ]);
  await createBobDaveDaoByDaveTx.signAsync(dave); // 2nd approval from Dave DAO (final)
  await sendTxAndWaitAsync(createBobDaveDaoByDaveTx.toHex());
  await fundAddressFromFaucet(bobDaveDaoAddress, api);
  const bobDaveDao = await getAccountAsync(bobDaveDaoId);
  logJsonResult(`Bob-Dave multisig DAO created`, bobDaveDao);



  /**
   * Create Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO ...`);
  const multigroup1DaoId = randomAsHex(20);
  const multigroup1DaoAddress = daoIdToSubstrateAddress(multigroup1DaoId, api);
  const createMultigroup1Op = api.tx.deipDao.create(
    /* ID */ multigroup1DaoId,
    /* Authority */ {
      "signatories": [eveCharlieDaoAddress, bobDaveDaoAddress],
      "threshold": 1
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Multigroup-1 multisig DAO" }), 256)
  );

  const createMultigroup1DaoByEveCharlieDaoOp = api.tx.deipDao.onBehalf(eveCharlieDaoId, api.tx.multisig.asMultiThreshold1([bobDaveDaoAddress], createMultigroup1Op));
  const createMultigroup1DaoByEveCharlieDaoByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId, api.tx.multisig.asMultiThreshold1([charlieDaoAddress], createMultigroup1DaoByEveCharlieDaoOp));
  const createMultigroup1DaoByEveCharlieDaoByEveDaoTx = api.tx.utility.batchAll([
    createMultigroup1DaoByEveCharlieDaoByEveDaoOp
  ]);
  await createMultigroup1DaoByEveCharlieDaoByEveDaoTx.signAsync(eve); // 1st approval from Eve DAO on behalf Eve-Charlie DAO (final)
  await sendTxAndWaitAsync(createMultigroup1DaoByEveCharlieDaoByEveDaoTx.toHex());
  await fundAddressFromFaucet(multigroup1DaoAddress, api);
  const multigroup1Dao = await getAccountAsync(multigroup1DaoId);
  logJsonResult(`Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO created`, multigroup1Dao);



  /**
   * Create Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO actor with a threshold equal to 2 signatures
   */
  logInfo(`Creating Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO ...`);
  const multigroup2DaoId = randomAsHex(20);
  const multigroup2DaoAddress = daoIdToSubstrateAddress(multigroup2DaoId, api);
  const multigroup2MultiAddress = getSubstrateMultiAddress([eveCharlieDaoAddress, bobDaveDaoAddress], 2);
  const createMultigroup2Op = api.tx.deipDao.create(
    /* ID */ multigroup2DaoId,
    /* Authority */ {
      "signatories": [eveCharlieDaoAddress, bobDaveDaoAddress],
      "threshold": 2
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Multigroup-2 multisig DAO" }), 256)
  );

  const { weight: weight2 } = await createMultigroup2Op.paymentInfo(multigroup2MultiAddress);
  const createMultigroup2DaoByEveCharlieDaoOp = api.tx.deipDao.onBehalf(
    eveCharlieDaoId,
    api.tx.multisig.approveAsMulti(2, [bobDaveDaoAddress], null, createMultigroup2Op.method.hash, weight2)
  );
  const createMultigroup2DaoByEveCharlieDaoByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId, api.tx.multisig.asMultiThreshold1([charlieDaoAddress], createMultigroup2DaoByEveCharlieDaoOp));
  const createMultigroup2DaoByEveCharlieDaoByEveDaoTx = api.tx.utility.batchAll([
    createMultigroup2DaoByEveCharlieDaoByEveDaoOp
  ]);
  await createMultigroup2DaoByEveCharlieDaoByEveDaoTx.signAsync(eve); // 1st approval from Eve DAO on behalf Eve-Charlie DAO
  await sendTxAndWaitAsync(createMultigroup2DaoByEveCharlieDaoByEveDaoTx.toHex());


  const multisigInfo2 = await api.query.multisig.multisigs(multigroup2MultiAddress, createMultigroup2Op.method.hash);
  const timepoint2 = multisigInfo2.isSome ? multisigInfo2.unwrap().when : null;
  const createMultigroup2DaoByBobDaveDaoOp = api.tx.deipDao.onBehalf(
    bobDaveDaoId,
    api.tx.multisig.asMulti(2, [eveCharlieDaoAddress], timepoint2, createMultigroup2Op.method.toHex(), true, weight2)
  );
  const { weight: weight3 } = await createMultigroup2DaoByBobDaveDaoOp.paymentInfo(bobDaveDaoAddress);
  const createMultigroup2DaoByBobDaveDaoByBobDaoOp = api.tx.deipDao.onBehalf(bobDaoId, api.tx.multisig.approveAsMulti(2, [daveDaoAddress], null, createMultigroup2DaoByBobDaveDaoOp.method.hash, weight3));
  const createMultigroup2DaoByBobDaveDaoByBobDaoTx = api.tx.utility.batchAll([
    createMultigroup2DaoByBobDaveDaoByBobDaoOp
  ]);
  await createMultigroup2DaoByBobDaveDaoByBobDaoTx.signAsync(bob); // 2nd approval from Bob DAO on behalf Bob-Dave DAO
  await sendTxAndWaitAsync(createMultigroup2DaoByBobDaveDaoByBobDaoTx.toHex());


  const multisigInfo3 = await api.query.multisig.multisigs(bobDaveMultiAddress, createMultigroup2DaoByBobDaveDaoOp.method.hash);
  const timepoint5 = multisigInfo3.isSome ? multisigInfo3.unwrap().when : null;
  const createMultigroup2DaoByBobDaveDaoByDaveDaoOp = api.tx.deipDao.onBehalf(daveDaoId, api.tx.multisig.asMulti(2, [bobDaoAddress], timepoint5, createMultigroup2DaoByBobDaveDaoOp.method.toHex(), true, weight3));
  const createMultigroup2DaoByBobDaveDaoByDaveDaoTx = api.tx.utility.batchAll([
    createMultigroup2DaoByBobDaveDaoByDaveDaoOp
  ]);
  await createMultigroup2DaoByBobDaveDaoByDaveDaoTx.signAsync(dave); // 3rd approval from Dave DAO on behalf Bob-Dave DAO (final)
  await sendTxAndWaitAsync(createMultigroup2DaoByBobDaveDaoByDaveDaoTx.toHex());

  await fundAddressFromFaucet(multigroup2DaoAddress, api);
  const multigroup2Dao = await getAccountAsync(multigroup2DaoId);
  logJsonResult(`Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO created`, multigroup2Dao);



  /**
   * Create Treasury DAO actor
   */
  logInfo(`Creating Treasury DAO ...`);
  const treasury = genSeedAccount("treasury");
  await fundAddressFromFaucet(treasury.address, api);
  const treasuryDaoId = randomAsHex(20);
  const treasuryDaoAddress = daoIdToSubstrateAddress(treasuryDaoId, api);
  const createTreasuryDaoOp = api.tx.deipDao.create(
    /* ID */ treasuryDaoId,
    /* Authority */ {
      "signatories": [treasury.address],
      "threshold": 0
    },
    /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Treasury DAO" }), 256)
  );
  const createTreasuryDaoTx = api.tx.utility.batchAll([
    createTreasuryDaoOp
  ]);
  await createTreasuryDaoTx.signAsync(treasury);
  await sendTxAndWaitAsync(createTreasuryDaoTx.toHex());
  await fundAddressFromFaucet(treasuryDaoAddress, api);
  const treasuryDao = await getAccountAsync(treasuryDaoId);
  logJsonResult(`Treasury DAO created`, treasuryDao);



  /**
   * Update Alice DAO actor
   */
  logInfo(`Updating Alice DAO ...`);
  const updateAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deipDao.updateDao(
      /* Metadata Hash */ keccakAsHex(JSON.stringify({ "description": "Updated Multigroup-2 multisig DAO" }), 256)
    )
  );
  const updateAliceDaoTx = api.tx.utility.batchAll([
    updateAliceDaoOp
  ]);
  await updateAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(updateAliceDaoTx.toHex());
  const updatedAliceDao = await getAccountAsync(aliceDaoId);
  logJsonResult(`Alice DAO updated`, updatedAliceDao);



  /**
   * Create Project on behalf of Alice DAO actor
   */
  logInfo(`Creating Alice DAO Project-1 ...`);
  const project1Id = randomAsHex(20);
  const createProject1ByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deip.createProject(
      /* "is_private": */ false,
      /* "external_id": */ project1Id,
      /* "team_id": */ { Dao: aliceDaoId },
      /* "description": */ keccakAsHex(JSON.stringify({ "description": "Alice DAO Project" }), 256),
      /* "domains": */[getDefaultDomain()]
    )
  );
  const createProject1ByAliceDaoTx = api.tx.utility.batchAll([
    createProject1ByAliceDaoOp
  ]);
  await createProject1ByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createProject1ByAliceDaoTx.toHex());
  const project1 = await getProjectAsync(project1Id);
  logJsonResult(`Alice DAO Project-1 created`, project1);



  /**
   * Update Alice DAO Project-1 on behalf of Alice DAO actor
   */
  logInfo(`Updating Alice DAO Project-1 ...`);
  const updateProject1ByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deip.updateProject(
      /* "project_id": */ project1Id,
      /* "description": */ keccakAsHex(JSON.stringify({ "description": "Updated Alice DAO Project" }), 256),
      /* "is_private": */ null
    )
  );
  const updateProject1ByAliceDaoTx = api.tx.utility.batchAll([
    updateProject1ByAliceDaoOp
  ]);
  await updateProject1ByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(updateProject1ByAliceDaoTx.toHex());
  const updatedProject1 = await getProjectAsync(project1Id);
  logJsonResult(`Alice DAO Project-1 updated`, updatedProject1);



  /**
   * Create Project on behalf of Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO actor
   */
  logInfo(`Creating Multigroup-2 DAO Project-2 ...`);
  const project2Id = randomAsHex(20);
  const createProject2ByMultigroup2Op = api.tx.deipDao.onBehalf(multigroup2DaoId, api.tx.deip.createProject(
    /* "is_private": */ false,
    /* "external_id": */ project2Id,
    /* "team_id": */ { Dao: multigroup2DaoId },
    /* "description": */ keccakAsHex(JSON.stringify({ "description": "Multigroup-2 DAO Project" }), 256),
    /* "domains": */[getDefaultDomain()]
  ));

  const { weight: weight5 } = await createProject2ByMultigroup2Op.paymentInfo(multigroup2MultiAddress);
  const createProject2ByMultigroup2ByEveCharlieDaoOp = api.tx.deipDao.onBehalf(eveCharlieDaoId, api.tx.multisig.approveAsMulti(2, [bobDaveDaoAddress], null, createProject2ByMultigroup2Op.method.hash, weight5));
  const createProject2ByMultigroup2ByEveCharlieDaoByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId, api.tx.multisig.asMultiThreshold1([charlieDaoAddress], createProject2ByMultigroup2ByEveCharlieDaoOp));
  const createProject2ByMultigroup2ByEveCharlieDaoByEveDaoTx = api.tx.utility.batchAll([
    createProject2ByMultigroup2ByEveCharlieDaoByEveDaoOp
  ]);
  await createProject2ByMultigroup2ByEveCharlieDaoByEveDaoTx.signAsync(eve); // 1st approval from Eve DAO on behalf Eve-Charlie DAO
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByEveCharlieDaoByEveDaoTx.toHex());


  const info6 = await api.query.multisig.multisigs(multigroup2MultiAddress, createProject2ByMultigroup2Op.method.hash);
  const timepoint6 = info6.isSome ? info6.unwrap().when : null;
  const createProject2ByMultigroup2ByBobDaveDaoOp = api.tx.deipDao.onBehalf(bobDaveDaoId, api.tx.multisig.asMulti(2, [eveCharlieDaoAddress], timepoint6, createProject2ByMultigroup2Op.method.toHex(), true, weight5));
  const { weight: weight7 } = await createProject2ByMultigroup2ByBobDaveDaoOp.paymentInfo(bobDaveDaoAddress);
  const createProject2ByMultigroup2ByBobDaveDaoByBobDaoOp = api.tx.deipDao.onBehalf(bobDaoId, api.tx.multisig.approveAsMulti(2, [daveDaoAddress], null, createProject2ByMultigroup2ByBobDaveDaoOp.method.hash, weight7));
  const createProject2ByMultigroup2ByBobDaveDaoByBobDaoTx = api.tx.utility.batchAll([
    createProject2ByMultigroup2ByBobDaveDaoByBobDaoOp
  ]);
  await createProject2ByMultigroup2ByBobDaveDaoByBobDaoTx.signAsync(bob); // 2nd approval from Bob DAO on behalf Bob-Dave DAO
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByBobDaveDaoByBobDaoTx.toHex());


  const info7 = await api.query.multisig.multisigs(bobDaveMultiAddress, createProject2ByMultigroup2ByBobDaveDaoOp.method.hash);
  const timepoint7 = info7.isSome ? info7.unwrap().when : null;
  const createProject2ByMultigroup2ByBobDaveDaoByDaveDaoOp = api.tx.deipDao.onBehalf(daveDaoId, api.tx.multisig.asMulti(2, [bobDaoAddress], timepoint7, createProject2ByMultigroup2ByBobDaveDaoOp.method.toHex(), true, weight7));
  const createProject2ByMultigroup2ByBobDaveDaoByDaveDaoTx = api.tx.utility.batchAll([
    createProject2ByMultigroup2ByBobDaveDaoByDaveDaoOp
  ]);
  await createProject2ByMultigroup2ByBobDaveDaoByDaveDaoTx.signAsync(dave); // 3rd approval from Dave DAO on behalf Bob-Dave DAO (final)
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByBobDaveDaoByDaveDaoTx.toHex());

  const multigroup2DaoProject = await getProjectAsync(project2Id);
  logJsonResult(`Multigroup-2 DAO Project-2 created`, multigroup2DaoProject);



  /**
   * Create Proposal-1 on behalf Eve-Charlie multisig Dao actor 
   * to propose Alice-Bob multisig Dao actor and Bob-Dave multisig Dao actor 
   * to start new projects with initial funding from Charlie Dao actor and Multigroup-1 multisig DAO actor
   */
  logInfo(`Creating Eve-Charlie DAO Proposal-1 ...`);
  const proposal1Id = randomAsHex(20);
  const project3Id = randomAsHex(20);
  const project4Id = randomAsHex(20);

  const createProposal1ByEveCharlieDaoOp = api.tx.deipDao.onBehalf(eveCharlieDaoId,
    api.tx.deipProposal.propose(
      [{
        call: api.tx.deip.createProject(
          /* "is_private": */ false,
          /* "external_id": */ project3Id,
          /* "team_id": */ { Dao: aliceBobDaoId },
          /* "description": */ keccakAsHex(JSON.stringify({ "description": "Alice-Bob DAO Project" }), 256),
          /* "domains": */[getDefaultDomain()]
        ),
        account: { Dao: aliceBobDaoId }
      },
      {
        call: api.tx.deip.createProject(
          /* "is_private": */ false,
          /* "external_id": */ project4Id,
          /* "team_id": */ { Dao: bobDaveDaoId },
          /* "description": */ keccakAsHex(JSON.stringify({ "description": "Bob-Dave DAO Project" }), 256),
          /* "domains": */[getDefaultDomain()]
        ),
        account: { Dao: bobDaveDaoId }
      },
      {
        call: api.tx.balances.transfer(
          /* "to": */ bobDaveDaoAddress,
          /* "amount": */ 1000000000
        ),
        account: { Dao: charlieDaoId }
      },
      {
        call: api.tx.balances.transfer(
          /* "to": */ aliceBobDaoAddress,
          /* "amount": */ 1000000000
        ),
        account: { Dao: multigroup1DaoId }
      }],
      proposal1Id
    ));

  const createProposal1ByEveCharlieDaoByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId,
    api.tx.multisig.asMultiThreshold1([charlieDaoAddress], createProposal1ByEveCharlieDaoOp)
  );
  const createProposal1ByEveCharlieDaoByEveDaoTx = api.tx.utility.batchAll([
    createProposal1ByEveCharlieDaoByEveDaoOp
  ]);
  await createProposal1ByEveCharlieDaoByEveDaoTx.signAsync(eve); // 1st approval from Eve-Charlie DAO on behalf Eve DAO (final)
  await sendTxAndWaitAsync(createProposal1ByEveCharlieDaoByEveDaoTx.toHex());
  const proposal1 = await getProposalAsync(proposal1Id);
  logJsonResult(`Eve-Charlie DAO Proposal-1 created`, proposal1);



  /**
   * Approve Proposal-1 created by Eve-Charlie multisig Dao actor on behalf all required actors: 
   * Alice-Bob multisig Dao actor
   * Bob-Dave multisig Dao actor
   * Charlie Dao actor
   * Multigroup-1 multisig Dao actor
   */

  logInfo(`Deciding on Eve-Charlie DAO Proposal-1 ...`);
  // Alice-Bob multisig Dao approves Proposal-1
  const decideOnProposal1ByAliceBobDaoOp = api.tx.deipDao.onBehalf(aliceBobDaoId,
    api.tx.deipProposal.decide(proposal1Id, 'Approve')
  );
  const decideOnProposal1ByAliceBobDaoByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.multisig.asMultiThreshold1([bobDaoAddress], decideOnProposal1ByAliceBobDaoOp)
  );
  const decideOnProposal1ByAliceBobDaoByAliceDaoTx = api.tx.utility.batchAll([
    decideOnProposal1ByAliceBobDaoByAliceDaoOp
  ]);
  await decideOnProposal1ByAliceBobDaoByAliceDaoTx.signAsync(alice); // 1st approval from Alice-Bob DAO on behalf Alice DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByAliceBobDaoByAliceDaoTx.toHex());


  // Bob-Dave multisig Dao approves Proposal-1
  const decideOnProposal1ByBobDaveDaoOp = api.tx.deipDao.onBehalf(bobDaveDaoId,
    api.tx.deipProposal.decide(proposal1Id, 'Approve')
  );
  const { weight: weight9 } = await decideOnProposal1ByBobDaveDaoOp.paymentInfo(bobDaveMultiAddress);
  const decideOnProposal1ByBobDaveDaoByBobDaoOp = api.tx.deipDao.onBehalf(bobDaoId, api.tx.multisig.approveAsMulti(2, [daveDaoAddress], null, decideOnProposal1ByBobDaveDaoOp.method.hash, weight9));
  const decideOnProposal1ByBobDaveDaoByBobDaoTx = api.tx.utility.batchAll([
    decideOnProposal1ByBobDaveDaoByBobDaoOp
  ]);
  await decideOnProposal1ByBobDaveDaoByBobDaoTx.signAsync(bob); // 1st approval from Bob-Dave DAO on behalf Bob DAO
  await sendTxAndWaitAsync(decideOnProposal1ByBobDaveDaoByBobDaoTx.toHex());

  const info9 = await api.query.multisig.multisigs(bobDaveMultiAddress, decideOnProposal1ByBobDaveDaoOp.method.hash);
  const timepoint9 = info9.isSome ? info9.unwrap().when : null;
  const decideOnProposal1ByBobDaveDaoByDaveDaoOp = api.tx.deipDao.onBehalf(daveDaoId, api.tx.multisig.asMulti(2, [bobDaoAddress], timepoint9, decideOnProposal1ByBobDaveDaoOp.method.toHex(), true, weight9));
  const decideOnProposal1ByBobDaveDaoByDaveDaoTx = api.tx.utility.batchAll([
    decideOnProposal1ByBobDaveDaoByDaveDaoOp
  ]);
  await decideOnProposal1ByBobDaveDaoByDaveDaoTx.signAsync(dave); // 2nd approval from Bob-Dave DAO on behalf Dave DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByBobDaveDaoByDaveDaoTx.toHex());


  // Charlie Dao approves Proposal-1
  const decideOnProposal1ByCharlieDaoOp = api.tx.deipDao.onBehalf(charlieDaoId,
    api.tx.deipProposal.decide(proposal1Id, 'Approve')
  );
  const decideOnProposal1ByCharlieDaoTx = api.tx.utility.batchAll([
    decideOnProposal1ByCharlieDaoOp
  ]);
  await decideOnProposal1ByCharlieDaoTx.signAsync(charlie); // 1st approval from Charlie DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByCharlieDaoTx.toHex());


  // Multigroup-1 multisig Dao approves Proposal-1
  const decideOnProposal1ByMultigroup1DaoOp = api.tx.deipDao.onBehalf(multigroup1DaoId,
    api.tx.deipProposal.decide(proposal1Id, 'Approve')
  );
  const decideOnProposal1ByMultigroup1DaoByEveCharlieDaoOp = api.tx.deipDao.onBehalf(eveCharlieDaoId,
    api.tx.multisig.asMultiThreshold1([bobDaveDaoAddress], decideOnProposal1ByMultigroup1DaoOp)
  );
  const decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId,
    api.tx.multisig.asMultiThreshold1([charlieDaoAddress], decideOnProposal1ByMultigroup1DaoByEveCharlieDaoOp)
  );
  const decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoTx = api.tx.utility.batchAll([
    decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoOp
  ]);
  await decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoTx.signAsync(eve); // 1st approval from Multigroup-1 by Eve-Charlie DAO on behalf Eve DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoTx.toHex());

  const project3 = await getProjectAsync(project3Id);
  const project4 = await getProjectAsync(project4Id);
  logJsonResult(`Eve-Charlie DAO Proposal-1 resolved, Project-3 and Project-4 created`, { project3, project4 });



  /**
   * Create a Stablecoin-1 by Treasury Dao
   */
  logInfo(`Creating a Stabelcoin-1 ...`);
  const stablecoin1Id = randomAsHex(20);
  const createStablecoin1ByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipCreateAsset(
      /* assetId: */ stablecoin1Id,
      /* admin: */ { Dao: treasuryDaoId },
      /* min_balance: */ 1,
      /* project_id: */ null
    )
  );
  const setStablecoin1MetaByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipSetMetadata(
      /* assetId: */ stablecoin1Id,
      /* name */ "Stabelcoin for USD",
      /* symbol */ "USDD",
      /* decimals */ 2
    )
  );
  const setStablecoin1TeamByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipSetTeam(
      /* assetId: */ stablecoin1Id,
      /* issuer */ { Dao: treasuryDaoId },
      /* admin */ { Dao: treasuryDaoId },
      /* freezer */ { Dao: treasuryDaoId }
    )
  );
  const createStablecoin1ByAliceDaoTx = api.tx.utility.batchAll([
    createStablecoin1ByTreasuryDaoOp,
    setStablecoin1MetaByTreasuryDaoOp,
    setStablecoin1TeamByTreasuryDaoOp
  ]);

  await createStablecoin1ByAliceDaoTx.signAsync(treasury); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(createStablecoin1ByAliceDaoTx.toHex());
  const stablecoin1 = await getFungibleTokenAsync(stablecoin1Id);
  logJsonResult(`Stabelcoin-1 created`, stablecoin1);



  /**
   * Issue some Stablecoin-1 to Bob Dao balance by Treasury Dao
   */
  logInfo(`Issuing Stabelcoin-1 to Bob Dao ...`);
  const issueStablecoin1ToBobDaoByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipIssueAsset(
      /* assetId: */ stablecoin1Id,
      /* beneficiary */ { Dao: bobDaoId },
      /* amount */ 10000
    )
  );
  const issueStablecoin1ToBobDaoByTreasuryDaoTx = api.tx.utility.batchAll([
    issueStablecoin1ToBobDaoByTreasuryDaoOp
  ]);
  await issueStablecoin1ToBobDaoByTreasuryDaoTx.signAsync(treasury); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueStablecoin1ToBobDaoByTreasuryDaoTx.toHex());
  const bobDaoStablecoin1Balance = await getFungibleTokenBalanceByOwnerAsync(bobDaoAddress, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Bob Dao balance`, bobDaoStablecoin1Balance);



  /**
   * Issue some Stablecoin-1 to Eve Dao balance by Treasury Dao
   */
  logInfo(`Issuing Stabelcoin-1 to Eve Dao ...`);
  const issueStablecoin1ToEveDaoByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipIssueAsset(
      /* assetId: */ stablecoin1Id,
      /* beneficiary */ { Dao: eveDaoId },
      /* amount */ 5000
    )
  );
  const issueStablecoin1ToEveDaoByTreasuryDaoTx = api.tx.utility.batchAll([
    issueStablecoin1ToEveDaoByTreasuryDaoOp
  ]);
  await issueStablecoin1ToEveDaoByTreasuryDaoTx.signAsync(treasury); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueStablecoin1ToEveDaoByTreasuryDaoTx.toHex());
  const eveDaoStablecoin1Balance = await getFungibleTokenBalanceByOwnerAsync(eveDaoAddress, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Eve Dao balance`, eveDaoStablecoin1Balance);


  /**
   * Issue some Stablecoin-1 to Charlie Dao balance by Treasury Dao
   */
  logInfo(`Issuing Stabelcoin-1 to Charlie Dao ...`);
  const issueStablecoin1ToCharlieDaoByTreasuryDaoOp = api.tx.deipDao.onBehalf(treasuryDaoId,
    api.tx.assets.deipIssueAsset(
      /* assetId: */ stablecoin1Id,
      /* beneficiary */ { Dao: charlieDaoId },
      /* amount */ 3000
    )
  );
  const issueStablecoin1ToCharlieDaoByTreasuryDaoTx = api.tx.utility.batchAll([
    issueStablecoin1ToCharlieDaoByTreasuryDaoOp
  ]);
  await issueStablecoin1ToCharlieDaoByTreasuryDaoTx.signAsync(treasury); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueStablecoin1ToCharlieDaoByTreasuryDaoTx.toHex());
  const charlieDaoStablecoin1Balance = await getFungibleTokenBalanceByOwnerAsync(charlieDaoAddress, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Charlie Dao balance`, charlieDaoStablecoin1Balance);



  /**
   * Create NFT-1 for Project-1 by Alice Dao
   */
  logInfo(`Creating NFT-1 ...`);
  const nft1Id = randomAsHex(20);
  const createNft1ByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.assets.deipCreateAsset(
      /* assetId: */ nft1Id,
      /* admin: */ { Dao: aliceDaoId },
      /* min_balance: */ 1,
      /* project_id: */ project1Id,
    )
  );

  const setNft1MetaByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.assets.deipSetMetadata(
      /* assetId: */ nft1Id,
      /* name */ "Non-Fungible Token of Project-1",
      /* symbol */ "NFT1",
      /* decimals */ 2
    )
  );

  const setNft1TeamByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.assets.deipSetTeam(
      /* assetId: */ nft1Id,
      /* issuer */ { Dao: aliceDaoId },
      /* admin */ { Dao: aliceDaoId },
      /* freezer */ { Dao: aliceDaoId }
    )
  );

  const createNft1ByAliceDaoTx = api.tx.utility.batchAll([
    createNft1ByAliceDaoOp,
    setNft1MetaByAliceDaoOp,
    setNft1TeamByAliceDaoOp
  ]);
  await createNft1ByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createNft1ByAliceDaoTx.toHex());
  const nft1 = await getFungibleTokenAsync(nft1Id);
  logJsonResult(`NFT-1 created`, nft1);



  /**
   * Issue some NFT-1 to Alice Dao balance by Alice Dao
   */
  logInfo(`Issuing NFT-1 to Alice Dao ...`);
  const issueNft1ToAliceDaoByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.assets.deipIssueAsset(
      /* assetId: */ nft1Id,
      /* beneficiary */ { Dao: aliceDaoId },
      /* amount */ 15000
    )
  );
  const issueNft1ToAliceDaoByAliceDaoTx = api.tx.utility.batchAll([
    issueNft1ToAliceDaoByAliceDaoOp
  ]);
  await issueNft1ToAliceDaoByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(issueNft1ToAliceDaoByAliceDaoTx.toHex());
  const aliceDaoNft1Balance = await getFungibleTokenBalanceByOwnerAsync(aliceDaoAddress, nft1Id);
  logJsonResult(`NFT-1 issued to Alice Dao balance`, aliceDaoNft1Balance);



  /**
   * Transfer some NFT-1 to Charlie Dao balance by Alice Dao
   */
  logInfo(`Transferring some NFT-1 to Charlie Dao ...`);
  const transferNft1ToCharlieDaoByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.assets.deipTransfer(
      /* assetId: */ nft1Id,
      /* to: */ { Dao: charlieDaoId },
      /* amount: */ 1000
    )
  );
  const transferNft1ToCharlieDaoByAliceDaoTx = api.tx.utility.batchAll([
    transferNft1ToCharlieDaoByAliceDaoOp
  ]);
  await transferNft1ToCharlieDaoByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(transferNft1ToCharlieDaoByAliceDaoTx.toHex());
  const charlieDaoNft1Balance = await getFungibleTokenBalanceByOwnerAsync(charlieDaoAddress, nft1Id);
  logJsonResult(`NFT-1 issued to Alice Dao balance`, charlieDaoNft1Balance);



  /**
   * Create an InvestmentOpportunity-1 by Alice Dao
   */
  logInfo(`Creating InvestmentOpportunity-1 by Alice Dao ...`);
  const invstOpp1Id = randomAsHex(20);
  const invstOpp1StartsInMillisecs = 5000;
  const createInvestmentOpportunityByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deip.createInvestmentOpportunity(
      /* external_id: */ invstOpp1Id,
      /* creator: */ { Dao: aliceDaoId },
      /* shares: */[{ id: nft1Id, amount: { "0": 10000 } }],
      /* funding_model: */ {
        SimpleCrowdfunding: {
          start_time: Date.now() + invstOpp1StartsInMillisecs,
          end_time: Date.now() + 3e6,
          soft_cap: { id: stablecoin1Id, amount: { "0": 3000 } },
          hard_cap: { id: stablecoin1Id, amount: { "0": 5000 } }
        }
      }
    )
  );

  const createInvestmentOpportunityByAliceDaoTx = api.tx.utility.batchAll([
    createInvestmentOpportunityByAliceDaoOp
  ]);
  await createInvestmentOpportunityByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createInvestmentOpportunityByAliceDaoTx.toHex());
  const invstOpp = await getInvestmentOpportunityAsync(invstOpp1Id);
  logJsonResult(`InvestmentOpportunity-1 created`, invstOpp);

  logInfo(`Waiting for InvestmentOpportunity-1 activation time ...\n`);
  await waitAsync(invstOpp1StartsInMillisecs + 2000);


  /**
   * Invest some Stabelcoin-1 to InvestmentOpportunity-1 to obtain NFT-1 by Bob Dao
   */
  logInfo(`Investing to InvestmentOpportunity-1 by Bob Dao ...`);
  const investToInvestmentOpportunity1ByBobDaoOp = api.tx.deipDao.onBehalf(bobDaoId,
    api.tx.deip.invest(
      /* investment_opportunity_id: */ invstOpp1Id,
      /* amount: */ { id: stablecoin1Id, amount: { "0": 2000 } }
    )
  );
  const investToInvestmentOpportunity1ByBobDaoTx = api.tx.utility.batchAll([
    investToInvestmentOpportunity1ByBobDaoOp
  ]);
  await investToInvestmentOpportunity1ByBobDaoTx.signAsync(bob); // 1st approval from Bob DAO (final)
  await sendTxAndWaitAsync(investToInvestmentOpportunity1ByBobDaoTx.toHex());
  logSuccess(`Invested to InvestmentOpportunity-1 by Bob Dao\n`);



  /**
   * Invest some Stabelcoin-1 to InvestmentOpportunity-1 to obtain NFT-1 by Eve Dao
   */
  logInfo(`Investing to InvestmentOpportunity-1 by Eve Dao ...`);
  const investToInvestmentOpportunity1ByEveDaoOp = api.tx.deipDao.onBehalf(eveDaoId,
    api.tx.deip.invest(
      /* investment_opportunity_id: */ invstOpp1Id,
      /* amount: */ { id: stablecoin1Id, amount: { "0": 4000 } }
    )
  );
  const investToInvestmentOpportunity1ByEveDaoTx = api.tx.utility.batchAll([
    investToInvestmentOpportunity1ByEveDaoOp
  ]);
  await investToInvestmentOpportunity1ByEveDaoTx.signAsync(eve);
  await sendTxAndWaitAsync(investToInvestmentOpportunity1ByEveDaoTx.toHex()); // 1st approval from Eve DAO (final)
  logSuccess(`Invested to InvestmentOpportunity-1 by Eve Dao\n`);

  const bobDaoNft1Balance = await getFungibleTokenBalanceByOwnerAsync(bobDaoAddress, nft1Id);
  logJsonResult(`Invested to InvestmentOpportunity-1, NFT-1 Bob Dao balance`, bobDaoNft1Balance);
  const eveDaoNft1Balance = await getFungibleTokenBalanceByOwnerAsync(eveDaoAddress, nft1Id);
  logJsonResult(`Invested to InvestmentOpportunity-1, NFT-1 Eve Dao balance`, eveDaoNft1Balance);
  const aliceDaoNft1Balance2 = await getFungibleTokenBalanceByOwnerAsync(aliceDaoAddress, nft1Id);
  logJsonResult(`NFT-1 Alice Dao balance after finalized InvestmentOpportunity-1`, aliceDaoNft1Balance2);



  /**
   * Initiate a contract agreement between Alice Dao and Charlie Dao parties to issue a License for Project-1
   */
  logInfo(`Initiate a LicenseAgreement-1 between Alice Dao and Charlie Dao parties ...`);
  const licenseAgreement1Id = randomAsHex(20);
  const licenseAgreement1SigningActivatesInMillisecs = 5000;
  const createLicenseAgreement1ByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deip.createContractAgreement(
      /* contractAgreementId: */ licenseAgreement1Id,
      /* creator: */ { Dao: aliceDaoId },
      /* parties: */[{ Dao: charlieDaoId }, { Dao: aliceDaoId }],
      /* hash: */ keccakAsHex(JSON.stringify({ "description": "License Agreement for technology usage between Charlie Dao and Alice Dao parties" }), 256),
      /* activation_time: */ Date.now() + licenseAgreement1SigningActivatesInMillisecs,
      /* expiration_time: */ Date.now() + 3e6,
      /* terms: */ {
        LicenseAgreement: {
          source: project1Id,
          price: { id: stablecoin1Id, amount: { "0": 2000 } }
        }
      }
    )
  );
  const createLicenseAgreement1ByAliceDaoTx = api.tx.utility.batchAll([
    createLicenseAgreement1ByAliceDaoOp
  ]);
  await createLicenseAgreement1ByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createLicenseAgreement1ByAliceDaoTx.toHex());
  const initiatedLicenseAgreement1 = await getContractAgreementAsync(licenseAgreement1Id);
  logJsonResult(`LicenseAgreement-1 between Alice Dao and Charlie Dao parties is initiated`, initiatedLicenseAgreement1);

  logInfo(`Waiting for LicenseAgreement-1 signing period activation time ...\n`);
  await waitAsync(licenseAgreement1SigningActivatesInMillisecs + 2000);



  /**
   * Accept contract agreement by Alice Dao
   */
  logInfo(`Accepting LicenseAgreement-1 by Alice Dao ...`);
  const acceptLicenseAgreement1ByAliceDaoOp = api.tx.deipDao.onBehalf(aliceDaoId,
    api.tx.deip.acceptContractAgreement(
      /* contractAgreementId: */ licenseAgreement1Id,
      /* party: */ { Dao: aliceDaoId }
    )
  );
  const acceptLicenseAgreement1ByAliceDaoTx = api.tx.utility.batchAll([
    acceptLicenseAgreement1ByAliceDaoOp
  ]);
  await acceptLicenseAgreement1ByAliceDaoTx.signAsync(alice); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(acceptLicenseAgreement1ByAliceDaoTx.toHex());
  logSuccess(`Accepted LicenseAgreement-1 by Alice Dao\n`);



  /**
   * Accept contract agreement by Charlie Dao
   */
  logInfo(`Accepting LicenseAgreement-1 by Charlie Dao ...`);
  const acceptLicenseAgreement1ByCharlieDaoOp = api.tx.deipDao.onBehalf(charlieDaoId,
    api.tx.deip.acceptContractAgreement(
      /* contractAgreementId: */ licenseAgreement1Id,
      /* party: */ { Dao: charlieDaoId }
    )
  );
  const acceptLicenseAgreement1ByCharlieDaoTx = api.tx.utility.batchAll([
    acceptLicenseAgreement1ByCharlieDaoOp
  ]);
  await acceptLicenseAgreement1ByCharlieDaoTx.signAsync(charlie); // 1st approval from Charlie DAO (final)
  await sendTxAndWaitAsync(acceptLicenseAgreement1ByCharlieDaoTx.toHex());
  logSuccess(`Accepted LicenseAgreement-1 by Charlie Dao\n`);

  const finalizedLicenseAgreement1 = await getContractAgreementAsync(licenseAgreement1Id);
  logJsonResult(`LicenseAgreement-1 between Alice Dao and Charlie Dao parties is finalized`, finalizedLicenseAgreement1);



}


setup()
  .then((api) => {
    logInfo('\nRunning ...\n');
    return run(api);
  })
  .then(() => {
    logInfo('Successfully finished !');
    process.exit(0);
  })
  .catch((err) => {
    logError(err);
    process.exit(1);
  });
