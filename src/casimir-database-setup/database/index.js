import config from '../../config';
import { logInfo } from '../../log';
import * as mongodbDriver from './mongodb';

const availableDrivers = {
    "mongodb": mongodbDriver
};

const preferredDriver = availableDrivers[config.DB_DRIVER];
if (!preferredDriver) {
    throw new Error(`Selected Database Driver ${config.DB_DRIVER} is not availabe!`)
}
export default preferredDriver;