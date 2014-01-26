#angular-ny-logger

> AngularJS Logger service provider

## Getting Started

This is a AngularJS Logger service provider plugin. After integrating this service with your application you will be able to get informative logs as well as turn them off in production. 

More information can be found here: <a href="http://www.webdeveasy.com/logger-for-angularjs" target="_blank">http://www.webdeveasy.com/logger-for-angularjs</a>

## Usage

1. Include angular-ny-logger.js in your JavaScript files.
2. Add `ny.logger` module as a dependency to your module:

    ```
    angular.module('YourModule', ['ny.logger'])
    ```

3. Make a configuration block that turns on or off logging:

    ```
    module.config(['LoggerProvider', function(LoggerProvider) {
        // We don't want the Logger service to be enabled in production
        LoggerProvider.enabled(!isProduction);
    }]);
    ```

4. Start logging like a pro with informative logs:

    ```
    module.controller('ExampleController', ['Logger', function(Logger) {
        var logger = Logger.getInstance('ExampleController');
        logger.log('This is a log');
        logger.warn('warn', 'This is a warn');
        logger.error('This is a {0} error! {1}', [ 'big', 'just kidding' ]);
        logger.debug('debug', 'This is a debug for line {0}', [ 8 ]);
    }]);
	```
	
* * *

Copyright (c) 2014 naorye