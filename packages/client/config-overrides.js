const {alias} = require('react-app-rewire-alias');

module.exports = function override(config) {

  alias({
    "reversi-types": "../reversi-types/src"
  })(config);

  return config
};
