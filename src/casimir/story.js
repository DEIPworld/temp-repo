import config from './../config';
import { logInfo, logSuccess, logError, logJsonResult } from './../log';
import { randomAsHex } from '@polkadot/util-crypto';
import { genSha256Hash, genRipemd160Hash } from '@deip/toolbox';
import { APP_PROPOSAL, CONTRACT_AGREEMENT_TYPE, PROJECT_CONTENT_TYPES, ASSET_TYPE } from '@deip/constants';
import {
  waitAsync, 
  getDefaultDomain
} from './../utils';
import {
  CreateDaoCmd,
  UpdateDaoCmd,
  AlterDaoAuthorityCmd,
  CreateProjectCmd,
  UpdateProjectCmd,
  CreateProjectContentCmd,
  CreateReviewCmd,
  UpvoteReviewCmd,
  CreateProposalCmd,
  AcceptProposalCmd,
  DeclineProposalCmd,
  CreateFungibleTokenCmd,
  IssueFungibleTokenCmd,
  CreateNonFungibleTokenCmd,
  IssueNonFungibleTokenCmd,
  CreateInvestmentOpportunityCmd,
  InvestCmd,
  CreateContractAgreementCmd,
  AcceptContractAgreementCmd,
  RejectContractAgreementCmd,
  TransferAssetCmd,
  AddDaoMemberCmd,
  RemoveDaoMemberCmd
} from '@deip/commands';

import PRE_SET from './preset';

const { 
  setup,
  getChainService,
  getDaoCreator,
  getDaoCreatorPrivKey,
  fundAddressFromFaucet,
  sendTxAndWaitAsync
} = PRE_SET(config);



