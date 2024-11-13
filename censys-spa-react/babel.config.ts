// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',      // Ensures that ES module features are correctly transformed
    '@babel/preset-react',
    "@babel/preset-typescript"     // For React JSX support
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs', // Transform ES Modules to CommonJS (for Jest compatibility)
    '@babel/plugin-syntax-import-meta',  // For handling `import.meta` in your code
    '@babel/plugin-transform-runtime'         
  ]
};
