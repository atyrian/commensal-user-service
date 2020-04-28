const userResponseModelFactory = (user) => {
  const {
    _id: id, _loaded: loaded, _exists: exists, _entityRepository: entityRepository, ...data
  } = user;

  const response = {
    body: JSON.stringify({
      data,
      status: 200,
    }),
    statusCode: 200,
  };

  return response;
};

module.exports = userResponseModelFactory;
