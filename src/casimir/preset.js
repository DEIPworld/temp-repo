import { logInfo, logSuccess, logError, logJsonResult } from './../log';
import { genSha256Hash, genRipemd160Hash } from '@deip/toolbox';
import { PROTOCOL_CHAIN } from '@deip/constants';
import { ChainService } from '@deip/chain-service';
import { u8aToHex } from '@polkadot/util';
import {
  daoIdToSubstrateAddress,
  getFaucetSeedAccount,
  waitAsync
} from './../utils';
import {
  CreateDaoCmd,
  CreatePortalCmd,
  CreateFungibleTokenCmd,
  IssueFungibleTokenCmd,
  TransferFungibleTokenCmd,
  AddDaoMemberCmd
} from '@deip/commands';
import { randomAsHex } from '@polkadot/util-crypto';

export default (config) => {

  async function setup() {
    logInfo(`Setting up Faucet ...`);
    const faucet = await createFaucet();
    logInfo(`Faucet is set`);

    logInfo(`Setting up Tenant Portal ...`);
    const tenant = await createTenantDaoWithPortal();
    logInfo(`Tenant Portal is set`);

    logInfo(`Setting up Tenant Hot wallet ...`);
    const hotWallet = await createHotWalletDao();
    logInfo(`Tenant Hot wallet is set`);


    return {
      faucet,
      tenant,
      hotWallet
    }
  }


  async function getChainService() {
    const chainService = await ChainService.getInstanceAsync({
      PROTOCOL: config.PROTOCOL,
      DEIP_FULL_NODE_URL: config.DEIP_FULL_NODE_URL,
      CORE_ASSET: config.CORE_ASSET,
      CHAIN_ID: config.DEIP_CHAIN_ID,
      PORTAL_ID: config.TENANT_DATA.id
    });
    return chainService;
  }


  async function createFaucet() {
    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const rpc = chainService.getChainRpc();
    const { username: faucetDaoId, wif: faucetSeed } = config.FAUCET_ACCOUNT;

    const existingFaucetDao = await rpc.getAccountAsync(faucetDaoId);
    if (existingFaucetDao)
      return existingFaucetDao;

    const owner = { auths: [], weight: 1 };
    if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL) {
      const seedPubKey = u8aToHex(getFaucetSeedAccount(config.DEIP_APPCHAIN_FAUCET_SUBSTRATE_SEED_ACCOUNT_JSON).publicKey).substring(2);
      owner.auths.push({ key: seedPubKey })
    } else {
      owner.auths.push({ name: faucetDaoId })
    }

    logInfo(`Creating Faucet DAO ...`);
    const createFaucetDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
      .then((txBuilder) => {
        const createDaoCmd = new CreateDaoCmd({
          entityId: faucetDaoId,
          authority: { owner },
          creator: "faucet",
          memoKey: "faucet",
          description: genSha256Hash({ "description": "Faucet DAO" }),
          // offchain
          isTeamAccount: false,
          attributes: []
        });
        txBuilder.addCmd(createDaoCmd);
        return txBuilder.end();
      });

    const createFaucetDaoTxSigned = await createFaucetDaoTx.signAsync(faucetSeed, api);
    await sendTxAndWaitAsync(createFaucetDaoTxSigned);
    const faucetDao = await rpc.getAccountAsync(faucetDaoId);
    logJsonResult(`Faucet DAO created`, faucetDao);

    if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL) {
      const faucetDaoAddress = daoIdToSubstrateAddress(faucetDaoId, api);
      const tx = api.tx.balances.transfer(faucetDaoAddress, config.DEIP_APPCHAIN_FAUCET_BALANCE);
      await tx.signAsync(getFaucetSeedAccount(config.DEIP_APPCHAIN_FAUCET_SUBSTRATE_SEED_ACCOUNT_JSON));
      await api.rpc.author.submitExtrinsic(tx.toHex());
      await waitAsync(config.CHAIN_BLOCK_INTERVAL_MILLIS);
    }

    await createCoreTokenAssetMarker();
    await createFaucetStablecoins();
  }


  async function createTenantDaoWithPortal() {
    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const rpc = chainService.getChainRpc();
    const { id: tenantDaoId, privKey: tenantPrivKey, members } = config.TENANT_DATA;
    const { pubKey: verificationPubKey } = config.TENANT_PORTAL;
    const tenantSeed = await chainService.generateChainSeedAccount({ username: tenantDaoId, privateKey: tenantPrivKey });

    const existingTenantDao = await rpc.getAccountAsync(tenantDaoId);

    if (!existingTenantDao) {
      logInfo(`Creating Tenant DAO ...`);
      await fundAddressFromFaucet(tenantSeed.getPubKey(), config.FAUCET_ACCOUNT.fundingAmount);
      const createTenantDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
        .then((txBuilder) => {
          const createDaoCmd = new CreateDaoCmd({
            entityId: tenantDaoId,
            authority: {
              owner: {
                auths: [{ key: tenantSeed.getPubKey(), weight: 1 }],
                weight: 1
              }
            },
            creator: getDaoCreator(tenantSeed),
            description: genSha256Hash({ "description": "Tenant DAO" }),
            // offchain
            isTeamAccount: true,
            attributes: []
          })
          txBuilder.addCmd(createDaoCmd);
          return txBuilder.end();
        });

      const createTenantDaoBytenantSeedTx = await createTenantDaoTx.signAsync(getDaoCreatorPrivKey(tenantSeed), api);
      await sendTxAndWaitAsync(createTenantDaoBytenantSeedTx);
      await fundAddressFromFaucet(tenantDaoId, config.FAUCET_ACCOUNT.fundingAmount);

      const createdTenantDao = await rpc.getAccountAsync(tenantDaoId);
      logJsonResult(`Tenant DAO created`, createdTenantDao);

      logInfo(`Creating Tenant Portal ...`);
      const createTenantPortalTx = await chainTxBuilder.begin({ ignorePortalSig: true })
        .then((txBuilder) => {
          const createPortalCmd = new CreatePortalCmd({
            owner: tenantDaoId,
            verificationPubKey: verificationPubKey,
            metadata: genSha256Hash({ "description": "DAO delegate" })
          })
          txBuilder.addCmd(createPortalCmd);
          return txBuilder.end();
        });

      const createTenantPortalByTenantTx = await createTenantPortalTx.signAsync(getDaoCreatorPrivKey(tenantSeed), api);
      await sendTxAndWaitAsync(createTenantPortalByTenantTx);
      const portal = await rpc.getPortalAsync(tenantDaoId);
      logJsonResult(`Tenant Portal created`, portal);

      logInfo(`Funding Tenant Portal ...`);
      await fundAddressFromFaucet(verificationPubKey, config.FAUCET_ACCOUNT.fundingAmount);
      logInfo(`End funding Tenant Portal`);
    }

    const tenantDao = await rpc.getAccountAsync(tenantDaoId);
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const { daoId: tenantMemberDaoId, password } = member;
      const tenantMember = await chainService.generateChainSeedAccount({ username: tenantMemberDaoId, password: password });

      const existingTenantMemberDao = await rpc.getAccountAsync(tenantMemberDaoId);
      if (!existingTenantMemberDao) {
        logInfo(`Creating Tenant Member DAO ...`);
        await fundAddressFromFaucet(tenantMember.getPubKey(), config.FAUCET_ACCOUNT.fundingAmount);
        const createTenantMemberDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
          .then((txBuilder) => {
            const createDaoCmd = new CreateDaoCmd({
              entityId: tenantMemberDaoId,
              authority: {
                owner: {
                  auths: [{ key: tenantMember.getPubKey(), weight: 1 }],
                  weight: 1
                }
              },
              creator: getDaoCreator(tenantMember),
              description: genSha256Hash({ "description": "Tenant DAO" }),
              // offchain
              isTeamAccount: false,
              attributes: []
            });

            txBuilder.addCmd(createDaoCmd);
            return txBuilder.end();
          });

        const createTenantMemberDaoBytenantSeedTx = await createTenantMemberDaoTx.signAsync(getDaoCreatorPrivKey(tenantMember), api);
        await sendTxAndWaitAsync(createTenantMemberDaoBytenantSeedTx);
        await fundAddressFromFaucet(tenantMemberDaoId, config.FAUCET_ACCOUNT.fundingAmount);

        const createdTenantMemberDao = await rpc.getAccountAsync(tenantDaoId);
        logJsonResult(`Tenant Member DAO`, createdTenantMemberDao);
      }

      const isMember = tenantDao.authority.owner.auths.some((auth) => auth.daoId == tenantMemberDaoId);
      if (!isMember) {
        logInfo(`Adding Tenant Member DAO ${tenantMemberDaoId} to Tenant DAO ${tenantDaoId} ...`);
        const addTenantMemberDaoToTenantDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
          .then((txBuilder) => {
            const addDaoMemberCmd = new AddDaoMemberCmd({
              teamId: tenantDaoId,
              member: tenantMemberDaoId,
              isThresholdPreserved: true
            });

            txBuilder.addCmd(addDaoMemberCmd);
            return txBuilder.end();
          });
        const addTenantMemberDaoToTenantDaoByTenantDaoTx = await addTenantMemberDaoToTenantDaoTx.signAsync(tenantSeed.getPrivKey(), api);
        await sendTxAndWaitAsync(addTenantMemberDaoToTenantDaoByTenantDaoTx);
      }

    }

    const updatedTenantDao = await rpc.getAccountAsync(tenantDaoId);
    logJsonResult(`Tenant DAO finalized`, updatedTenantDao);
    return {
      tenantDao: updatedTenantDao,
      tenantDaoMembers: members
    };
  }


  async function createHotWalletDao() {
    logInfo(`Creating HotWallet DAO ...`);

    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const rpc = chainService.getChainRpc();

    const hotWalletDaoId = genRipemd160Hash(randomAsHex(20));
    const hotWallet = await chainService.generateChainSeedAccount({ username: hotWalletDaoId, password: randomAsHex(32) });
    await fundAddressFromFaucet(hotWallet.getPubKey(), config.FAUCET_ACCOUNT.fundingAmount);
    const createHotWalletDaoTx = await chainTxBuilder.begin()
      .then((txBuilder) => {
        const createDaoCmd = new CreateDaoCmd({
          entityId: hotWalletDaoId,
          authority: {
            owner: {
              auths: [
                { key: hotWallet.getPubKey(), weight: 1 },
                // { name: moderatorDaoId, weight: 1 }
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

    await fundAddressFromFaucet(hotWalletDaoId, config.FAUCET_ACCOUNT.fundingAmount);
    const hotWalletDao = await rpc.getAccountAsync(hotWalletDaoId);
    logJsonResult(`HotWallet DAO created`, hotWalletDao);

    return hotWalletDao;
  }


  async function createCoreTokenAssetMarker() {
    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const rpc = chainService.getChainRpc();
    const { username: faucetDaoId, wif: faucetSeed } = config.FAUCET_ACCOUNT;

    const coreToken = config.CORE_ASSET;
    const { id: assetId, symbol, precision } = coreToken;

    const existingAsset = await rpc.getFungibleTokenAsync(assetId);
    if (existingAsset) {
      return existingAsset;
    }

    logInfo(`Creating ${symbol} token asset marker ...`);
    const createAndIssueAssetTx = await chainTxBuilder.begin({ ignorePortalSig: true })
      .then((txBuilder) => {
        const maxSupply = 999999999999999;
        const createFungibleTokenCmd = new CreateFungibleTokenCmd({
          entityId: assetId,
          issuer: faucetDaoId,
          name: `Asset ${symbol}`,
          symbol: symbol,
          precision: precision,
          description: "",
          minBalance: 1,
          maxSupply: maxSupply
        });
        txBuilder.addCmd(createFungibleTokenCmd);

        return txBuilder.end();
      });

    const createAndIssueAssetByFaucetDaoTx = await createAndIssueAssetTx.signAsync(faucetSeed, api);
    await sendTxAndWaitAsync(createAndIssueAssetByFaucetDaoTx);
    const asset = await rpc.getFungibleTokenAsync(assetId);
    logJsonResult(`${symbol} asset marker created by ${faucetDaoId} DAO`, asset);

    return asset;
  }


  async function createFaucetStablecoins() {
    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const rpc = chainService.getChainRpc();
    const { username: faucetDaoId, wif: faucetSeed } = config.FAUCET_ACCOUNT;
    const stablecoins = config.DEIP_APPCHAIN_FAUCET_STABLECOINS;

    const assets = [];
    for (let i = 0; i < stablecoins.length; i++) {
      const stablecoin = stablecoins[i];
      const { id: assetId, symbol, precision } = stablecoin;

      const existingAsset = await rpc.getFungibleTokenAsync(assetId);
      if (existingAsset) {
        assets.push(existingAsset);
        continue;
      }

      logInfo(`Creating and issuing ${symbol} asset to ${faucetDaoId} DAO ...`);
      const createAndIssueAssetTx = await chainTxBuilder.begin({ ignorePortalSig: true })
        .then((txBuilder) => {
          const maxSupply = 999999999999999;
          const createFungibleTokenCmd = new CreateFungibleTokenCmd({
            entityId: assetId,
            issuer: faucetDaoId,
            name: `Asset ${symbol}`,
            symbol: symbol,
            precision: precision,
            description: "",
            minBalance: 1,
            maxSupply: maxSupply
          });
          txBuilder.addCmd(createFungibleTokenCmd);

          const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
            issuer: faucetDaoId,
            tokenId: assetId,
            amount: maxSupply,
            recipient: faucetDaoId
          });
          txBuilder.addCmd(issueFungibleTokenCmd);

          return txBuilder.end();
        });

      const createAndIssueAssetByFaucetDaoTx = await createAndIssueAssetTx.signAsync(faucetSeed, api);
      await sendTxAndWaitAsync(createAndIssueAssetByFaucetDaoTx);
      const asset = await rpc.getFungibleTokenAsync(assetId);
      assets.push(asset);
      logJsonResult(`${symbol} asset created and issued to ${faucetDaoId} DAO`, asset);
    }

    return assets;
  }

  function getDaoCreator(seed) {
    const { username: faucetDaoId } = config.FAUCET_ACCOUNT;
    if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL) {
      return seed.getUsername();
    }
    return faucetDaoId;
  }


  function getDaoCreatorPrivKey(seed) {
    const { wif: faucetSeed } = config.FAUCET_ACCOUNT;
    if (PROTOCOL_CHAIN.SUBSTRATE == config.PROTOCOL) {
      return seed.getPrivKey();
    }
    return faucetSeed;
  }


  async function fundAddressFromFaucet(daoIdOrPubKey, amount) {
    if (!amount) return;

    const chainService = await getChainService();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const api = chainService.getChainNodeClient();
    const FAUCET_ACCOUNT = config.FAUCET_ACCOUNT;
    const CORE_ASSET = config.CORE_ASSET;
    const { username: faucetDaoId, wif: faucetSeed } = FAUCET_ACCOUNT;

    const fundDaoTx = await chainTxBuilder.begin({ ignorePortalSig: true })
      .then((txBuilder) => {
        const transferAssetCmd = new TransferFungibleTokenCmd({
          from: faucetDaoId,
          to: daoIdOrPubKey,
          tokenId: CORE_ASSET.id,
          symbol: CORE_ASSET.symbol,
          precision: CORE_ASSET.precision,
          amount: amount
        });

        txBuilder.addCmd(transferAssetCmd);
        return txBuilder.end();
      });

    const fundDaoTxSigned = await fundDaoTx.signAsync(faucetSeed, api);
    await sendTxAndWaitAsync(fundDaoTxSigned);
  }


  async function sendTxAndWaitAsync(finalizedTx, timeout = config.CHAIN_BLOCK_INTERVAL_MILLIS) {
    const chainService = await getChainService();
    const rpc = chainService.getChainRpc();
    const api = chainService.getChainNodeClient();

    const { pubKey: verificationPubKey, privKey: verificationPrivKey } = config.TENANT_PORTAL;
    const { tx } = finalizedTx.getPayload();

    const verifiedTxPromise = tx.isOnBehalfPortal()
      ? tx.verifyByPortalAsync({ verificationPubKey, verificationPrivKey }, api)
      : Promise.resolve(tx.getSignedRawTx());

    const verifiedTx = await verifiedTxPromise;
    await rpc.sendTxAsync(verifiedTx);

    await waitAsync(timeout);
  }


  return {
    setup,

    getChainService,
    getDaoCreator,
    getDaoCreatorPrivKey,
    fundAddressFromFaucet,
    sendTxAndWaitAsync
  }

}