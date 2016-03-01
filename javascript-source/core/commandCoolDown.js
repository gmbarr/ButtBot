/**
 * commandCoolDown.js
 *
 * Manage cooldowns for commands
 * Cooldowns are kept per user.
 *
 * To use the cooldown in other scipts use the $.coolDown API
 */

(function () {
    var globalCooldown = ($.inidb.exists('cooldown', 'globalCooldown') ? $.getIniDbBoolean('cooldown', 'globalCooldown') : false),
        globalCooldownTime = ($.inidb.exists('cooldown', 'globalCooldownTime') ? parseInt($.inidb.get('cooldown', 'globalCooldownTime')) : 90),
        modCooldown = ($.inidb.exists('cooldown', 'modCooldown') ? $.getIniDbBoolean('cooldown', 'modCooldown') : false),
        cooldown = [];

    function set (command, time, user) {
        time = (time * 1000) + $.systemTime();

        if (globalCooldown) {
            cooldown.push({
                command: command,
                time: time,
            });
            $.consoleDebug('pushed ' + command + ' to global cooldown.');
            return;
        }

        if ($.inidb.exists('cooldown', command)) {
            cooldown.push({
                command: command,
                time: time,
                user: user,
            });
            $.consoleDebug('pushed ' + command + ' to user cooldown.');
        }
    };

    function get (command, user) {
        if ($.isMod(user) && !modCooldown) {
            return 0;
        }

        var cool,
            i;

        if (globalCooldown) {
            for (i in cooldown) {
                if (cooldown[i].command.equalsIgnoreCase(command)) {
                    cool = cooldown[i].time - $.systemTime();
                    if (cool <= 0) {
                        cooldown.splice(i, 1);
                    }
                    return cool;
                }
            }
            set(command, globalCooldownTime);
            return;
        }

        for (i in cooldown) {
            if (cooldown[i].command.equalsIgnoreCase(command) && cooldown[i].user.equalsIgnoreCase(user)) {
                cool = cooldown[i].time - $.systemTime();
                if (cool <= 0) {
                    cooldown.splice(i, 1);
                }
                return cool;
            }
        }
        set(command, parseInt($.inidb.get('cooldown', command)), user);
    };

    function clear (command) {
        var i;
        for (i in cooldown) {
            if (cooldown[i].command.equalsIgnoreCase(command)) {
                cooldown.splice(i, 1);
                return;
            }
        }
    };

    /**
    * @event command
    */
    $.bind('command', function (event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            cmd = args[0];
            time = parseInt(args[1]);

        /**
        * @commandpath coolcom [command] [time in seconds] - Sets a cooldown for a command. Use -1 for seconds to remove it.
        */
        if (command.equalsIgnoreCase('coolcom') || command.equalsIgnoreCase('cooldown')) {
            if (!$.isAdmin(sender)) {
                $.say($.whisperPrefix(sender) + $.adminMsg);
                return;
            }

            if (!cmd || !time) {
                $.say($.whisperPrefix(sender) + $.lang.get('cooldown.set.usage'));
                return;
            }

            if (time == -1) {
                $.inidb.del('cooldown', cmd);
                clear(cmd);
                $.say($.whisperPrefix(sender) + $.lang.get('cooldown.removed', cmd));
                return;
            } else {
                $.inidb.set('cooldown', cmd, time);
                $.say($.whisperPrefix(sender) + $.lang.get('cooldown.set', cmd, time));
                return;
            }
        }

        /**
        * @commandpath toggleglobalcooldown - Enables/Disables the global command cooldown.
        */
        if (command.equalsIgnoreCase('toggleglobalcooldown')) {
            if (!$.isAdmin(sender)) {
                $.say($.whisperPrefix(sender) + $.adminMsg);
                return;
            }

            globalCooldown = !globalCooldown;
            $.setIniDbBoolean('cooldown', 'globalCooldown', globalCooldown);

            $.say($.whisperPrefix(sender) + $.lang.get('cooldown.global.toggle', (globalCooldown ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
        }

        /**
        * @commandpath globalcooldown [time in seconds] - Sets the global cooldown time.
        */
        if (command.equalsIgnoreCase('globalcooldown')) {
            if (!$.isAdmin(sender)) {
                $.say($.whisperPrefix(sender) + $.adminMsg);
                return;
            }

            if (!cmd) {
                $.say($.whisperPrefix(sender) + $.lang.get('cooldown.global.usage'));
                return;
            }

            $.inidb.set('cooldown', 'globalCooldownTime', parseInt(cmd));
            $.say($.whisperPrefix(sender) + $.lang.get('cooldown.global.set', cmd));
        }

        /**
        * @commandpath togglemodcooldown - Enable/Disable if mod ignores the command cooldown.
        */
        if (command.equalsIgnoreCase('togglemodcooldown')) {
            if (!$.isAdmin(sender)) {
                $.say($.whisperPrefix(sender) + $.adminMsg);
                return;
            }

            modCooldown = !modCooldown;
            $.setIniDbBoolean('cooldown', 'modCooldown', modCooldown);

            $.say($.whisperPrefix(sender) + $.lang.get('cooldown.set.togglemodcooldown', (modCooldown ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
        }
    });

    /**
    * @event initready
    */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./core/commandCoolDown.js')) {
            $.registerChatCommand('./core/commandCoolDown.js', 'coolcom', 1);
            $.registerChatCommand('./core/commandCoolDown.js', 'cooldown', 1);
            $.registerChatCommand('./core/commandCoolDown.js', 'globalcooldown', 1);
            $.registerChatCommand('./core/commandCoolDown.js', 'toggleglobalcooldown', 1);
            $.registerChatCommand('./core/commandCoolDown.js', 'togglemodcooldown', 1);
        }
    });
    /** EXPORT TO $. API*/
    $.coolDown = {
        set: set,
        get: get,
    };
})();
