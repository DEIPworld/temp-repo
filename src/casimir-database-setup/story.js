import PRE_SET from '../casimir/preset';
import config from '../config';
import { logError, logInfo, logJsonResult } from '../log';

import dbDriver from './database';

const {
  setup,
  getChainService,
} = PRE_SET(config);


/**
 * Database setup workflow:
 * Restore dump
 * Patch portal collection with new portal data
 * Patch users-daos collection
 * Patch teams-daos collection
 * TODO: Patch assets collection, update stablecoins
 */

async function run(onChainData) {
  const chainService = await getChainService();

  await dbDriver.dropDatabase();

  logInfo("Trying to restore database data");
  await dbDriver.restoreFromDump();
  logInfo("Database data restored successfully");

  logInfo("Trying to patch portals collection");
  const PORTALS_COLLECTION = "portals"
  const { portal: oldPortal, userDao: oldUserDao } = config.TENANT_DUMP_CONFIG;
  const { portal: portalGeneratorConfig } = config.TENANT_GENERATE_PORTAL_CONFIG;
  const { tenant: { tenantDao, tenantDaoMembers } } = onChainData;

  const portal = await dbDriver.findOne(PORTALS_COLLECTION, { _id: oldPortal._id });
  const portalPatched = {
    ...portal,
    _id: tenantDao.daoId,
    email: portalGeneratorConfig.email,
    name: portalGeneratorConfig.name,
    shortName: portalGeneratorConfig.shortName,
    description: portalGeneratorConfig.description,
    serverUrl: portalGeneratorConfig.serverUrl,
    email: portalGeneratorConfig.email,
    settings: {
      ...portal.settings,
      roles: portal.settings.roles.map(role => ({ ...role, teamId: tenantDao.daoId }))
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await dbDriver.deleteOne(PORTALS_COLLECTION, { _id: oldPortal._id });
  await dbDriver.insertOne(PORTALS_COLLECTION, portalPatched)
  logJsonResult("Portal collection patched successfully", portalPatched);


  logInfo(`Trying to patch portal user-dao`);
  const USER_DAO_COLLECTION = "users-daos";
  const { daoId: tenantMemberDaoId, password: tenantMemberPwd } = tenantDaoMembers[0];
  const tenantMember = await chainService.generateChainSeedAccount({
    username: tenantMemberDaoId,
    password: tenantMemberPwd
  });

  const userDao = await dbDriver.findOne(USER_DAO_COLLECTION, { _id: oldUserDao._id });
  const userDaoPatched = {
    ...userDao,
    _id: tenantMember.getUsername(),
    signUpPubKey: tenantMember.getPubKey(),
    teams: [tenantDao.daoId],
    email: portalGeneratorConfig.email,
    attributes: userDao.attributes.map((atr) => ({
      ...atr,
      value: atr.value.toLowerCase() === oldPortal.name.toLowerCase() ? portalGeneratorConfig.name : atr.value
    })),
    roles: [{ role: "admin", teamId: tenantDao.daoId }],
    portalId: tenantDao.daoId,
    address: tenantMember.getAddress(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await dbDriver.deleteOne(USER_DAO_COLLECTION, { _id: oldUserDao._id });
  await dbDriver.insertOne(USER_DAO_COLLECTION, userDaoPatched)
  logJsonResult("User-dao collection patched successfully", userDaoPatched);


  logInfo(`Trying to patch portal team-dao`);
  const TEAM_DAO_COLLECTION = "teams-daos";

  const team = await dbDriver.findOne(TEAM_DAO_COLLECTION, { _id: oldPortal._id });
  const teamPatched = {
    ...team,
    _id: tenantDao.daoId,
    creator: tenantMember.getUsername(),
    name: portalGeneratorConfig.name,
    members: [tenantMember.getUsername()],
    portalId: tenantDao.daoId,
    address: tenantMember.getAddress(),
  };
  await dbDriver.deleteOne(TEAM_DAO_COLLECTION, { _id: oldUserDao._id });
  await dbDriver.insertOne(TEAM_DAO_COLLECTION, teamPatched);
  logJsonResult("Team-dao collection patched successfully", teamPatched);
}


setup()
  .then((onChainData) => {
    logInfo('\nRunning database setup...\n');
    return run(onChainData);
  })
  .then(() => {
    logInfo('Successfully finished !');
    process.exit(0);
  })
  .catch((err) => {
    logError(err);
    process.exit(1);
  });
