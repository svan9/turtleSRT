const { Driver, IamAuthService, getLogger, getSACredentialsFromJson } = require('ydb-sdk');

const logger = getLogger({level: 'debug'});

const endpoint = 'grpcs://ydb.serverless.yandexcloud.net:2135';
const database = '/ru-central1/b1g693tdlqlekavm6540/etnkg8e3daqhvcng7dvj';
const authService = new IamAuthService(getSACredentialsFromJson(__dirname + "/authorized_key.json"));

const driver = new Driver({endpoint, database, authService});

(async function() { 
  if (!await driver.ready(10000)) {
    logger.fatal("Driver has not become ready in 10 seconds!");
    process.exit(1);
  }

})();

async function fetchQuery(query) {
  return await driver.tableClient.withSession(async (session) => {
    return session.executeQuery(query);
  });
}

module.exports = { fetchQuery };