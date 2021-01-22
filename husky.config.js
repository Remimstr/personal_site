module.exports = {
  hooks: {
    "pre-commit": "yarn prettier:write" && "yarn eslint:fix",
  },
};
