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
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ]);
        };
        Logger.prototype = {
            _log: function(originalFn, args) {
                if (!isEnabled) {
                    return;
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

                var params = (isObject(supplantData)) ? [message, supplantData] : [Logger.supplant(message, supplantData)];
                $log[originalFn].apply(null, params);
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

    function isObject(element){
        var elemStr = ( !angular.isUndefined(element) && !angular.isUndefined(element.constructor) ) ? element.constructor.toString() : "";
        return (elemStr.indexOf("Object") > -1);
    }
}]);