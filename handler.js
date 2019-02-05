const common = require('commensal-common');
const UserHttpHandler = require('./src/UserHttpHandler');
const AccountHttpHandler = require('./src/AccountHttpHandler');

module.exports.userGet = common.aws.lambdaWrapper(
  (event) => {
    const userHttpHandler = new UserHttpHandler(event);
    return userHttpHandler.get();
  },
);

module.exports.userPost = common.aws.lambdaWrapper(
  (event) => {
    const userHttpHandler = new UserHttpHandler(event);
    return userHttpHandler.post();
  },
);

module.exports.userPut = common.aws.lambdaWrapper(
  (event) => {
    const userHttpHandler = new UserHttpHandler(event);
    return userHttpHandler.put();
  },
);

module.exports.userDelete = common.aws.lambdaWrapper(
  (event) => {
    const userHttpHandler = new UserHttpHandler(event);
    return userHttpHandler.delete();
  },
);

module.exports.accountGet = common.aws.lambdaWrapper(
  (event) => {
    const accountHttpHandler = new AccountHttpHandler(event);
    return accountHttpHandler.get();
  },
);

module.exports.accountPut = common.aws.lambdaWrapper(
  (event) => {
    const accountHttpHandler = new AccountHttpHandler(event);
    return accountHttpHandler.put();
  },
);

module.exports.serviceAuthorizer = common.aws.lambdaWrapper(
  (event) => {
    const authorizer = new common.aws.ServiceAuthorizer(event);
    return authorizer.authorize();
  },
);

module.exports.userAuthorizer = common.aws.lambdaWrapper(
  (event) => {
    const authorizer = new common.aws.UserAuthorizer(event);
    return authorizer.authorize();
  },
);
