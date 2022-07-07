import config from '../config';
import { logError, logInfo, logJsonResult } from '../log';
import { randomAsHex } from '@polkadot/util-crypto';
import { genRipemd160Hash } from '@deip/toolbox';
import { ChainService } from '@deip/chain-service';
import fs from 'fs';


const generatePortalId = async (chainService, length = 40) => { //TODO: rpc getLastPortalId
  const result = [];

  const getRandomNum = () => Math.floor(Math.random() * 10);
  for (let i = 0; i < length; i++) {
    result.push(getRandomNum())
  }

  const portalId = result.join("");

  const chainRpc = chainService.getChainRpc();
  const portal = await chainRpc.getPortalAsync(portalId);

  if (!!portal) return generatePortalId(chainService);

  return portalId;
}

const getChainService = (portalId) => ChainService.getInstanceAsync({
  PROTOCOL: config.PROTOCOL,
  DEIP_FULL_NODE_URL: config.DEIP_FULL_NODE_URL,
  CORE_ASSET: config.CORE_ASSET,
  CHAIN_ID: config.DEIP_CHAIN_ID,
  // PORTAL_ID: portalId // needed??
});

const generateUser = async (chainService, username) => {
  const password = genRipemd160Hash(randomAsHex(20)).slice(0, 16);
  const daoId = genRipemd160Hash(randomAsHex(20));
  const user = await chainService.generateChainSeedAccount({ username: username || daoId, password });

  return {
    password,
    daoId,
    user
  }
}

async function run() {
  const { portal } = config.TENANT_GENERATE_PORTAL_CONFIG;

  const chainService = await getChainService();
  const tenantId = portal._id ? portal._id : await generatePortalId(chainService);

  const tenantUser = await generateUser(chainService, `${portal.name}_tenant`);
  const tenantPortalUser = await generateUser(chainService, `${portal.name}_portal`);

  const hotWallet = await generateUser(chainService)

  const TENANT_HOT_WALLET = {
    privKey: hotWallet.user.getPrivKey(),
    daoId: hotWallet.daoId
  };

  const TENANT = {
    id: tenantId,
    privKey: tenantUser.user.getPrivKey(),
    pubKey: tenantUser.user.getPubKey(),
    members: [{
      daoId: tenantUser.daoId,
      password: tenantUser.password
    }]
  };

  const TENANT_PORTAL = {
    privKey: tenantPortalUser.user.getPrivKey(),
    pubKey: tenantPortalUser.user.getPubKey()
  }

  console.log("TENANT", TENANT)
  console.log("TENANT_PORTAL", TENANT_PORTAL)
  console.log("TENANT_HOT_WALLET", TENANT_HOT_WALLET)

  // logJsonResult("TENANT", TENANT);
  // logJsonResult("TENANT_PORTAL", TENANT_PORTAL);

  console.log(`New portal env values:\nTENANT='${JSON.stringify(TENANT)}'\nTENANT_PORTAL='${JSON.stringify(TENANT_PORTAL)}'\nTENANT_HOT_WALLET='${JSON.stringify(TENANT_HOT_WALLET)}'`)

  return {
    TENANT,
    TENANT_PORTAL,
    TENANT_HOT_WALLET
  };
}


run()
  .then((result) => {
    logInfo('Successfully finished!');

    const {
      TENANT,
      TENANT_PORTAL,
      TENANT_HOT_WALLET
    } = result;
    console.log(process.env.NODE_ENV_PATH, 'qqqqqqqqqqqqqqqqqqqq')
    if (process.env.NODE_ENV_PATH) {
      const additionalСonfigData = [
        '\n',
        `TENANT_DATA='${JSON.stringify(TENANT)}'`,
        `TENANT="${TENANT.id}"`,
        `TENANT_PORTAL='${JSON.stringify(TENANT_PORTAL)}'`,
        `TENANT_HOT_WALLET='${JSON.stringify(TENANT_HOT_WALLET)}'`
      ].join('\n');

      fs.appendFileSync(`${__dirname}/${process.env.NODE_ENV_PATH}`, additionalСonfigData)
    }

    return result;
  })
  .catch((err) => {
    logError(err);
    process.exit(1);
  });
