const userResponseModelFactory = (user) => {
  const {
    _id: id, _loaded: loaded, _exists: exists, _entityRepository: entityRepository, ...data
  } = user;

  const response = {
    body: JSON.stringify({
      data,
      code: 200,
    }),
  };

  return response;
};

module.exports = userResponseModelFactory;
