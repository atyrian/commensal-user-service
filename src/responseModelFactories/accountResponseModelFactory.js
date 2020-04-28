const accountResponseModelFactory = (user) => {
  const {
    _id: id, _loaded: loaded, _exists: exists, _entityRepository: entityRepository, ...data
  } = user;

  const { attrs: { geohash, match_id, person } } = data.Items[0];

  const response = {
    body: JSON.stringify({
      data: {
        person,
        geohash,
        id,
        match_id,
      },
      status: 200,
    }),
  };

  return response;
};

module.exports = accountResponseModelFactory;
