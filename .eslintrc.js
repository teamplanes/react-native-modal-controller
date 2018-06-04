module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: ['react', 'react-native'],
  rules: {
    'react/jsx-filename-extension': 0,
    'no-use-before-define': 0,
    'import/no-unresolved': ['error', { ignore: ['^react'] }],
    'import/extensions': ['error', { ignore: ['^react'] }]
  },
};
