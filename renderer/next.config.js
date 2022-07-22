const path = require("path");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@firebase/auth": path.resolve(
        __dirname,
        "../node_modules/@firebase/auth/dist/esm2017/index.js"
      ),
    };

    return config;
  },
};
