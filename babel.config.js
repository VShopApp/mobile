module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: ["react-native-reanimated/plugin"],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
};
