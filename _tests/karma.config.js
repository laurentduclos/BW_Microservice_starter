module.exports = function (config) {
  config.set({
    browsers: [ 'ChromeCanary' ], //run in Chrome
    //singleRun: true, //just run once by default
    frameworks: [ 'mocha' ], //use the mocha test framework
    files: [
      'index.js' //just load this file
    ],
    plugins: [ 'karma-chai', 'karma-mocha',
      'karma-sourcemap-loader', 'karma-coverage',
      'karma-mocha-reporter'
    ],
    preprocessors: {
      'index.js': [ 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'mocha', 'coverage' ], //report results in this format

    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'coverage2/' //path to created html doc
    }
  });
};