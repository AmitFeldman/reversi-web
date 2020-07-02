const {alias} = require('react-app-rewire-alias');

// Need to override create-react-app config that blocks path aliasing
module.exports = function override(config) {
  alias({
    'reversi-types': '../reversi-types/src',
  })(config);

  return config;
};
