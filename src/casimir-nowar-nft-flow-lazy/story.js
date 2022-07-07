import config from '../config';
import { logError, logInfo, logJsonResult } from '../log';
import { randomAsHex } from '@polkadot/util-crypto';
import { genRipemd160Hash, genSha256Hash } from '@deip/toolbox';
import { APP_PROPOSAL, PROJECT_CONTENT_TYPES } from '@deip/constants';
import { getDefaultDomain } from '../utils';
import {
  AcceptProposalCmd, AddDaoMemberCmd,
  CreateDaoCmd,
  CreateNonFungibleTokenCmd,
  UpdateNonFungibleTokenTeamCmd,
  UpdateNonFungibleTokenOwnerCmd,
  CreateNftCollectionCmd,
  CreateProposalCmd,
  IssueNonFungibleTokenCmd,
  TransferFungibleTokenCmd,
} from '@deip/commands';

import PRE_SET from '../casimir/preset';

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
  const DAO_SEED_FUNDING_AMOUNT = config.FAUCET_ACCOUNT.fundingAmount
  const DAO_FUNDING_AMOUNT = config.FAUCET_ACCOUNT.fundingAmount;

  /**
   * Create Alice DAO actor
   */
  logInfo(`Creating Alice DAO ...`);
  const alicePwd = randomAsHex(32);
  const aliceDaoId = genRipemd160Hash(randomAsHex(20));
  const alice = await chainService.generateChainSeedAccount({ username: "alice", password: alicePwd });
  await fundAddressFromFaucet(alice.getPubKey(), DAO_SEED_FUNDING_AMOUNT, true);
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
  const bobPwd = randomAsHex(32);
  const bobDaoId = genRipemd160Hash(randomAsHex(20));
  const bob = await chainService.generateChainSeedAccount({ username: "bob", password: bobPwd });
  await fundAddressFromFaucet(bob.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
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


  const aliceDaoCoreAssetBalance1 = await rpc.getFungibleTokenBalanceByOwnerAsync(aliceDaoId, CORE_ASSET.id);
  logJsonResult(`Alice Dao CoreAsset balance after CreateProjectCmd`, aliceDaoCoreAssetBalance1);


  /**
 * Create Moderator multisig DAO actor with a threshold equal to 1 signature
 * MODERATORS DAO
 */
  logInfo(`Creating Moderator multisig DAO ...`);
  const moderatorDaoId = genRipemd160Hash(randomAsHex(20));
  const createModeratorDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: moderatorDaoId,
        authority: {
          owner: {
            auths: [
                { name: aliceDaoId, weight: 1 },
               { name: bobDaoId, weight: 1 }
            ],
            weight: 1
          }
        },
        creator: aliceDaoId,
        description: genSha256Hash({ "description": "Moderator multisig DAO" }),
        // offchain
        isTeamAccount: true,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createModeratorDaoByAliceDaoTx = await createModeratorDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Alice DAO (final)
  await sendTxAndWaitAsync(createModeratorDaoByAliceDaoTx);

  await fundAddressFromFaucet(moderatorDaoId, DAO_FUNDING_AMOUNT);
  const moderatorDao = await rpc.getAccountAsync(moderatorDaoId);
  logJsonResult(`Moderator multisig DAO created`, moderatorDao);

  /**
   * Create Creator DAO actor
   */
  logInfo(`Creating Creator DAO ...`);
  const creatorPwd = randomAsHex(32);
  const creatorDaoId = genRipemd160Hash(randomAsHex(20));
  const creator = await chainService.generateChainSeedAccount({ username: "creator", password: creatorPwd });
  await fundAddressFromFaucet(creator.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const createCreatorDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: creatorDaoId,
        authority: {
          owner: {
            auths: [
              { key: creator.getPubKey(), weight: 1 },
              { name: moderatorDaoId, weight: 1 }
            ],
            weight: 1
          }
        },
        creator: getDaoCreator(creator),
        description: genSha256Hash({ "description": "Creator DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createCreatorDaoByCreatorTx = await createCreatorDaoTx.signAsync(getDaoCreatorPrivKey(creator), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(createCreatorDaoByCreatorTx);

  await fundAddressFromFaucet(creatorDaoId, DAO_FUNDING_AMOUNT);
  // await fundAddressFromFaucet(creatorDaoId, 1);
  const creatorDao = await rpc.getAccountAsync(creatorDaoId);
  logJsonResult(`Creator DAO created`, creatorDao);



  /**
   * Create Buyer DAO actor
   */
  logInfo(`Creating Buyer DAO ...`);
  const buyer = await chainService.generateChainSeedAccount({ username: "buyer", password: randomAsHex(32) });
  await fundAddressFromFaucet(buyer.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const buyerDaoId = genRipemd160Hash(randomAsHex(20));
  const createBuyerDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: buyerDaoId,
        authority: {
          owner: {
            auths: [
              { key: buyer.getPubKey(), weight: 1 },
              { name: moderatorDaoId, weight: 1 }
            ],
            weight: 1
          }
        },
        creator: getDaoCreator(buyer),
        description: genSha256Hash({ "description": "Buyer DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createBuyerDaoByBuyerTx = await createBuyerDaoTx.signAsync(getDaoCreatorPrivKey(buyer), api); // 1st approval from Buyer DAO (final)
  await sendTxAndWaitAsync(createBuyerDaoByBuyerTx);

  await fundAddressFromFaucet(buyerDaoId, DAO_FUNDING_AMOUNT);
  const buyerDao = await rpc.getAccountAsync(buyerDaoId);
  logJsonResult(`Buyer DAO created`, buyerDao);



  /**
   * Create NFT Class-1
   */
  logInfo(`Creating Creator Project-1 NFT Class 1 ...`);
  const nft1Id = await rpc.getNextAvailableNftClassId();;
  const createNftClass1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createNft1Cmd = new CreateNonFungibleTokenCmd({
        entityId: nft1Id,
        issuer: creatorDaoId,
        name: "Non-Fungible Token 1 of Project-1",
        symbol: "NFT1",
        description: "",
      });
      txBuilder.addCmd(createNft1Cmd);

      return txBuilder.end();
    });

  const createNftClass1TxByCreatorDao = await createNftClass1Tx.signAsync(creator.getPrivKey(), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(createNftClass1TxByCreatorDao);
  logJsonResult(`Creator NFT Class 1 created`, nft1Id);

  /**
 * Update NFT Class-1
 */

  logInfo(`Updating Creator Project-1 NFT Class 1 Owner ...`);
  const updateNftClass1OwnerTx = await chainTxBuilder.begin()
    .then((txBuilder) => {

      const updateNft1Cmd = new UpdateNonFungibleTokenOwnerCmd({
        entityId: nft1Id,
        issuer: creatorDaoId,
        owner: moderatorDaoId
      })
      txBuilder.addCmd(updateNft1Cmd);

      return txBuilder.end();
    });

  const updateNftClass1OwnerTxByCreatorDao = await updateNftClass1OwnerTx.signAsync(creator.getPrivKey(), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(updateNftClass1OwnerTxByCreatorDao);
  logInfo(`Creator NFT Class 1 Owner updated`);

  logInfo(`Updating Creator Project-1 NFT Class 1 Team ...`);
  const updateNftClass1TeamTx = await chainTxBuilder.begin()
    .then((txBuilder) => {

      const updateNft1Cmd = new UpdateNonFungibleTokenTeamCmd({
        entityId: nft1Id,
        issuer: moderatorDaoId,

        newAdmin: moderatorDaoId,
        newFreezer: moderatorDaoId,
        newIssuer: moderatorDaoId,
      })
      txBuilder.addCmd(updateNft1Cmd);

      return txBuilder.end();
    });

  const updateNftClass1TeamTxByCreatorDao = await updateNftClass1TeamTx.signAsync(alice.getPrivKey(), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(updateNftClass1TeamTxByCreatorDao);
  logInfo(`Creator NFT Class 1 Team updated`);

  /**
   * Create NFT Class-1 Instance-1
   */
  logInfo(`Creating Creator Project-1 NFT Instance 1 ...`);
  const nft1InstanceId = 1;
  const createNftInstance1Tx = await chainTxBuilder.begin()
  .then((txBuilder) => {
    const issueNft1ToBuyerDaoCmd = new IssueNonFungibleTokenCmd({
      issuer: moderatorDaoId,
      recipient: buyerDaoId,
      classId: nft1Id,
      instanceId: nft1InstanceId,
    });
    
    txBuilder.addCmd(issueNft1ToBuyerDaoCmd);
    return txBuilder.end();
  });
  
  const createNftInstance1TxOnBelalfCreator = await createNftInstance1Tx.signAsync(alice.getPrivKey(), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(createNftInstance1TxOnBelalfCreator);
  logInfo(`Creator NFT Class 1 Instance 1 issued`);
  
  // // /**
  //  * Creating lazy-mint Proposal-1 of Project-1 on behalf of Buyer DAO actor
  //  */
  logInfo(`Creating lazy-mint Proposal-1 on behalf of Buyer DAO actor ...`);
  const proposal1Id = genRipemd160Hash(randomAsHex(20));
  let proposal1BatchWeight;
  const nft2InstanceId = 2;
  const createProposal1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {

      const transferFt1 = new TransferFungibleTokenCmd({
        from: buyerDaoId,
        to: moderatorDaoId,
        tokenId: CORE_ASSET.id,
        symbol: CORE_ASSET.symbol,
        precision: CORE_ASSET.precision,
        amount: "99999"
      });

      const issueNft1ToBuyerDaoCmd = new IssueNonFungibleTokenCmd({
        issuer: moderatorDaoId,
        recipient: buyerDaoId,
        classId: nft1Id,
        instanceId: nft2InstanceId,
      });

      const proposal1Batch = [
        transferFt1,
        issueNft1ToBuyerDaoCmd
      ];

      return chainTxBuilder.getBatchWeight(proposal1Batch)
        .then((batchWeight) => {
          proposal1BatchWeight = batchWeight;

          const createProposalCmd = new CreateProposalCmd({
            entityId: proposal1Id,
            type: APP_PROPOSAL.PROJECT_PROPOSAL,
            creator: buyerDaoId,
            expirationTime: Date.now() + 3e6,
            proposedCmds: proposal1Batch,
          });

          txBuilder.addCmd(createProposalCmd);
          return txBuilder.end();
        })
    });

  const createProposal1ByBuyerDaoTx = await createProposal1Tx.signAsync(buyer.getPrivKey(), api); // lazy-mint proposal created
  await sendTxAndWaitAsync(createProposal1ByBuyerDaoTx);
  const proposal1 = await rpc.getProposalAsync(proposal1Id);
  logJsonResult(`Buyer DAO Proposal-1 created`, proposal1);

  logInfo(`Deciding on Buyer DAO Proposal-1, Moderator DAO approves Proposal-1 ...`);
  // Moderator onBehalf Moderator Dao approves Proposal-1
  const decideOnProposal1ByModeratorDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: moderatorDaoId,
        batchWeight: proposal1BatchWeight,
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const proposal1SignedByAliceDaoTx = await decideOnProposal1ByModeratorDaoTx.signAsync(alice.getPrivKey(), api); // 1st approval from Buyer DAO
  await sendTxAndWaitAsync(proposal1SignedByAliceDaoTx);

  logInfo(`Deciding on Buyer DAO Proposal-1, Buyer DAO approves Proposal-1 ...`);
  // Buyer onBehalf Buyer Dao approves Proposal-1
  const decideOnProposal1ByBuyerDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: buyerDaoId,
        batchWeight: proposal1BatchWeight,
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const proposal1SignedByBuyerDaoTx = await decideOnProposal1ByBuyerDaoTx.signAsync(buyer.getPrivKey(), api); // 2st approval from Creator DAO (final)
  await sendTxAndWaitAsync(proposal1SignedByBuyerDaoTx);

  const moderatorDaoNft1BalanceAfterAllRequiredApprovals = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(moderatorDaoId, nft1Id);
  logJsonResult(`Moderator Dao Nft1 balance after all required approvals`, moderatorDaoNft1BalanceAfterAllRequiredApprovals);

  const creatorBobDaoNft1BalanceAfterAllRequiredApprovals = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(creatorDaoId, nft1Id);
  logJsonResult(`Creator Dao Nft1 balance after all required approvals`, creatorBobDaoNft1BalanceAfterAllRequiredApprovals);

  const buyerBobDaoNft1BalanceAfterAllRequiredApprovals = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(buyerDaoId, nft1Id);
  logJsonResult(`Buyer Dao Nft1 balance after all required approvals`, buyerBobDaoNft1BalanceAfterAllRequiredApprovals);
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