async function run() {
  const chainService = await getChainService();
  const chainTxBuilder = chainService.getChainTxBuilder();
  const api = chainService.getChainNodeClient();
  const rpc = chainService.getChainRpc();
  
  const CORE_ASSET = config.CORE_ASSET;
  const DAO_SEED_FUNDING_AMOUNT = config.FAUCET_ACCOUNT.fundingAmount;
  const DAO_FUNDING_AMOUNT = config.FAUCET_ACCOUNT.fundingAmount;

  /**
   * Create Alice DAO actor
   */
  logInfo(`Creating Alice DAO ...`);
  const alice = await chainService.generateChainSeedAccount({ username: "alice", password: randomAsHex(32) });
  await fundAddressFromFaucet(alice.getPubKey(), DAO_SEED_FUNDING_AMOUNT, true);
  const aliceDaoId = genRipemd160Hash(randomAsHex(20));
  const createAliceDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: aliceDaoId,
        authority: {
          owner: {
            auths: [{ key: alice.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(alice),
        description: genSha256Hash({ "description": "Alice DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createAliceDaoByAliceTx = await createAliceDaoTx.signAsync(getDaoCreatorPrivKey(alice), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createAliceDaoByAliceTx);

  await fundAddressFromFaucet(aliceDaoId, DAO_FUNDING_AMOUNT);
  const aliceDao = await rpc.getAccountAsync(aliceDaoId);
  logJsonResult(`Alice DAO created`, aliceDao);



  /**
   * Create Bob DAO actor
   */
  logInfo(`Creating Bob DAO ...`);
  const bob = await chainService.generateChainSeedAccount({ username: "bob", password: randomAsHex(32) });
  await fundAddressFromFaucet(bob.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const bobDaoId = genRipemd160Hash(randomAsHex(20));
  const createBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: bobDaoId,
        authority: {
          owner: {
            auths: [{ key: bob.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(bob),
        description: genSha256Hash({ "description": "Bob DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createBobDaoByBobTx = await createBobDaoTx.signAsync(getDaoCreatorPrivKey(bob), api); // 1st approval from Bob DAO (final)
  await sendTxAndWaitAsync(createBobDaoByBobTx);

  await fundAddressFromFaucet(bobDaoId, DAO_FUNDING_AMOUNT);
  const bobDao = await rpc.getAccountAsync(bobDaoId);
  logJsonResult(`Bob DAO created`, bobDao);



  /**
   * Create Charlie DAO actor
   */
  logInfo(`Creating Charlie DAO ...`);
  const charlie = await chainService.generateChainSeedAccount({ username: "charlie", password: randomAsHex(32) });
  await fundAddressFromFaucet(charlie.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const charlieDaoId = genRipemd160Hash(randomAsHex(20));
  const createCharlieDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: charlieDaoId,
        authority: {
          owner: {
            auths: [{ key: charlie.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(charlie),
        description: genSha256Hash({ "description": "Charlie DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createCharlieDaoByCharlieTx = await createCharlieDaoTx.signAsync(getDaoCreatorPrivKey(charlie), api); // 1st approval from Charlie DAO (final)
  await sendTxAndWaitAsync(createCharlieDaoByCharlieTx);

  await fundAddressFromFaucet(charlieDaoId, DAO_FUNDING_AMOUNT);
  const charlieDao = await rpc.getAccountAsync(charlieDaoId);
  logJsonResult(`Charlie DAO created`, charlieDao);



  /**
   * Create Dave DAO actor
   */
  logInfo(`Creating Dave DAO ...`);
  const dave = await chainService.generateChainSeedAccount({ username: "dave", password: randomAsHex(32) });
  await fundAddressFromFaucet(dave.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const daveDaoId = genRipemd160Hash(randomAsHex(20));
  const createDaveDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: daveDaoId,
        authority: {
          owner: {
            auths: [{ key: dave.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(dave),
        description: genSha256Hash({ "description": "Dave DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createDaveDaoByDaveTx = await createDaveDaoTx.signAsync(getDaoCreatorPrivKey(dave), api); // 1st approval from Dave DAO (final)
  await sendTxAndWaitAsync(createDaveDaoByDaveTx);

  await fundAddressFromFaucet(daveDaoId, DAO_FUNDING_AMOUNT);
  const daveDao = await rpc.getAccountAsync(daveDaoId);
  logJsonResult(`Dave DAO created`, daveDao);



  /**
   * Create Eve DAO actor
   */
  logInfo(`Creating Eve DAO ...`);
  const eveTemp = await chainService.generateChainSeedAccount({ username: "eve", password: randomAsHex(32) });
  await fundAddressFromFaucet(eveTemp.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const eveDaoId = genRipemd160Hash(randomAsHex(20));
  const createEveDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: eveDaoId,
        authority: {
          owner: {
            auths: [{ key: eveTemp.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(eveTemp),
        description: genSha256Hash({ "description": "Eve DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createEveDaoByEveTx = await createEveDaoTx.signAsync(getDaoCreatorPrivKey(eveTemp), api); // 1st approval from Eve DAO (final)
  await sendTxAndWaitAsync(createEveDaoByEveTx);

  await fundAddressFromFaucet(eveDaoId, DAO_FUNDING_AMOUNT);
  const eveDao = await rpc.getAccountAsync(eveDaoId);
  logJsonResult(`Eve DAO created`, eveDao);



  /**
   * Update Eve DAO actor authority
   */
  logInfo(`Update Eve DAO authority ...`);
  const eve = await chainService.generateChainSeedAccount({ username: "eve", password: randomAsHex(32) });
  await fundAddressFromFaucet(eve.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const updateAliceDaoAuthTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const alterDaoAuthorityCmd = new AlterDaoAuthorityCmd({
        entityId: eveDaoId,
        authority: {
          owner: {
            auths: [{ key: eve.getPubKey(), weight: 1 }],
            weight: 1
          }
        }
      });

      txBuilder.addCmd(alterDaoAuthorityCmd);
      return txBuilder.end();
    });
  const updateEveDaoAuthByAliceTx = await updateAliceDaoAuthTx.signAsync(eveTemp.getPrivKey(), api); // 1st approval from Eve DAO (final)
  await sendTxAndWaitAsync(updateEveDaoAuthByAliceTx);
  const eveDaoAfterAlteredAuths = await rpc.getAccountAsync(eveDaoId);
  logJsonResult(`Eve DAO authority updated`, eveDaoAfterAlteredAuths);



  /**
   * Create Alice-Bob multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Alice-Bob multisig DAO ...`);
  const aliceBobDaoId = genRipemd160Hash(randomAsHex(20));
  const createAliceBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: aliceBobDaoId,
        authority: {
          owner: {
            auths: [{ name: aliceDaoId, weight: 1 }, { name: bobDaoId, weight: 1}],
            weight: 1
          }
        },
        creator: aliceDaoId,
        description: genSha256Hash({ "description": "Alice-Bob multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createAliceBobDaoByAliceDaoTx = await createAliceBobDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createAliceBobDaoByAliceDaoTx);

  await fundAddressFromFaucet(aliceBobDaoId, DAO_FUNDING_AMOUNT);
  const aliceBobDao = await rpc.getAccountAsync(aliceBobDaoId);
  logJsonResult(`Alice-Bob multisig DAO created`, aliceBobDao);



  /**
   * Add Eve DAO actor to Alice-Bob multisig DAO actor
   */
  logInfo(`Adding Eve DAO to Alice-Bob multisig DAO ...`);
  const addEveDaoToAliceBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const addDaoMemberCmd = new AddDaoMemberCmd({
        teamId: aliceBobDaoId,
        member: eveDaoId,
        isThresholdPreserved: true
      });

      txBuilder.addCmd(addDaoMemberCmd);
      return txBuilder.end();
    });
  const addEveDaoToAliceBobDaoByAliceDaoTx = await addEveDaoToAliceBobDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(addEveDaoToAliceBobDaoByAliceDaoTx);
  const aliceBobDaoWithEveDao = await rpc.getAccountAsync(aliceBobDaoId);
  logJsonResult(`Eve DAO added to Alice-Bob multisig DAO`, aliceBobDaoWithEveDao);



  /**
   * Remove Eve DAO actor from Alice-Bob multisig DAO actor
   */
  logInfo(`Removing Eve DAO from Alice-Bob multisig DAO ...`);
  const removeEveDaoFromAliceBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const removeDaoMemberCmd = new RemoveDaoMemberCmd({
        teamId: aliceBobDaoId,
        member: eveDaoId,
        isThresholdPreserved: true
      });

      txBuilder.addCmd(removeDaoMemberCmd);
      return txBuilder.end();
    });
  
  const removeEveDaoFromAliceBobDaoByAliceDaoTx = await removeEveDaoFromAliceBobDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO
  await sendTxAndWaitAsync(removeEveDaoFromAliceBobDaoByAliceDaoTx);
  
  const aliceBobDaoWithoutEveDao = await rpc.getAccountAsync(aliceBobDaoId);
  logJsonResult(`Eve DAO removed from Alice-Bob multisig DAO`, aliceBobDaoWithoutEveDao);



  /**
   * Create Eve-Charlie multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Eve-Charlie multisig DAO ...`);
  const eveCharlieDaoId = genRipemd160Hash(randomAsHex(20));
  const createEveCharlieDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: eveCharlieDaoId,
        authority: {
          owner: {
            auths: [{ name: eveDaoId, weight: 1 }, { name: charlieDaoId, weight: 1 }],
            weight: 1
          }
        },
        creator: eveDaoId,
        description: genSha256Hash({ "description": "Eve-Charlie multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createEveCharlieDaoByEveDaoTx = await createEveCharlieDaoTx.signAsync(eve.getPrivKey(), api); // 1st approval from Eve DAO (final)
  await sendTxAndWaitAsync(createEveCharlieDaoByEveDaoTx);

  await fundAddressFromFaucet(eveCharlieDaoId, DAO_FUNDING_AMOUNT);
  const eveCharlieDao = await rpc.getAccountAsync(eveCharlieDaoId);
  logJsonResult(`Eve-Charlie multisig DAO created`, eveCharlieDao);



  /**
   * Create Bob-Dave multisig DAO actor with a threshold equal to 2 signatures
   */
  logInfo(`Creating Bob-Dave multisig DAO ...`);
  const bobDaveDaoId = genRipemd160Hash(randomAsHex(20));
  const createBobDaveDaoDaoTx = await chainTxBuilder.begin({ ignorePortalSig: false })
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: bobDaveDaoId,
        authority: {
          owner: {
            auths: [{ name: bobDaoId, weight: 1 }, { name: daveDaoId, weight: 1 }],
            weight: 2
          }
        },
        creator: bobDaoId,
        description: genSha256Hash({ "description": "Bob-Dave multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });

  const createBobDaveDaoByBobDaoTx = await createBobDaveDaoDaoTx.signAsync(bob.getPrivKey(), api); // 1st approval from Bob DAO
  await sendTxAndWaitAsync(createBobDaveDaoByBobDaoTx);
  const createBobDaveDaoByDaveDaoTx = await createBobDaveDaoDaoTx.signAsync(dave.getPrivKey(), api, { override: true }); // 2nd approval from Dave DAO (final)
  await sendTxAndWaitAsync(createBobDaveDaoByDaveDaoTx);

  await fundAddressFromFaucet(bobDaveDaoId, DAO_FUNDING_AMOUNT);
  const bobDaveDao = await rpc.getAccountAsync(bobDaveDaoId);
  logJsonResult(`Bob-Dave multisig DAO created`, bobDaveDao);


  /**
   * Create Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO actor with a threshold equal to 1 signature
   */
  logInfo(`Creating Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO ...`);
  const multigroup1DaoId = genRipemd160Hash(randomAsHex(20));
  const createMultigroup1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: multigroup1DaoId,
        authority: {
          owner: {
            auths: [{ name: eveCharlieDaoId, weight: 1 }, { name: bobDaveDaoId, weight: 1 }],
            weight: 1
          }
        },
        creator: eveDaoId,
        description: genSha256Hash({ "description": "Multigroup-1 multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });

  const createMultigroup1DaoByEveCharlieDaoByEveDaoTx = await createMultigroup1Tx.signAsync(eve.getPrivKey(), api);  // 1st approval from Eve DAO on behalf Eve-Charlie DAO (final)
  await sendTxAndWaitAsync(createMultigroup1DaoByEveCharlieDaoByEveDaoTx);

  await fundAddressFromFaucet(multigroup1DaoId, DAO_FUNDING_AMOUNT);
  const multigroup1Dao = await rpc.getAccountAsync(multigroup1DaoId);
  logJsonResult(`Multigroup-1 (Eve-Charlie, Bob-Dave) multisig DAO created`, multigroup1Dao);



  /**
   * Create Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO actor with a threshold equal to 2 signatures
   */
  logInfo(`Creating Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO ...`);
  const multigroup2DaoId = genRipemd160Hash(randomAsHex(20));
  const createMultigroup2Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: multigroup2DaoId,
        authority: {
          owner: {
            auths: [{ name: eveCharlieDaoId, weight: 1 }, { name: bobDaveDaoId, weight: 1 }],
            weight: 2
          }
        },
        creator: eveDaoId,
        description: genSha256Hash({ "description": "Multigroup-2 multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });

  const createMultigroup2DaoByEveCharlieDaoByEveDaoTx = await createMultigroup2Tx.signAsync(eve.getPrivKey(), api); // 1st approval from Eve DAO on behalf Eve-Charlie DAO
  await sendTxAndWaitAsync(createMultigroup2DaoByEveCharlieDaoByEveDaoTx);

  const createMultigroup2DaoByBobDaveDaoByBobDaoTx = await createMultigroup2Tx.signAsync(bob.getPrivKey(), api, { override: true }); // 2nd approval from Bob DAO on behalf Bob-Dave DAO
  await sendTxAndWaitAsync(createMultigroup2DaoByBobDaveDaoByBobDaoTx);

  const createMultigroup2DaoByBobDaveDaoByDaveDaoTx = await createMultigroup2Tx.signAsync(dave.getPrivKey(), api, { override: true }); // 3rd approval from Dave DAO on behalf Bob-Dave DAO (final)
  await sendTxAndWaitAsync(createMultigroup2DaoByBobDaveDaoByDaveDaoTx);

  await fundAddressFromFaucet(multigroup2DaoId, DAO_FUNDING_AMOUNT);
  const multigroup2Dao = await rpc.getAccountAsync(multigroup2DaoId);
  logJsonResult(`Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO created`, multigroup2Dao);



  /**
   * Create Treasury DAO actor
   */
  logInfo(`Creating Treasury DAO ...`);
  const treasury = await chainService.generateChainSeedAccount({ username: "treasury", password: randomAsHex(32) });
  await fundAddressFromFaucet(treasury.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const treasuryDaoId = genRipemd160Hash(randomAsHex(20));
  const createTreasuryDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: treasuryDaoId,
        authority: {
          owner: {
            auths: [{ key: treasury.getPubKey(), weight: 1 }],
            weight: 1
          }
        },
        creator: getDaoCreator(treasury),
        description: genSha256Hash({ "description": "Treasury DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createTreasuryDaoByEveTx = await createTreasuryDaoTx.signAsync(getDaoCreatorPrivKey(treasury), api);
  await sendTxAndWaitAsync(createTreasuryDaoByEveTx);

  await fundAddressFromFaucet(treasuryDaoId, "1000000000000000000000");
  const treasuryDao = await rpc.getAccountAsync(treasuryDaoId);
  logJsonResult(`Treasury DAO created`, treasuryDao);



  /**
   * Update Alice DAO actor
   */
  logInfo(`Updating Alice DAO ...`);
  const updateAliceDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const updateDaoCmd = new UpdateDaoCmd({
        entityId: aliceDaoId,
        description: genSha256Hash({ "description": "Updated Alice DAO" }),
        isTeamAccount: false
      });

      txBuilder.addCmd(updateDaoCmd);
      return txBuilder.end();
    });

  const updateAliceDaoByAliceTx = await updateAliceDaoTx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(updateAliceDaoByAliceTx);

  const updatedAliceDao = await rpc.getAccountAsync(aliceDaoId);
  logJsonResult(`Alice DAO updated`, updatedAliceDao);



  /**
   * Create Project on behalf of Alice DAO actor
   */
  logInfo(`Creating Alice DAO Project-1 ...`);
  const project1Id = genRipemd160Hash(randomAsHex(20));
  const defaultDomainHex = getDefaultDomain();
  const defaultDomainId = defaultDomainHex.substring(2, defaultDomainHex.length);
  const createProject1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createProjectCmd = new CreateProjectCmd({
        entityId: project1Id,
        description: genSha256Hash({ "description": "Alice DAO Project" }),
        teamId: aliceDaoId,
        isPrivate: false,
        domains: [defaultDomainId]
      });
      txBuilder.addCmd(createProjectCmd);
      return txBuilder.end();
    });
  const createProject1ByAliceDaoTx = await createProject1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createProject1ByAliceDaoTx);
  const project1 = await rpc.getProjectAsync(project1Id);
  logJsonResult(`Alice DAO Project-1 created`, project1);



  /**
   * Update Alice DAO Project-1 on behalf of Alice DAO actor
   */
  logInfo(`Updating Alice DAO Project-1 ...`);
  const updateProject1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createProjectCmd = new UpdateProjectCmd({
        entityId: project1Id,
        description: genSha256Hash({ "description": "Updated Alice DAO Project" }),
        teamId: aliceDaoId,
        isPrivate: null
      });
      txBuilder.addCmd(createProjectCmd);
      return txBuilder.end();
    });
    
  const updateProject1ByAliceDaoTx = await updateProject1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(updateProject1ByAliceDaoTx);
  const updatedProject1 = await rpc.getProjectAsync(project1Id);
  logJsonResult(`Alice DAO Project-1 updated`, updatedProject1);



  /**
   * Creating Content-1 of Project-1 on behalf of Alice DAO actor
   */
  logInfo(`Creating Content-1 of Project-1 ...`);
  const project1Content1Id = genRipemd160Hash(randomAsHex(20));
  const createProject1Content1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createProjectContentCmd = new CreateProjectContentCmd({
        entityId: project1Content1Id,
        projectId: project1Id,
        teamId: aliceDaoId,
        type: PROJECT_CONTENT_TYPES.MILESTONE_CHAPTER,
        description: genSha256Hash({ "description": "Meta for Content-1 of Project-1" }),
        contentType: 1,
        content: genSha256Hash({ "description": "Data of Content-1 of Project-1" }),
        authors: [aliceDaoId],
        references: []
      });
      txBuilder.addCmd(createProjectContentCmd);
      return txBuilder.end();
    });
    
  const createProject1Content1ByAliceDaoTx = await createProject1Content1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createProject1Content1ByAliceDaoTx);
  const project1Content1 = await rpc.getProjectContentAsync(project1Content1Id);
  logJsonResult(`Content-1 of Project-1 created`, project1Content1);



  /**
   * Creating Review-1 of Content-1 of Project-1 on behalf of Bob DAO actor
   */
  logInfo(`Creating Review-1 of Content-1 of Project-1 ...`);
  const review1Project1Content1Id = genRipemd160Hash(randomAsHex(20));
  const createReview1Project1Content1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const content = { "description": "Review-1 of Content-1 of Project-1" };
      const createReviewCmd = new CreateReviewCmd({
        entityId: review1Project1Content1Id,
        author: bobDaoId,
        projectContentId: project1Content1Id,
        content: content,
        contentHash: genSha256Hash(content),
        assessment: { type: 1, scores: { '1': 5, '3': 4, '6': 5 } },
        domains: [defaultDomainId]
      });
      txBuilder.addCmd(createReviewCmd);
      return txBuilder.end();
    });
    
  const createProject1Content1ByBobDaoTx = await createReview1Project1Content1Tx.signAsync(bob.getPrivKey(), api); // 1st approval from Bob DAO (final)
  await sendTxAndWaitAsync(createProject1Content1ByBobDaoTx);
  const review1Project1Content1 = await rpc.getReviewAsync(review1Project1Content1Id);
  logJsonResult(`Review-1 of Content-1 of Project-1 created`, review1Project1Content1);



  /**
   * Upvoting Review-1 of Content-1 of Project-1 on behalf of Charlie DAO actor
   */
  logInfo(`Upvoting Review-1 of Content-1 of Project-1 ...`);
  const upvote1Review1Project1Content1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const upvoteReviewCmd = new UpvoteReviewCmd({
        voter: charlieDaoId,
        reviewId: review1Project1Content1Id,
        domainId: defaultDomainId
      });
      txBuilder.addCmd(upvoteReviewCmd);
      return txBuilder.end();
    });
    
  const upvote1Review1Project1Content1TxByCharlieDaoTx = await upvote1Review1Project1Content1Tx.signAsync(charlie.getPrivKey(), api); // 1st approval from Charlie DAO (final)
  await sendTxAndWaitAsync(upvote1Review1Project1Content1TxByCharlieDaoTx);
  const upvotesReview1Project1Content1 = await rpc.getReviewUpvotesByReviewAsync(review1Project1Content1Id);
  logJsonResult(`Upvotes of Review-1 of Content-1 of Project-1`, upvotesReview1Project1Content1);



  /**
   * Create Project on behalf of Multigroup-2 (Eve-Charlie, Bob-Dave) multisig DAO actor
   */
  logInfo(`Creating Multigroup-2 DAO Project-2 ...`);
  const project2Id = genRipemd160Hash(randomAsHex(20));
  const createProject2Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createProjectCmd = new CreateProjectCmd({
        entityId: project2Id,
        description: genSha256Hash({ "description": "Multigroup-2 DAO Project" }),
        teamId: multigroup2DaoId,
        isPrivate: false,
        domains: []
      });
      txBuilder.addCmd(createProjectCmd);
      return txBuilder.end();
    });

  const createProject2ByMultigroup2ByEveCharlieDaoByEveDaoTx = await createProject2Tx.signAsync(eve.getPrivKey(), api); // 1st approval from Eve DAO on behalf Eve-Charlie DAO
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByEveCharlieDaoByEveDaoTx);

  const createProject2ByMultigroup2ByBobDaveDaoByBobDaoTx = await createProject2Tx.signAsync(bob.getPrivKey(), api, { override: true }); // 2nd approval from Bob DAO on behalf Bob-Dave DAO
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByBobDaveDaoByBobDaoTx);

  const createProject2ByMultigroup2ByBobDaveDaoByDaveDaoTx = await createProject2Tx.signAsync(dave.getPrivKey(), api, { override: true }); // 3rd approval from Dave DAO on behalf Bob-Dave DAO (final)
  await sendTxAndWaitAsync(createProject2ByMultigroup2ByBobDaveDaoByDaveDaoTx);

  const multigroup2DaoProject = await rpc.getProjectAsync(project2Id);
  logJsonResult(`Multigroup-2 DAO Project-2 created`, multigroup2DaoProject);



  /**
   * Create Proposal-1 on behalf Eve-Charlie multisig Dao actor 
   * to propose Alice-Bob multisig Dao actor and Bob-Dave multisig Dao actor 
   * to start new projects with initial funding from Charlie Dao actor and Multigroup-1 multisig DAO actor
   */
  logInfo(`Creating Eve-Charlie DAO Proposal-1 ...`);
  const proposal1Id = genRipemd160Hash(randomAsHex(20));
  const project3Id = genRipemd160Hash(randomAsHex(20));
  const project4Id = genRipemd160Hash(randomAsHex(20));

  let proposal1BatchWeight;
  const createProposal1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {

      const createProject3Cmd = new CreateProjectCmd({
        entityId: project3Id,
        teamId: aliceBobDaoId,
        description: genSha256Hash({ "description": "Alice-Bob DAO Project" }),
        domains: [],
        isPrivate: false
      });

      const createProject4Cmd = new CreateProjectCmd({
        entityId: project4Id,
        teamId: bobDaveDaoId,
        description: genSha256Hash({ "description": "Bob-Dave DAO Project" }),
        domains: [],
        isPrivate: false
      });

      const fundProject4Cmd = new TransferAssetCmd({
        from: charlieDaoId,
        to: bobDaveDaoId,
        tokenId: CORE_ASSET.id,
        symbol: CORE_ASSET.symbol,
        precision: CORE_ASSET.precision,
        amount: "1000000000"
      });

      const fundProject3Cmd = new TransferAssetCmd({
        from: multigroup1DaoId,
        to: aliceBobDaoId,
        tokenId: CORE_ASSET.id,
        symbol: CORE_ASSET.symbol,
        precision: CORE_ASSET.precision,
        amount: "1000000000"
      });

      const proposal1Batch = [
        createProject3Cmd,
        createProject4Cmd,
        fundProject4Cmd,
        fundProject3Cmd
      ];

      return chainTxBuilder.getBatchWeight(proposal1Batch)
        .then((batchWeight) => {
          proposal1BatchWeight = batchWeight;

          const createProposalCmd = new CreateProposalCmd({
            entityId: proposal1Id,
            type: APP_PROPOSAL.PROJECT_PROPOSAL,
            creator: eveCharlieDaoId,
            expirationTime: Date.now() + 3e6,
            proposedCmds: proposal1Batch,
          });

          txBuilder.addCmd(createProposalCmd);
          return txBuilder.end();
        })
    });

  const createProposal1ByEveCharlieDaoByEveDaoTx = await createProposal1Tx.signAsync(eve.getPrivKey(), api); // 1st approval from Eve-Charlie DAO on behalf Eve DAO (final)
  await sendTxAndWaitAsync(createProposal1ByEveCharlieDaoByEveDaoTx);
  const proposal1 = await rpc.getProposalAsync(proposal1Id);
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
  const decideOnProposal1ByAliceBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: aliceBobDaoId,
        batchWeight: proposal1BatchWeight,
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const decideOnProposal1ByAliceBobDaoByAliceDaoTx = await decideOnProposal1ByAliceBobDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice-Bob DAO on behalf Alice DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByAliceBobDaoByAliceDaoTx);


  // Bob-Dave multisig Dao approves Proposal-1
  const decideOnProposal1ByBobDaveDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: bobDaveDaoId,
        batchWeight: proposal1BatchWeight
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const decideOnProposal1ByBobDaveDaoByBobDaoTx = await decideOnProposal1ByBobDaveDaoTx.signAsync(bob.getPrivKey(), api); // 1st approval from Bob-Dave DAO on behalf Bob DAO
  await sendTxAndWaitAsync(decideOnProposal1ByBobDaveDaoByBobDaoTx);
  
  const decideOnProposal1ByBobDaveDaoByDaveDaoTx = await decideOnProposal1ByBobDaveDaoTx.signAsync(dave.getPrivKey(), api, { override: true }); // 2nd approval from Bob-Dave DAO on behalf Dave DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByBobDaveDaoByDaveDaoTx);


  // Charlie Dao approves Proposal-1
  const decideOnProposal1ByCharlieTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: charlieDaoId,
        batchWeight: proposal1BatchWeight
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const decideOnProposal1ByCharlieDaoTx = await decideOnProposal1ByCharlieTx.signAsync(charlie.getPrivKey(), api); // 1st approval from Charlie DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByCharlieDaoTx);


  // Multigroup-1 multisig Dao approves Proposal-1
  const decideOnProposal1ByMultigroup1DaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: multigroup1DaoId,
        batchWeight: proposal1BatchWeight
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoTx = await decideOnProposal1ByMultigroup1DaoTx.signAsync(eve.getPrivKey(), api); // 1st approval from Multigroup-1 by Eve-Charlie DAO on behalf Eve DAO (final)
  await sendTxAndWaitAsync(decideOnProposal1ByMultigroup1DaoByEveCharlieDaoByEveDaoTx);

  const project3 = await rpc.getProjectAsync(project3Id);
  const project4 = await rpc.getProjectAsync(project4Id);
  logJsonResult(`Eve-Charlie DAO Proposal-1 resolved, Project-3 and Project-4 created`, { project3, project4 });



  /**
   * Create a Stablecoin-1 by Treasury Dao
   */
  logInfo(`Creating a Stabelcoin-1 ...`);
  const stablecoin1Id = genRipemd160Hash(randomAsHex(20));
  const createStablecoin1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createStablecoin1Cmd = new CreateFungibleTokenCmd({
        entityId: stablecoin1Id,
        issuer: treasuryDaoId,
        name: "Stabelcoin for USD",
        symbol: "USDD",
        precision: 2,
        description: "",
        minBalance: 1,
        maxSupply: 100000000000000
      });
      txBuilder.addCmd(createStablecoin1Cmd);
      return txBuilder.end();
    });

  const createStablecoin1ByTreasuryDaoTx = await createStablecoin1Tx.signAsync(treasury.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(createStablecoin1ByTreasuryDaoTx);
  const stablecoin1 = await rpc.getFungibleTokenAsync(stablecoin1Id);
  logJsonResult(`Stabelcoin-1 created`, stablecoin1);



  /**
   * Issue some Stablecoin-1 to Bob Dao, Eve Dao, Charlie Dao balances by Treasury Dao
   */
  logInfo(`Issuing Stabelcoin-1 to Bob Dao, Eve Dao and Charlie Dao ...`);
  const issueStablecoin1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const issueStabelcoin1ToBobDaoCmd = new IssueFungibleTokenCmd({
        issuer: treasuryDaoId,
        tokenId: stablecoin1Id,
        symbol: "USDD",
        precision: 2,
        amount: "10000",
        recipient: bobDaoId
      });
      txBuilder.addCmd(issueStabelcoin1ToBobDaoCmd);

      const issueStabelcoin1ToEveDaoCmd = new IssueFungibleTokenCmd({
        issuer: treasuryDaoId,
        tokenId: stablecoin1Id,
        symbol: "USDD",
        precision: 2,
        amount: "5000",
        recipient: eveDaoId
      });
      txBuilder.addCmd(issueStabelcoin1ToEveDaoCmd);

      const issueStabelcoin1ToCharlieDaoCmd = new IssueFungibleTokenCmd({
        issuer: treasuryDaoId,
        tokenId: stablecoin1Id,
        symbol: "USDD",
        precision: 2,
        amount: "3000",
        recipient: charlieDaoId
      });
      txBuilder.addCmd(issueStabelcoin1ToCharlieDaoCmd);

      return txBuilder.end();
    });

  const issueStablecoin1ByTreasuryDaoTx = await issueStablecoin1Tx.signAsync(treasury.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueStablecoin1ByTreasuryDaoTx);

  const bobDaoStablecoin1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(bobDaoId, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Bob Dao balance`, bobDaoStablecoin1Balance);
  const eveDaoStablecoin1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(eveDaoId, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Eve Dao balance`, eveDaoStablecoin1Balance);
  const charlieDaoStablecoin1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(charlieDaoId, stablecoin1Id);
  logJsonResult(`Stabelcoin-1 issued to Charlie Dao balance`, charlieDaoStablecoin1Balance);



  /**
   *   Create FT-1 for Project-1 by Alice Dao
   */
  logInfo(`Creating FT-1 ...`);
  const ft1Id = genRipemd160Hash(randomAsHex(20));
  const createFt1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createNft1Cmd = new CreateFungibleTokenCmd({
        entityId: ft1Id,
        issuer: aliceDaoId,
        name: "Fungible Token of Project-1",
        symbol: "FT1",
        precision: 2,
        description: "",
        minBalance: 1,
        projectTokenSettings: {
          projectId: project1Id,
          teamId: aliceDaoId // TODO: infer 'teamId' from 'projectId' for Graphene
        },
        maxSupply: 1000000000000000 // TODO: add 'maxSupply' for Substrate assets_pallet wrapper
      });
      txBuilder.addCmd(createNft1Cmd);
      return txBuilder.end();
    });

  const createFt1ByTreasuryDaoTx = await createFt1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(createFt1ByTreasuryDaoTx);
  const nft1 = await rpc.getFungibleTokenAsync(ft1Id);
  logJsonResult(`FT-1 created`, nft1);



  /**
   *   Issue some FT-1 to Alice Dao balance by Alice Dao
   */
  logInfo(`Issuing some FT-1 to Alice Dao ...`);
  const issueFt1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const issueNft1ToAliceDaoCmd = new IssueFungibleTokenCmd({
        issuer: aliceDaoId,
        tokenId: ft1Id,
        symbol: "FT1",
        precision: 2,
        amount: "100000",
        recipient: aliceDaoId,
      });
      txBuilder.addCmd(issueNft1ToAliceDaoCmd);
      return txBuilder.end();
    });
  const issueFt1ByAliceDaoTx = await issueFt1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueFt1ByAliceDaoTx);
  const aliceDaoFt1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(aliceDaoId, ft1Id);
  logJsonResult(`FT-1 issued to Alice Dao balance`, aliceDaoFt1Balance);



  /**
   *   Transfer some FT-1 to Charlie Dao balance by Alice Dao
   */
  logInfo(`Transferring some FT-1 to Charlie Dao ...`);
  const transferFt1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const ft1TransferCmd = new TransferAssetCmd({
        from: aliceDaoId,
        to: charlieDaoId,
        tokenId: ft1Id,
        symbol: "FT1",
        precision: 2,
        amount: 1000
      });

      txBuilder.addCmd(ft1TransferCmd);
      return txBuilder.end();
    });

  const transferFt1ByAliceDaoTx = await transferFt1Tx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(transferFt1ByAliceDaoTx);
  const charlieDaoFt1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(charlieDaoId, ft1Id);
  logJsonResult(`FT-1 transfered to Charlie Dao balance`, charlieDaoFt1Balance);


  /**
   *  Create NFT-2 for Project-1 by Alice Dao
   */
  logInfo(`Creating NFT-2 ...`);
  const nft2Id = genRipemd160Hash(randomAsHex(20));
  const createNft2Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createNft2Cmd = new CreateNonFungibleTokenCmd({
        entityId: nft2Id,
        issuer: aliceDaoId,
        name: "Non-Fungible Token 2 of Project-1",
        symbol: "NFT2",
        description: "",
        projectTokenSettings: {
          projectId: project1Id,
          teamId: aliceDaoId
        }
      });
      txBuilder.addCmd(createNft2Cmd);
      return txBuilder.end();
    });

  const createNft2ByTreasuryDaoTx = await createNft2Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(createNft2ByTreasuryDaoTx);
  const nft2 = await rpc.getNonFungibleTokenClassAsync(nft2Id);
  logJsonResult(`NFT-2 created`, nft2);



  /**
   *  Issue some NFT-2 to Alice Dao balance by Alice Dao
   */
  logInfo(`Issuing some NFT-2 to Alice Dao ...`);
  const issueNft2ToAliceDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const issueNft2ToAliceDaoCmd = new IssueNonFungibleTokenCmd({
        issuer: aliceDaoId,
        classId: nft2Id,
        instanceId: 1,
        recipient: aliceDaoId,
      });
      txBuilder.addCmd(issueNft2ToAliceDaoCmd);
      return txBuilder.end();
    });
  const issueNft2ToAliceDaoByAliceDaoTx = await issueNft2ToAliceDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueNft2ToAliceDaoByAliceDaoTx);
  const aliceDaoNft2Balance = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(aliceDaoId, nft2Id);
  logJsonResult(`NFT-2 issued to Alice Dao balance`, aliceDaoNft2Balance);


  logInfo(`Issuing some NFT-2 to Bob Dao ...`);
  const issueNft2ToBobDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const issueNft2ToBobDaoCmd = new IssueNonFungibleTokenCmd({
        issuer: aliceDaoId,
        classId: nft2Id,
        instanceId: 2,
        recipient: bobDaoId,
      });
      txBuilder.addCmd(issueNft2ToBobDaoCmd);
      return txBuilder.end();
    });
  const issueNft2ToBobDaoByAliceDaoTx = await issueNft2ToBobDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueNft2ToBobDaoByAliceDaoTx);
  const bobDaoNft2Balance = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(bobDaoId, nft2Id);
  logJsonResult(`NFT-2 issued to Bob Dao balance`, bobDaoNft2Balance);


  /**
   *  Create NFT-3 for Project-1 by Alice Dao
   */
  logInfo(`Creating NFT-3 ...`);
  const nft3Id = genRipemd160Hash(randomAsHex(20));
  const createNft3Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createNft3Cmd = new CreateNonFungibleTokenCmd({
        entityId: nft3Id,
        issuer: aliceDaoId,
        name: "Non-Fungible Token 3 of Project-1",
        symbol: "NFT3",
        description: "",
        projectTokenSettings: {
          projectId: project1Id,
          teamId: aliceDaoId
        }
      });
      txBuilder.addCmd(createNft3Cmd);
      return txBuilder.end();
    });

  const createNft3ByTreasuryDaoTx = await createNft3Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(createNft3ByTreasuryDaoTx);
  const nft3 = await rpc.getNonFungibleTokenClassAsync(nft3Id);
  logJsonResult(`NFT-3 created`, nft3);


  /**
   *  Issue some NFT-3 to Alice Dao balance by Alice Dao
   */
  logInfo(`Issuing some NFT-3 to Alice Dao ...`);
  const issueNft3ToAliceDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const issueNft3ToAliceDaoCmd = new IssueNonFungibleTokenCmd({
        issuer: aliceDaoId,
        classId: nft3Id,
        instanceId: 1,
        recipient: aliceDaoId,
      });
      txBuilder.addCmd(issueNft3ToAliceDaoCmd);
      return txBuilder.end();
    });
  const issueNft3ToAliceDaoByAliceDaoTx = await issueNft3ToAliceDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Treasury DAO (final)
  await sendTxAndWaitAsync(issueNft3ToAliceDaoByAliceDaoTx);
  const aliceDaoNft3Balance = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(aliceDaoId, nft3Id);
  logJsonResult(`NFT-3 issued to Alice Dao balance`, aliceDaoNft3Balance);

  const aliceDaoNftBalances = await rpc.getNonFungibleTokenClassesInstancesByOwnerAsync(aliceDaoId);
  logJsonResult(`NFT collection of Alice Dao`, aliceDaoNftBalances);


  /**
   *  Transfer some NFT-2 to Charlie Dao balance by Alice Dao
   */
  logInfo(`Transferring some NFT-2 to Charlie Dao ...`);
  const transferNft2Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const nft2TransferCmd = new TransferAssetCmd({
        from: aliceDaoId,
        to: charlieDaoId,
        assetType: ASSET_TYPE.NFT,
        classId: nft2Id,
        instanceId: 1,
      });

      txBuilder.addCmd(nft2TransferCmd);
      return txBuilder.end();
    });

  const transferNft2ByAliceDaoTx = await transferNft2Tx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(transferNft2ByAliceDaoTx);
  const charlieDaoNft2Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(charlieDaoId, ft1Id);
  logJsonResult(`NFT-2 transfered to Charlie Dao balance`, charlieDaoNft2Balance);


  /**
   * Create an InvestmentOpportunity-1 by Alice Dao
   */
  logInfo(`Creating InvestmentOpportunity-1 by Alice Dao ...`);
  const invstOpp1Id = genRipemd160Hash(randomAsHex(20));
  const invstOpp1StartsInMillisecs = 10000;
  const createInvestmentOpportunityTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createInvestmentOpportunityCmd = new CreateInvestmentOpportunityCmd({
        entityId: invstOpp1Id,
        teamId: aliceDaoId,
        startTime: Date.now() + invstOpp1StartsInMillisecs,
        endTime: Date.now() + 3e6,
        projectId: project1Id, // TODO: infer projects from 'shares' for Graphene
        shares: [{ "id": ft1Id, "symbol": "NFT1", "precision": 2, "amount": "10000" }],
        softCap: { "id": stablecoin1Id, "symbol": "USDD", "precision": 2, "amount": "3000" },
        hardCap: { "id": stablecoin1Id, "symbol": "USDD", "precision": 2, "amount": "5000" }
      });
      txBuilder.addCmd(createInvestmentOpportunityCmd);
      return txBuilder.end();
    });
  const createInvestmentOpportunityByAliceDaoTx = await createInvestmentOpportunityTx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(createInvestmentOpportunityByAliceDaoTx);
  const invstOpp1 = await rpc.getInvestmentOpportunityAsync(invstOpp1Id);
  logJsonResult(`InvestmentOpportunity-1 created`, invstOpp1);

  logInfo(`Waiting for InvestmentOpportunity-1 activation time ...\n`);
  await waitAsync(invstOpp1StartsInMillisecs + config.CHAIN_BLOCK_INTERVAL_MILLIS);



  /**
   * Invest some Stabelcoin-1 to InvestmentOpportunity-1 to obtain some FT-1 by Bob Dao
   */
  logInfo(`Investing to InvestmentOpportunity-1 by Bob Dao ...`);
  const investToInvestmentOpportunity1ByBobTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const investCmd = new InvestCmd({
        investmentOpportunityId: invstOpp1Id,
        investor: bobDaoId,
        asset: { "id": stablecoin1Id, "symbol": "USDD", "precision": 2, "amount": 2000, type: 1 }
      });
      txBuilder.addCmd(investCmd);
      return txBuilder.end();
    });

  const investToInvestmentOpportunity1ByBobDaoTx = await investToInvestmentOpportunity1ByBobTx.signAsync(bob.getPrivKey(), api);
  await sendTxAndWaitAsync(investToInvestmentOpportunity1ByBobDaoTx);
  logSuccess(`Invested to InvestmentOpportunity-1 by Bob Dao\n`);



  /**
   * Invest some Stabelcoin-1 to InvestmentOpportunity-1 to obtain some FT-1 by Eve Dao
   */
  logInfo(`Investing to InvestmentOpportunity-1 by Eve Dao ...`);
  const investToInvestmentOpportunity1ByEveTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const investCmd = new InvestCmd({
        investmentOpportunityId: invstOpp1Id,
        investor: eveDaoId,
        asset: { "id": stablecoin1Id, "symbol": "USDD", "precision": 2, "amount": 4000, type: 1 }
      });
      txBuilder.addCmd(investCmd);
      return txBuilder.end();
    });

  const investToInvestmentOpportunity1ByEveDaoTx = await investToInvestmentOpportunity1ByEveTx.signAsync(eve.getPrivKey(), api);
  await sendTxAndWaitAsync(investToInvestmentOpportunity1ByEveDaoTx);
  logSuccess(`Invested to InvestmentOpportunity-1 by Eve Dao\n`);

  const bobDaoFt1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(bobDaoId, ft1Id);
  logJsonResult(`Invested to InvestmentOpportunity-1, FT-1 Bob Dao balance`, bobDaoFt1Balance);
  const eveDaoFt1Balance = await rpc.getFungibleTokenBalanceByOwnerAsync(eveDaoId, ft1Id);
  logJsonResult(`Invested to InvestmentOpportunity-1, FT-1 Eve Dao balance`, eveDaoFt1Balance);
  const aliceDaoFt1Balance2 = await rpc.getFungibleTokenBalanceByOwnerAsync(aliceDaoId, ft1Id);
  logJsonResult(`FT-1 Alice Dao balance after finalized InvestmentOpportunity-1`, aliceDaoFt1Balance2);



  /**
   * Initiate a contract agreement between Alice Dao and Charlie Dao parties to issue a License for Project-1
   */
  logInfo(`Initiate a LicenseAgreement-1 between Alice Dao and Charlie Dao parties ...`);
  const licenseAgreement1Id = genRipemd160Hash(randomAsHex(20));
  const licenseAgreement1SigningActivatesInMillisecs = 10000;
  const createContractAgreement1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createContractAgreementCmd = new CreateContractAgreementCmd({
        entityId: licenseAgreement1Id,
        creator: aliceDaoId,
        parties: [charlieDaoId, aliceDaoId],
        hash: genSha256Hash({ "description": "License Agreement for technology usage between Charlie Dao and Alice Dao parties" }),
        startTime: Date.now() + licenseAgreement1SigningActivatesInMillisecs,
        endTime: Date.now() + 3e6,
        type: CONTRACT_AGREEMENT_TYPE.PROJECT_LICENSE,
        terms: { 
          projectId: project1Id, 
          price: { "id": stablecoin1Id, "symbol": "USDD", "precision": 2, "amount": 2000 } 
        }
      });
      txBuilder.addCmd(createContractAgreementCmd);
      return txBuilder.end();
    });

  const createContractAgreement1ByAliceDaoTx = await createContractAgreement1Tx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(createContractAgreement1ByAliceDaoTx);
  const initiatedLicenseAgreement1 = await rpc.getContractAgreementAsync(licenseAgreement1Id);
  logJsonResult(`LicenseAgreement-1 between Alice Dao and Charlie Dao parties is initiated`, initiatedLicenseAgreement1);

  logInfo(`Waiting for LicenseAgreement-1 signing period activation time ...\n`);
  await waitAsync(licenseAgreement1SigningActivatesInMillisecs + config.CHAIN_BLOCK_INTERVAL_MILLIS);



  /**
   * Accept contract agreement by Alice Dao
   */
  logInfo(`Accepting LicenseAgreement-1 by Alice Dao ...`);
  const acceptContractAgreement1ByAliceTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptContractAgreementCmd = new AcceptContractAgreementCmd({
        entityId: licenseAgreement1Id,
        party: aliceDaoId
      });
      txBuilder.addCmd(acceptContractAgreementCmd);
      return txBuilder.end();
    });
  const acceptContractAgreement1ByAliceDaoTx = await acceptContractAgreement1ByAliceTx.signAsync(alice.getPrivKey(), api);
  await sendTxAndWaitAsync(acceptContractAgreement1ByAliceDaoTx);
  logSuccess(`Accepted LicenseAgreement-1 by Alice Dao\n`);



  /**
   * Accept contract agreement by Charlie Dao
   */
  logInfo(`Accepting LicenseAgreement-1 by Charlie Dao ...`);
  const acceptContractAgreement1ByCharlieTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptContractAgreementCmd = new AcceptContractAgreementCmd({
        entityId: licenseAgreement1Id,
        party: charlieDaoId
      });
      txBuilder.addCmd(acceptContractAgreementCmd);
      return txBuilder.end();
    });
  const acceptContractAgreement1ByCharlieDaoTx = await acceptContractAgreement1ByCharlieTx.signAsync(charlie.getPrivKey(), api);
  await sendTxAndWaitAsync(acceptContractAgreement1ByCharlieDaoTx);
  logSuccess(`Accepted LicenseAgreement-1 by Charlie Dao\n`);

  const finalizedLicenseAgreement1 = await rpc.getContractAgreementAsync(licenseAgreement1Id);
  logJsonResult(`LicenseAgreement-1 between Alice Dao and Charlie Dao parties is finalized`, finalizedLicenseAgreement1);

}


setup()
  .then(() => {
    logInfo('\nRunning Casimir tx-builder...\n');
    return run();
  })
  .then(() => {
    logInfo('Successfully finished !');
    process.exit(0);
  })
  .catch((err) => {
    logError(err);
    process.exit(1);
  });
