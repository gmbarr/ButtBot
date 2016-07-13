(function() {
    var playTime = null;
    var lastGame = null;
    var currentGame = null;
    var interval;

    /**
     * @function updatePlayTime()
     */
    function updatePlayTime() {
        if ($.twitchcache.isStreamOnlineString().equals('false')) {
            playTime = null;
            currentGame = null;

            if ($.bot.isModuleEnabled('./handlers/panelHandler.js')) {
                $.inidb.set('panelstats', 'playTimeStart', 0);
            }
            return;
        }

        currentGame = $.getGame($.channelName);

        if (currentGame != null && lastGame != currentGame) {
            lastGame = currentGame;
            playTime = $.systemTime();

            $.inidb.set('panelstats', 'playTimeStart', playTime);
        }
    };

    /**
     * @function getPlayTimeGame()
     * @export $
     */
    function getPlayTimeGame() {
        if (currentGame == null) {
            return "Some Game";
        }
        return currentGame;
    };

    /**
     * @function getPlayTime()
     * @export $
     */
    function getPlayTime() {
        var t = parseInt($.inidb.get('panelstats', 'playTimeStart'));
        if (t != 0 && t != null) {
            var time = ($.systemTime() - playTime);
            return $.getTimeStringMinutes(time / 1000);
        } else {
            return getStreamUptime($.channelName);
        }
    };

    /**
     * @function isOnline
     * @export $
     * @param {string} channelName
     * @returns {boolean}
     */
    function isOnline(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            return $.twitchcache.isStreamOnlineString().equals('true');
        } else {
            return !$.twitch.GetStream(channelName).isNull('stream');
        }
    };

    /**
     * @function getStatus
     * @export $
     * @param {string} channelName
     * @returns {string}
     */
    function getStatus(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            return ($.twitchcache.getStreamStatus() + '');
        } else {
            var channelData = $.twitch.GetChannel(channelName);

            if (!channelData.isNull('status')) {
                return channelData.getString('status');
            }
            return '';
        }
    };

    /**
     * @function getGame
     * @export $
     * @param channelName
     * @returns {string}
     */
    function getGame(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            return ($.twitchcache.getGameTitle() + '');
        } else {
            var channelData = $.twitch.GetChannel(channelName);

            if (!channelData.isNull('game')) {
                return channelData.getString("game");
            }
            return '';
        }
    };

    /**
     * @function getStreamUptimeSeconds
     * @export $
     * @param channelName
     * @returns {number}
     */
    function getStreamUptimeSeconds(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            return $.twitchcache.getStreamUptimeSeconds();
        } else {
            var stream = $.twitch.GetStream(channelName),
                now = new Date(),
                createdAtDate,
                time;

            if (stream.isNull('stream')) {
                return 0;
            }

            createdAtDate = new Date(stream.getJSONObject('stream').getString('created_at'));
            if (createdAtDate) {
                time = (now - createdAtDate);
                return Math.floor(time / 1000);
            } else {
                return 0;
            }
        }
    };

    /**
     * @function getStreamUptime
     * @export $
     * @param channelName
     * @returns {string}
     */
    function getStreamUptime(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            var uptime = $.twitchcache.getStreamUptimeSeconds();

            if (uptime === 0) {
                var stream = $.twitch.GetStream(channelName),
                    now = new Date(),
                    createdAtDate,
                    time;
    
                if (stream.isNull('stream')) {
                    return false;
                }

                createdAtDate = new Date(stream.getJSONObject('stream').getString('created_at'));
                time = (now - createdAtDate);
                return $.getTimeString(time / 1000);
            }

            return $.getTimeString(uptime);
        } else {
            var stream = $.twitch.GetStream(channelName),
                now = new Date(),
                createdAtDate,
                time;
    
            if (stream.isNull('stream')) {
                return false;
            }
    
            createdAtDate = new Date(stream.getJSONObject('stream').getString('created_at'));
            if (createdAtDate) {
                time = now - createdAtDate;
                return $.getTimeString(time / 1000);
            } else {
                return false;
            }
        }
    };

    /**
     * @function getStreamDownTime
     * @export $
     * @returns {string}
     */
    function getStreamDownTime() {
        var now = $.systemTime(),
            down = $.inidb.get('streamInfo', 'downtime'),
            time;

        if (down > 0) {
            time = (now - down);
            return $.getTimeString(time / 1000);
        }
        return 0;
    }

    /**
     * @function getStreamStartedAt
     * @export $
     * @param channelName
     * @returns {string}
     */
    function getStreamStartedAt(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            if ($.twitchcache.getStreamOnlineString === 'false') {
                return 'Stream is offline';
            }
            createdAtDate = new Date($.twitchcache.getStreamCreatedAt() + '');
            return $.dateToString(createdAtDate);
        } else {
            var stream = $.twitch.GetStream(channelName),
                createdAtDate;

            if (stream.isNull('stream')) {
                return 'Stream is offline';
            }
    
            createdAtDate = new Date(stream.getJSONObject('stream').getString('created_at'));
            return $.dateToString(createdAtDate);
        }
    };

    /**
     * @function getViewers
     * @export $
     * @param channelName
     * @returns {Number}
     */
    function getViewers(channelName) {
        if ($.twitchCacheReady.equals('true') && channelName.equalsIgnoreCase($.channelName)) {
            return $.twitchcache.getViewerCount();
        } else {
            var stream = $.twitch.GetStream(channelName);

            if (!stream.isNull('stream')) {
                return parseInt(stream.getJSONObject('stream').getInt('viewers'));
            } else {
                return 0;
            }
        }
    };

    /**
     * @function getFollows
     * @export $
     * @param channelName
     * @returns {Number}
     */
    function getFollows(channelName) {
        var channel = $.twitch.GetChannel(channelName);

        if (!channel.isNull('followers')) {
            return parseInt(channel.getInt('followers'));
        } else {
            return 0;
        }
    };

    /**
     * @function getFollowAge
     * @export $
     * @param username
     * @param channelName
     * @returns {Number}
     */
    function getFollowAge (username, channelName) {
        var user = $.twitch.GetUserFollowsChannel(username, channelName),
            followedAt = new Date(user.getString('created_at')),
            now = new Date(followedAt).getTime();

        if (followedAt) {
            return parseInt($.getLongTimeString(now));
        } else {
            return username + ' is not following';
        }
    }

    /**
     * @function getChannelAge
     * @export $
     * @param event
     * @returns {Number}
     */
    function getChannelAge(event) {
        var channelData = $.twitch.GetChannel((!event.getArgs()[0] ? event.getSender() : event.getArgs()[0])),
            created_at = new Date(channelData.getString('created_at')),
            time = $.getLongTimeString(created_at, true);

        if (channelData) {
            var user = (!event.getArgs()[0] ? $.username.resolve(event.getSender()) : $.username.resolve(event.getArgs()[0]));
            $.say($.lang.get('common.get.age', user, time, $.dateToString(created_at)));
        }
    };

    /**
     * @function updateGame
     * @export $
     * @param {string} channelName
     * @param {string} game
     * @param {string} sender
     * @param {boolean} silent
     */
    function updateGame(channelName, game, sender, silent) {
        var http = $.twitch.UpdateChannel(channelName, '', game);

        if (http.getBoolean('_success')) {
            if (http.getInt('_http') == 200) {
                $.twitchcache.setGameTitle(http.getString('game'));
                $.inidb.set('streamInfo', 'game', http.getString('game'));
                if (!silent) {
                    $.say('Changed the game to "' + http.getString('game') + '"!');
                }
                $.log.event($.username.resolve(sender) + ' changed the current game to ' + http.getString('game'));

                if ($.bot.isModuleEnabled('./commands/deathctrCommand.js')) {
                    $.deathUpdateFile(game);
                }
            } else {
                $.say($.whisperPrefix(sender) + 'Failed to change the game. Make sure you have your api oauth code set. https://phantombot.net/oauth');
                $.consoleDebug(http.getString('message'));
                $.log.error(http.getString('message'));
            }
        } else {
            $.say($.whisperPrefix(sender) + 'Failed to change the game. Make sure you have your api oauth code set. https://phantombot.net/oauth');
            $.consoleDebug(http.getString('_exception') + ' ' + http.getString('_exceptionMessage'));
            $.log.error(http.getString('_exception') + ' ' + http.getString('_exceptionMessage'));
        }
    };

    /**
     * @function updateStatus
     * @export $
     * @param {string} channelName
     * @param {string} status
     * @param {string} sender
     * @param {boolean} silent
     */
    function updateStatus(channelName, status, sender, silent) {
        var http = $.twitch.UpdateChannel(channelName, status, '');

        if (http.getBoolean('_success')) {
            if (http.getInt('_http') == 200) {
                $.twitchcache.setStreamStatus(http.getString('status'));
                $.inidb.set('streamInfo', 'title', http.getString('status'));
                if (!silent) {
                    $.say('Changed the title to "' + http.getString('status') + '"!');
                }
                $.log.event(sender + ' changed the current status to ' + http.getString('status'));
            } else {
                $.say($.whisperPrefix(sender) + 'Failed to change the status. Make sure you have your api oauth code set. https://phantombot.net/oauth');
                $.consoleDebug(http.getString('message'));
                $.log.error(http.getString('message'));
            }
        } else {
            $.say($.whisperPrefix(sender) + 'Failed to change the status. Make sure you have your api oauth code set. https://phantombot.net/oauth');
            $.consoleDebug(http.getString('_exception') + ' ' + http.getString('_exceptionMessage'));
            $.log.error(http.getString('_exception') + ' ' + http.getString('_exceptionMessage'));
        }
    };

    /**
     * Execute the updatePlayTime function.
     */
    interval = setInterval(function() {
        updatePlayTime();
    }, 6e4);

    /** Export functions to API */
    $.getPlayTime = getPlayTime;
    $.getPlayTimeGame = getPlayTimeGame;
    $.getFollows = getFollows;
    $.getGame = getGame;
    $.getStatus = getStatus;
    $.getStreamStartedAt = getStreamStartedAt;
    $.getStreamUptime = getStreamUptime;
    $.getStreamUptimeSeconds = getStreamUptimeSeconds;
    $.getViewers = getViewers;
    $.isOnline = isOnline;
    $.updateGame = updateGame;
    $.updateStatus = updateStatus;
    $.getFollowAge = getFollowAge;
    $.getChannelAge = getChannelAge;
    $.getStreamDownTime = getStreamDownTime;
})();
