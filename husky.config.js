module.exports = {
  "pre-commit": ["yarn prettier:write", "yarn eslint:fix"],
};
