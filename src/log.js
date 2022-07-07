import chalk from 'chalk';

const logInfo = (msg) => console.info(chalk.cyan(msg));
const logSuccess = (msg) => console.info(chalk.green(msg));
const logError = (msg, err) => console.error(chalk.red(msg), err);
const logWarn = (msg) => console.warn(chalk.yellow(msg));
const logJsonResult = (msg, result, ignoreNull = false) => {
  if (result != null || ignoreNull) {
    logSuccess(`${msg}: \n${JSON.stringify(result)}\n`);
  } else {
    logWarn(`WARNING: Provided result for logging is undefined`);
  }
};


export {
  logInfo,
  logSuccess,
  logError,
  logWarn,
  logJsonResult
}