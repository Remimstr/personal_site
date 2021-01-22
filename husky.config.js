module.exports = {
  hooks: {
    "pre-commit": "yarn eslint:fix && yarn prettier:write",
  },
};
