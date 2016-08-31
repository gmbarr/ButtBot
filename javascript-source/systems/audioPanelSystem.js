/**
 * audioPanelSystem.js
 *
 * Play audio on the PhantomBot Control Panel Audio Panel
 */
(function() {
    var messageToggle = $.getSetIniDbBoolean('settings', 'audiohookmessages', false);

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            subCommand = args[0],
            audioHook = args[1],
            audioHookListStr;

        /**
         * @commandpath audiohook [play | list] - Base command for audio hooks.
         * @commandpath audiohook play [audio_hook] - Sends the audio_hook request to the Panel. 
         * @commandpath audiohook list - Lists the audio hooks.
         * @commandpath audiohook togglemessages - Enables the success message once a sfx is sent.
         */
        if (command.equalsIgnoreCase('audiohook')) {
            var hookKeys = $.inidb.GetKeyList('audio_hooks', ''),
                hookList = [],
                idx;

            for (idx in hookKeys) {
                hookList[hookKeys[idx]] = hookKeys[idx];
            }

            if (subCommand === undefined) {
                $.say($.whisperPrefix(sender) + $.lang.get('audiohook.usage'));
                $.returnCommandCost(sender, command, $.isModv3(sender, event.getTags()));
                return;
            }

            if (subCommand.equalsIgnoreCase('play')) {
                if (audioHook === undefined) {
                    $.say($.whisperPrefix(sender) + $.lang.get('audiohook.play.usage'));
                    $.returnCommandCost(sender, command, $.isModv3(sender, event.getTags()));
                    return;
                }

                if (hookList[audioHook] === undefined) {
                    $.say($.whisperPrefix(sender) + $.lang.get('audiohook.play.404', audioHook));
                    $.returnCommandCost(sender, command, $.isModv3(sender, event.getTags()));
                    return;
                }
                $.panelsocketserver.triggerAudioPanel(audioHook);
                if (!messageToggle) {
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('audiohook.play.success', audioHook));
            }

            if (subCommand.equalsIgnoreCase('togglemessages')) {
                if (messageToggle) {
                    messageToggle = false;
                    $.inidb.set('settings', 'audiohookmessages', messageToggle);
                } else {
                    messageToggle = true;
                    $.inidb.set('settings', 'audiohookmessages', messageToggle);
                }
                $.say($.whisperPrefix(sender) + $.lang.get('audiohook.toggle', messageToggle));
                return;
            }

            if (subCommand.equalsIgnoreCase('list')) {
                if (args[1] === undefined) {
                    var totalPages = $.paginateArray(hookKeys, 'audiohook.list', ', ', true, sender, 1);
                    $.say($.whisperPrefix(sender) + $.lang.get('audiohook.list.total', totalPages));
                } else if (isNaN(args[1])) {
                    var totalPages = $.paginateArray(hookKeys, 'audiohook.list', ', ', true, sender, 1);
                    $.say($.whisperPrefix(sender) + $.lang.get('audiohook.list.total', totalPages));
                } else {
                    $.paginateArray(hookKeys, 'audiohook.list', ', ', true, sender, parseInt(args[1]));
                }
                return;
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/audioPanelSystem.js')) {
            $.registerChatCommand('./systems/audioPanelSystem.js', 'audiohook', 2);
        }
    });
})();
