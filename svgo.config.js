const svgo = require('svgo');

const svgoConfig = {
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeDimensions: true,
    },
  ],
};

module.exports = svgoConfig;
