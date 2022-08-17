
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  "extends": [
    "eslint:recommended"
  ],
  rules: {
    indent: ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": [
      "error",
      "unix"
    ],
    quotes: [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018
  }
}
