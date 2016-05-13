(function() {
    var currentHostTarget = '';

    /**
     * @function contains
     * @export $.list
     * @param {Array} list
     * @param {*} value
     * @param {Number} [subIndex]
     * @returns {boolean}
     */
    function contains(list, value, subIndex) {
        var i;
        for (i in list) {
            if (subIndex > -1) {
                if (list[i][subIndex] == value) {
                    return true;
                }
            } else {
                if (list[i] == value) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * @function isKnown
     * @export $.user
     * @param {string} username
     * @returns {boolean}
     */
    function isKnown(username) {
        return $.inidb.exists('visited', username);
    };

    /**
     * @function isFollower
     * @export $.user
     * @param {string} username
     * @returns {boolean}
     */
    function isFollower(username) {
        var userFollowsCheck;
        if ($.inidb.exists('followed', username)) {
            return true;
        } else {
            userFollowsCheck = $.twitch.GetUserFollowsChannel($.username.resolve(username.toLowerCase()), $.channelName);
            if (userFollowsCheck.getInt('_http') == 200) {
                return true;
            }
        }
        return false;
    };

    /**
     * @function getCurrentHostTarget
     * @export $
     * @returns {string}
     */
    function getCurrentHostTarget() {
        return currentHostTarget
    }

    /**
     * @function strlen
     * @export $
     * @param {string} str
     * @returns {Number}
     */
    function strlen(str) {
        if (str == null || str == undefined) {
            return 0;
        }

        if ((typeof str.length) instanceof java.lang.String) {
            if ((typeof str.length).equalsIgnoreCase('number')) {
                return str.length;
            } else {
                return str.length;
            }
        } else {
            if ((typeof str.length) == 'number') {
                return str.length;
            } else {
                return str.length;
            }
        }
    };

    /**
     * @function say
     * @export $
     * @param {string} message
     */
    function say(message) {
        $.consoleLn('[CHAT] ' + message);
        if ($.channel) {
            if (message.substr(0, 1).equals('.')) {
                $.channel.say(message);
                return;
            }

            if ($.getIniDbBoolean('settings', 'response_@chat')) {
                if ($.getIniDbBoolean('settings', 'response_action') && !message.substr(0, 2).equals('/w')) {
                    $.channel.say('/me ' + message);
                } else {
                    $.channel.say(message);
                }
            }
        }
    };

    /**
     * @function systemTime
     * @export $
     * @returns {Number}
     */
    function systemTime() {
        return parseInt(java.lang.System.currentTimeMillis());
    };

    /**
     * @function rand
     * @export $
     * @param {Number} max
     * @returns {Number}
     */
    function rand(max) {
        if (max == 0) {
            return max;
        }
        $.random = new java.security.SecureRandom();
        return Math.abs($.random.nextInt()) % max;
    };

    /**
     * @function randRange
     * @export $
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randRange(min, max) {
        if (min == max) {
            return min;
        }
        return $.rand(max) + min;
    };

    /**
     * @function randElement
     * @export $
     * @param {Array} array
     * @returns {*}
     */
    function randElement(array) {
        if (array == null) {
            return null;
        }
        return array[$.randRange(0, array.length - 1)];
    };

    /**
     * @function arrayShuffle
     * @param {Array} array
     * @returns {Array}
     */
    function arrayShuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * ( i + 1 ));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * @function randInterval
     * @export $
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * @function trueRandRange
     * @export $
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function trueRandRange(min, max) {
        if (min == max) {
            return min;
        }

        try {
            var HttpRequest = Packages.com.gmt2001.HttpRequest,
                HashMap = Packages.java.util.HashMap,
                JSONObject = Packages.org.json.JSONObject,
                json = new JSONObject('{}'),
                parameters = new JSONObject('{}'),
                header = new HashMap(1),
                id = $.rand(65535),
                request;

            header.put('Content-Type', 'application/json-rpc');

            parameters
                .put('apiKey', '0d710311-5840-45dd-be83-82904de87c5d')
                .put('n', 1)
                .put('min', min)
                .put('max', max)
                .put('replacement', true)
                .put('base', 10);

            json
                .put('jsonrpc', '2.0')
                .put('method', 'generateIntegers')
                .put('params', parameters)
                .put('id', id);

            request = HttpRequest.getData(
                HttpRequest.RequestType.GET,
                'https://api.random.org/json-rpc/1/invoke',
                json.toString(),
                header
            );

            if (request.success) {
                var data = new JSONObject(request.content)
                    .getJSONObject('result')
                    .getJSONObject('random')
                    .getJSONArray('data');

                if (data.length() > 0) {
                    return data.getInt(0);
                }
            } else {
                if (request.httpCode == 0) {
                    $.logError('misc.js', 478, 'Failed to use random.org: ' + request.exception);
                } else {
                    $.logError('misc.js', 480, 'Failed to use random.org: HTTP' + request.httpCode + ' ' + request.content);
                }
            }
        } catch (error) {
            $.logError('misc.js', 484, 'Failed to use random.org: ' + error);
        }

        return $.randRange(min, max);
    };

    /**
     * @function trueRandElement
     * @exprtto $
     * @param {Array} array
     * @returns {*}
     */
    function trueRandElement(array) {
        if (array == null) {
            return null;
        }
        return array[$.trueRand(array.length - 1)];
    };

    /**
     * @function trueRand
     * @export $
     * @param {Number} max
     * @returns {Number}
     */
    function trueRand(max) {
        return $.trueRandRange(0, max);
    };

    /**
     * @function outOfRange
     * @export $
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @returns {boolean}
     */
    function outOfRange(number, min, max) {
        return (number < min && number > max);
    };

    /**
     * @function getOrdinal
     * @export $
     * @param {Number} number
     * @returns {string}
     */
    function getOrdinal(number) {
        var s = ["th", "st", "nd", "rd"],
            v = number % 100;
        return number + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    /**
     * @function getPercentage
     * @export $
     * @param {Number} current
     * @param {Number} total
     * @returns {Number}
     */
    function getPercentage(current, total) {
        return Math.ceil((current / total) * 100);
    };

    /**
     * @function getIniDbBoolean
     * @export $
     * @param {string} fileName
     * @param {string|Number} key
     * @param {boolean} [defaultValue]
     * @returns {boolean}
     */
    function getIniDbBoolean(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return ($.inidb.get(fileName, key) == 'true');
        } else {
            return (defaultValue);
        }
    };

    /**
     * @function getSetIniDbBoolean
     * @export $
     * @param {string} fileName
     * @param {string|Number} key
     * @param {boolean} [defaultValue]
     * @returns {boolean}
     */
    function getSetIniDbBoolean(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return ($.inidb.get(fileName, key) == 'true');
        } else {
            $.inidb.set(fileName, key, defaultValue.toString());
            return (defaultValue);
        }
    };


    /**
     * @function setIniDbBoolean
     * @export $
     * @param {string} fileName
     * @param {string|Number} key
     * @param {boolean} state
     */
    function setIniDbBoolean(fileName, key, state) {
        $.inidb.set(fileName, key, state.toString());
    };

    /**
     * @function getIniDbString
     * @export $
     * @param {string}
     * @param {string}
     * @param {string}
     */
    function getIniDbString(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return ($.inidb.get(fileName, key));
        } else {
            return (defaultValue);
        }
    };

    /**
     * @function getSetIniDbString
     * @export $
     * @param {string}
     * @param {string}
     * @param {string}
     */
    function getSetIniDbString(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return ($.inidb.get(fileName, key));
        } else {
            $.inidb.set(fileName, key, defaultValue);
            return (defaultValue);
        }
    };


    /**
     * @function getIniDbNumber
     * @export $
     * @param {string}
     * @param {string}
     * @param {number}
     */
    function getIniDbNumber(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return parseInt($.inidb.get(fileName, key));
        } else {
            return defaultValue;
        }
    }

    /**
     * @function getSetIniDbNumber
     * @export $
     * @param {string}
     * @param {string}
     * @param {number}
     */
    function getSetIniDbNumber(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return parseInt($.inidb.get(fileName, key));
        } else {
            $.inidb.set(fileName, key, defaultValue.toString());
            return defaultValue;
        }
    }

    /**
     * @function getIniDbFloat
     * @export $
     * @param {string}
     * @param {string}
     * @param {number}
     */
    function getIniDbFloat(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return parseFloat($.inidb.get(fileName, key));
        } else {
            return defaultValue;
        }
    }

    /**
     * @function getSetIniDbFloat
     * @export $
     * @param {string}
     * @param {string}
     * @param {number}
     */
    function getSetIniDbFloat(fileName, key, defaultValue) {
        if ($.inidb.exists(fileName, key)) {
            return parseFloat($.inidb.get(fileName, key));
        } else {
            $.inidb.set(fileName, key, defaultValue.toString());
            return defaultValue;
        }
    }

    /**
     * @function paginateArray
     * @export $
     * @param {Array}   Input array of data to paginate
     * @param {String}  Key in the $.lang system
     * @param {String}  Seperator to use between items
     * @param {boolean} Use $.whisperPrefix(sender) ?
     * @param {String}  Value of sender for $.whisperPrefix
     */
    function paginateArray(array, langKey, sep, whisper, sender) {
        var idx,
            output = '',
            maxlen;

        maxlen = 460 - $.lang.get(langKey).length;
        for (idx in array) {
            output += array[idx];
            if (output.length >= maxlen) {
                if (whisper) {
                    $.say($.whisperPrefix(sender) + $.lang.get(langKey, output));
                } else {
                    $.say($.lang.get(langKey, output));
                }
                output = '';
            } else {
                if (idx < array.length - 1) {
                    output += sep;
                }
            }
        }
        if (whisper) {
            $.say($.whisperPrefix(sender) + $.lang.get(langKey, output));
        } else {
            $.say($.lang.get(langKey, output));
        }
    }

    /** Export functions to API */
    $.list = {
        contains: contains,
    };

    $.user = {
        isKnown: isKnown,
        isFollower: isFollower,
    };

    $.arrayShuffle = arrayShuffle;
    $.getCurrentHostTarget = getCurrentHostTarget;
    $.getIniDbBoolean = getIniDbBoolean;
    $.getIniDbString = getIniDbString;
    $.getIniDbNumber = getIniDbNumber;
    $.getIniDbFloat = getIniDbFloat;
    $.getSetIniDbBoolean = getSetIniDbBoolean;
    $.getSetIniDbString = getSetIniDbString;
    $.getSetIniDbNumber = getSetIniDbNumber;
    $.getSetIniDbFloat = getSetIniDbFloat;
    $.getOrdinal = getOrdinal;
    $.getPercentage = getPercentage;
    $.outOfRange = outOfRange;
    $.rand = rand;
    $.randElement = randElement;
    $.randInterval = randInterval;
    $.randRange = randRange;
    $.say = say;
    $.setIniDbBoolean = setIniDbBoolean;
    $.strlen = strlen;
    $.systemTime = systemTime;
    $.trueRand = trueRand;
    $.trueRandElement = trueRandElement;
    $.trueRandRange = trueRandRange;
    $.paginateArray = paginateArray;
})();
