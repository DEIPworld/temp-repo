import config from './config';
import { randomAsHex } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/api';
import { SubstrateChainUtils } from '@deip/chain-service';



const toHexFormat = (id) => {
  const hexId = id.indexOf(`0x`) === 0 ? id : `0x${id}`;
  return hexId;
}


const getFaucetSeedAccount = () => {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.createFromJson(config.DEIP_APPCHAIN_FAUCET_SUBSTRATE_SEED_ACCOUNT_JSON);
  keyringPair.unlock();
  return keyringPair;
}


const genSeedAccount = (username, seed = randomAsHex(32)) => {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.addFromUri(seed, { username });
  return keyringPair;
}


const substratePubKeyToAddress = (pubKey) => {
  const address = SubstrateChainUtils.pubKeyToAddress(toHexFormat(pubKey));
  return address;
}


const substrateAddressToPubKey = (address) => {
  return SubstrateChainUtils.addressToPubKey(address);
}


const daoIdToSubstrateAddress = (daoId, api) => {
  const address = SubstrateChainUtils.daoIdToAddress(toHexFormat(daoId), api.registry);
  return address;
}


const getSubstrateMultiAddress = (addresses, threshold) => {
  const multiAddress = SubstrateChainUtils.getMultiAddress(addresses, threshold);
  return multiAddress;
}


const isSubstrateAddress = (val) => {
  return SubstrateChainUtils.isAddress(val);
}

const getDefaultDomain = () => {
  const defaultDomainId = `0x6225314ed224d2b25a22f01a34af16d3354d556c`;
  return defaultDomainId; 
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const waitAsync = (timeout) => {
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(() => resolve(), timeout);
    } catch (err) {
      reject(err);
    }
  });
}



export {
  getFaucetSeedAccount,
  genSeedAccount,
  daoIdToSubstrateAddress,
  substratePubKeyToAddress,
  isSubstrateAddress,
  substrateAddressToPubKey,
  getSubstrateMultiAddress,
  getDefaultDomain,
  toHexFormat,
  capitalize,
  waitAsync
}