angular.module('ny.logger', []).provider('Logger', [function () {
    var isEnabled = true;
    this.enabled = function(_isEnabled) {
        isEnabled = !!_isEnabled;
    };
    this.$get = ['$log', function($log) {
        var Logger = function(context) {
            this.context = context;
        };
        Logger.getInstance = function(context) {
            return new Logger(context);
        };
        Logger.supplant = function(str, o) {
            return str.replace(
                /\{([^{}]*)\}/g,
                function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
        Logger.getFormattedTimestamp = function(date) {
           return Logger.supplant('{0}:{1}:{2}:{3}', [
                date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
                date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
                date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(),
                date.getMilliseconds()
            ]);
        };
        Logger.prototype = {
            _log: function(originalFn, args) {
                if (!isEnabled) {
                    return;
                }

                var objects = [];

                if (args[args.length - 1] !== undefined) {
                    // supplants array
                    var supplantsArray = args[args.length - 1];

                    // filter out all objects
                    for (var i = supplantsArray.length - 1; i >= 0; i--) {
                        var candidate = supplantsArray[i];
                        if (typeof candidate === 'object') {
                            objects.push(candidate);

                            // remove object from supplants array
                            var candidateIndex = supplantsArray.indexOf(candidate);
                            if (candidateIndex > -1) {
                                supplantsArray.splice(candidateIndex, 1);
                            }
                        }
                    }
                }

                var now  = Logger.getFormattedTimestamp(new Date());
                var message = '', supplantData = [];
                switch (args.length) {
                    case 1:
                        message = Logger.supplant("{0} - {1}: {2}", [ now, this.context, args[0] ]);
                        break;
                    case 3:
                        supplantData = args[2];
                        message = Logger.supplant("{0} - {1}::{2}(\'{3}\')", [ now, this.context, args[0], args[1] ]);
                        break;
                    case 2:
                        if (typeof args[1] === 'string') {
                            message = Logger.supplant("{0} - {1}::{2}(\'{3}\')", [ now, this.context, args[0], args[1] ]);
                        } else {
                            supplantData = args[1];
                            message = Logger.supplant("{0} - {1}: {2}", [ now, this.context, args[0] ]);
                        }
                        break;
                }

                // prepare arguments list for log call as array with log message
                var formattedMessage = [ Logger.supplant(message, supplantData) ];

                // call the original $log with all arguments and append all objects that should be logged
                $log[originalFn].apply(null, formattedMessage.concat(objects));
            },
            log: function() {
                this._log('log', arguments);
            },
            info: function() {
                this._log('info', arguments);
            },
            warn: function() {
                this._log('warn', arguments);
            },
            debug: function() {
                this._log('debug', arguments);
            },
            error: function() {
                this._log('error', arguments);
            }
        };
        return Logger;
    }];
}]);