import { MongoClient } from 'mongodb';
import config from '../../config';
import { logInfo, logJsonResult } from '../../log';

const getMongorestorePromise = (params) => new Promise((resolve, reject) => {
    const { uri, dumpFilePath, toDbName, fromDbName } = params;
    const restoreCmd = `mongorestore`;
    const restoreCmdOptions = [
        `--uri='${uri}'`,
        `--nsFrom='${fromDbName}.*'`,
        `--nsTo='${toDbName}.*'`,
        "--gzip",
        `--archive='${dumpFilePath}'`,
    ];
    console.log("restore cmd", `${restoreCmd} ${restoreCmdOptions.join(' ')}`);
    try {
        const restore = require('child_process').spawnSync(
            restoreCmd,
            restoreCmdOptions,
            { shell: true }
        );

        if (restore.status === 0) {
            resolve({
                message: `file: ${dumpFilePath} restored`,
                dumpFilePath,
                status: restore.status,
                stdout: restore.stdout.toString(),
                stderr: restore.stderr.toString()
            });
        } else if (restore.error && restore.error.code === "ENOENT") {
            reject({ error: 'COMMAND_NOT_FOUND', message: `Binary ${restoreCmd} not found` });
        } else {
            reject({ error: 'COMMAND_ERROR', message: restore.error, status: restore.status, stdout: restore.stdout.toString(), stderr: restore.stderr.toString() });
        }
    } catch (exception) {
        reject({ error: 'COMMAND_EXCEPTION', message: exception });
    }
});

const restoreFromDump = async () => {
    if (config.TENANT_PORTAL_READ_MODELS_STORAGE) {
        logInfo(`Creating Read Models storage ...`);
        const mongorestorePromise = getMongorestorePromise(config.TENANT_PORTAL_READ_MODELS_STORAGE)
            .then((success) => {
                console.info("success", success.message);
                if (success.stderr) {
                    console.info("stderr:\n", success.stderr); // mongorestore binary write details on stderr
                }
            })
            .catch((err) => console.error("error", err));

        await mongorestorePromise;
        logInfo(`Read Models storage created`);
    } else {
        logInfo(`Read Models storage is not specified`);
    }
}

const performOperation = (operationFunc) => (...operationParams) => {
    const { toDbName, uri } = config.TENANT_PORTAL_READ_MODELS_STORAGE;
    const client = new MongoClient(uri);
    return new Promise(async (res, rej) => {
        await client.connect();

        const result = await operationFunc(...operationParams)(client.db(toDbName))
            .catch(rej)
            .then(res);

        await client.close();
    })
}

const deleteOneOperationFunc = (collection, query) =>
    dbClient => dbClient.collection(collection).deleteOne(query);

const findOneOperationFunc = (collection, query) =>
    dbClient => dbClient.collection(collection).findOne(query)

const insertOneOperationFunc = (collection, data) =>
    dbClient => dbClient.collection(collection).insertOne(data)

const dropDataOperationFunc = () =>
    dbClient => dbClient.dropDatabase();

const dropDatabase = performOperation(dropDataOperationFunc);
const findOne = performOperation(findOneOperationFunc);
const deleteOne = performOperation(deleteOneOperationFunc);
const insertOne = performOperation(insertOneOperationFunc);



export {
    restoreFromDump,
    findOne,
    deleteOne,
    insertOne,
    dropDatabase
};
