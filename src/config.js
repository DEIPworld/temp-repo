require('dotenv').config({
  path: __dirname + '/' +
    (process.env.DEIP_CONFIG ? ('.' + process.env.DEIP_CONFIG + '.env') : '.config.env')
});

function parseJsonEnvVar(jsonEnvVarName, defaultValue) {
  const jsonEnvVar = process.env[jsonEnvVarName];
  if (!jsonEnvVar && defaultValue === undefined)
    throw new Error(jsonEnvVarName + " json environment variable is not defined. Specify it in the config or provide a default value");
  return jsonEnvVar ? JSON.parse(jsonEnvVar) : defaultValue;
}

function parseIntEnvVar(intEnvVarName, defaultValue) {
  const intEnvVar = process.env[intEnvVarName];
  if (!intEnvVar && defaultValue === undefined)
    throw new Error(intEnvVarName + " int environment variable is not defined. Specify it in the config or provide a default value");
  return intEnvVar ? parseInt(intEnvVar) : defaultValue;
}

const config = {
  PROTOCOL: parseIntEnvVar('PROTOCOL'),
  DEIP_CHAIN_ID: process.env.DEIP_CHAIN_ID,

  DEIP_FULL_NODE_URL: process.env.DEIP_FULL_NODE_URL,
  CHAIN_BLOCK_INTERVAL_MILLIS: parseIntEnvVar('CHAIN_BLOCK_INTERVAL_MILLIS'),
  FAUCET_ACCOUNT: parseJsonEnvVar('FAUCET_ACCOUNT', { fundingAmount: '0' }),
  DEIP_APPCHAIN_FAUCET_SUBSTRATE_SEED_ACCOUNT_JSON: parseJsonEnvVar('DEIP_APPCHAIN_FAUCET_SUBSTRATE_SEED_ACCOUNT_JSON'),
  CORE_ASSET: parseJsonEnvVar('CORE_ASSET'),
  DEIP_APPCHAIN_FAUCET_STABLECOINS: parseJsonEnvVar('DEIP_APPCHAIN_FAUCET_STABLECOINS', []),
  DEIP_APPCHAIN_FAUCET_BALANCE: process.env.DEIP_APPCHAIN_FAUCET_BALANCE || "0",

  TENANT_DATA: parseJsonEnvVar('TENANT_DATA', {}),
  TENANT: process.env.TENANT,
  TENANT_PORTAL: parseJsonEnvVar('TENANT_PORTAL', {}),
  TENANT_PORTAL_READ_MODELS_STORAGE: parseJsonEnvVar('TENANT_PORTAL_READ_MODELS_STORAGE', null),

  DB_DRIVER: "mongodb",
  TENANT_DUMP_CONFIG: {
    "portal": {
      "_id": "0000000000000000000000000000000000000001",
      "name": "Nowar-testnet"
    },
    "userDao": {
      "_id": "4c583bd4ff9a48d801ea71f2cad6fea123122cf7"
    },
  },
  TENANT_GENERATE_PORTAL_CONFIG: {
    "portal": {
      // "_id": "0000000000000000000000000000000000000001",
      "name": "Nowar-testnet",
      "shortName": "Nowar testnet",
      "description": "Nowar description",
      "serverUrl": "https://nowar.deip.world",
      "email": "nowartestnet@deip.world",
    },
  }
};

module.exports = config;