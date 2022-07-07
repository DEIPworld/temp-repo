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
  TransferNonFungibleTokenCmd,
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
 * Create HotWallet DAO actor
 */
  logInfo(`Creating HotWallet DAO ...`);
  const hotWalletDaoId = genRipemd160Hash(randomAsHex(20));
  const hotWallet = await chainService.generateChainSeedAccount({ username: "hotWallet", password: randomAsHex(32) });
  await fundAddressFromFaucet(hotWallet.getPubKey(), DAO_SEED_FUNDING_AMOUNT);
  const createHotWalletDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createDaoCmd = new CreateDaoCmd({
        entityId: hotWalletDaoId,
        authority: {
          owner: {
            auths: [
              { key: hotWallet.getPubKey(), weight: 1 },
            ],
            weight: 1
          }
        },
        creator: getDaoCreator(hotWallet),
        description: genSha256Hash({ "description": "HotWallet DAO" }),
        // offchain
        isTeamAccount: false,
        attributes: []
      });

      txBuilder.addCmd(createDaoCmd);
      return txBuilder.end();
    });
  const createHotWalletDaoByHotWalletTx = await createHotWalletDaoTx.signAsync(getDaoCreatorPrivKey(hotWallet), api); // 1st approval from HotWallet DAO (final)
  await sendTxAndWaitAsync(createHotWalletDaoByHotWalletTx);

  await fundAddressFromFaucet(hotWalletDaoId, DAO_FUNDING_AMOUNT);
  const hotWalletDao = await rpc.getAccountAsync(hotWalletDaoId);
  logJsonResult(`HotWallet DAO created`, hotWalletDao);



  /**
   * Create NFT Class-1
   */
  logInfo(`Creating Portal Project-1 NFT Class 1 ...`);
  const nft1Id = await rpc.getNextAvailableNftClassId();;
  const createNftClass1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const createNft1Cmd = new CreateNonFungibleTokenCmd({
        entityId: nft1Id,
        issuer: hotWalletDaoId,
        name: "Non-Fungible Token 1 of Project-1",
        symbol: "NFT1",
        description: "",
      });
      txBuilder.addCmd(createNft1Cmd);

      return txBuilder.end();
    });

  const createNftClass1TxByCreatorDao = await createNftClass1Tx.signAsync(hotWallet.getPrivKey(), api); // 1st approval from Creator DAO (final)
  await sendTxAndWaitAsync(createNftClass1TxByCreatorDao);
  logJsonResult(`Portal NFT Class 1 created`, nft1Id);

 
  // /**
  //  * Creating lazy-mint Proposal-1 of Project-1 on behalf of Buyer DAO actor
  //  */
  logInfo(`Creating lazy-buy proposal on behalf of Buyer DAO actor ...`);
  const proposal1Id = genRipemd160Hash(randomAsHex(20));
  let proposal1BatchWeight;
  const nft1InstanceId = 1;
  const createProposal1Tx = await chainTxBuilder.begin()
    .then((txBuilder) => {

      const transferFt = new TransferFungibleTokenCmd({
        from: buyerDaoId,
        to: creatorDaoId,
        tokenId: CORE_ASSET.id,
        symbol: CORE_ASSET.symbol,
        precision: CORE_ASSET.precision,
        amount: "99999"
      });

      const issueNft = new IssueNonFungibleTokenCmd({
        issuer: hotWalletDaoId,
        recipient: buyerDaoId,
        classId: nft1Id,
        instanceId: nft1InstanceId,
      });

      const proposal1Batch = [
        transferFt,
        issueNft
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
            batchWeight
          });

          txBuilder.addCmd(createProposalCmd);

          const acceptProposalCmd = new AcceptProposalCmd({
            entityId: proposal1Id,
            account: buyerDaoId,
            batchWeight: proposal1BatchWeight,
          });
          txBuilder.addCmd(acceptProposalCmd);
          return txBuilder.end();
        })
    });


  const createProposal1ByCreatorDaoTx = await createProposal1Tx.signAsync(buyer.getPrivKey(), api); // lazy-mint proposal created
  await sendTxAndWaitAsync(createProposal1ByCreatorDaoTx);
  const proposal1 = await rpc.getProposalAsync(proposal1Id);
  logJsonResult(`Buyer DAO lazy-buy Proposal-1 created`, proposal1);

  logInfo(`Deciding on Buyer DAO Proposal-1, HotWallet DAO approves Proposal-1 ...`);
  const decideOnProposal1ByHotWalletDaoTx = await chainTxBuilder.begin()
    .then((txBuilder) => {
      const acceptProposalCmd = new AcceptProposalCmd({
        entityId: proposal1Id,
        account: hotWalletDaoId,
        batchWeight: proposal1BatchWeight,
      });
      txBuilder.addCmd(acceptProposalCmd);
      return txBuilder.end();
    });

  const proposal1SignedByHotWalletDaoTx = await decideOnProposal1ByHotWalletDaoTx.signAsync(hotWallet.getPrivKey(), api); // 1st approval from Buyer DAO
  await sendTxAndWaitAsync(proposal1SignedByHotWalletDaoTx);

  const hotWalletDaoNft1BalanceAfterAllRequiredApprovals = await rpc.getNonFungibleTokenClassInstancesByOwnerAsync(hotWalletDaoId, nft1Id);
  logJsonResult(`HotWallet Dao Nft1 balance after all required approvals`, hotWalletDaoNft1BalanceAfterAllRequiredApprovals);

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
