module.exports = {
  defaultSeverity: 'error',
  extends: [ 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss' ],
  rules: {
    'unit-no-unknown': [ true, { ignoreUnits: [ 'rpx' ] } ], // 不认识的单位不能使用， 过滤了rpx
    'string-quotes': 'single', // 默认是双引号， 与 prettier 冲突所有改成单引号
    'selector-class-pattern': '^(([a-z][a-z0-9]*)(-[a-z0-9]+)*)$|^(uni([a-z0-9_-]*))$',
    'font-family-no-missing-generic-family-keyword': null,
    'comment-empty-line-before': [ 'always', { ignoreComments: [ '#endif' ] } ], // scss注释，过滤条件编译 #endif
    'scss/at-import-partial-extension': 'always',
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'custom-property-pattern': "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
    'selector-type-no-unknown': [ true, {
      'ignoreTypes': [
        'page',
        '/^uni-/'
      ]
    } ],
    // 忽略伪类选择器 ::v-deep
    "selector-pseudo-element-no-unknown": [ true, {
      "ignorePseudoElements": [ "v-deep" ]
    } ],
  }
}
