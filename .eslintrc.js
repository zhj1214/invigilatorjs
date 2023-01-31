module.exports = {
  globals: {
    wx: true,
    uni: true
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-undef': 'off',
        'prefer-rest-params': 'off'
      }
    },
    // {
    //   files: ['src/*.ts'],
    //   rules: {
    //     strict: 'off'
    //   }
    // },
    {
      files: ['scripts/*.js'],
      env: {
        node: true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {}
}
