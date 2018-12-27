const common = require('commensal-common');
const UserHttpHandler = require('./src/UserHttpHandler');

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
    // custom authorizer
  },
);

module.exports.serviceAuthorizer = common.aws.lambdaWrapper(
  (event) => {
    const authorizer = new common.aws.ServiceAuthorizer(event);
    return authorizer.authorize();
  },
);
