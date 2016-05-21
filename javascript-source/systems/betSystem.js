(function() {
    var betMinimum = $.getSetIniDbNumber('betSettings', 'betMinimum', 1),
        betMaximum = $.getSetIniDbNumber('betSettings', 'betMaximum', 1000),
        betMessageToggle = $.getSetIniDbBoolean('betSettings', 'betMessageToggle', true),
        time = 0,
        betStatus = false,
        betTimerStatus = false,
        betTimer = $.getSetIniDbNumber('betSettings', 'betTimer', 0),
        betPot = 0,
        betOptions = [],
        betTable = [];

    function betOpen(event, bet, timer) {
        var sender = event.getSender(),
            args = event.getArgs(),
            string,
            betOp = '',
            i;

        if (betStatus || betTimerStatus) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.opened'));
            return;
        }

        if (bet.length < 2 && !timer) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.options'));
            return;
        }

        for (i = 0; i < bet.length; i++) {
            betOptions.push(bet[i].toLowerCase().trim());
            if (!isNaN(bet[i])) {
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.open'));
                betOptions = [];
                return;
            }
        }

        string = betOptions.join(' vs ');

        betStatus = true;
        betTimerStatus = true

        $.say($.lang.get('betsystem.opened', string, $.pointNameMultiple));

        if (timer > 0) {
            setTimeout(function () {
                if (betStatus) {
                    $.say($.lang.get('betsystem.auto.close.warn', string));
                }
            }, (betTimer / 2) * 1000);
            setTimeout(function () {
                betTimerStatus = false;
                if (betStatus) {
                    $.say($.lang.get('betsystem.auto.close'));
                }
            }, betTimer * 1000);
        }
    };

    function resetBet() {
        betPot = 0;
        betTotal = 0;
        betWinners = '';
        betOptions = [];
        betTable = [];
        betStatus = false;
    }

    function betClose(sender, event, subAction) {
        var args = event.getArgs(),
            betWinning = subAction,
            betWinPercent = 0,
            betPointsWon = 0,
            betWinners = '',
            betTotal = 0,
            bet,
            a = 0,
            i;

        if (!betStatus) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
            return;
        }

        if (!betWinning && !subAction.equalsIgnoreCase('refundall')) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.win.option'));
            return;
        }

        if (subAction && subAction.equalsIgnoreCase('refundall')) {
            betStatus = false;
            for (i in betTable) {
                bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
            }
            $.say($.lang.get('betsystem.close.refund', $.pointNameMultiple));
            resetBet();
            return;
        }

        if (!$.list.contains(betOptions, betWinning)) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404'));
            return;
        }

        betWinning = subAction.toLowerCase();
        betStatus = false;
        betTimerStatus = false;

        for (i in betTable) {
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betTotal = bet.amount;
            }
        }

        for (i in betTable) {
            a++;
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betPointsWon = (betPot / betTotal);
                if (betPointsWon > 0) {
                    if (betWinners.length > 0) {
                        betWinners += ', ';
                    }
                    betWinners += i;
                }
            }
        }

        /**
         * Disable for now.  Needs to have a different value for
         * betMinimum, right now this is the minimum amount, not
         * minimum users. Could set a default through a set command
         * and perhaps override with !bet open min=num option option
         * 
         * if (a < betMinimum) {
         *   for (i in betTable) {
         *     bet = betTable[i];
         *     $.inidb.incr('points', i, bet.amount);
         *   }
         *
         *   $.say($.lang.get('betsystem.not.enough.ppl'));
         *   resetBet();
         *   return;
         * }
         **/

        if (betTotal == 0) {
            $.say($.lang.get('betsystem.closed.404', betWinning));
            resetBet();
            return;
        }

        if (betPot <= 0) {
            for (i in betTable) {
                bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
            }
            $.say($.lang.get('betsystem.err.points.refunded'));
            resetBet();
            return;
        }

        for (i in betTable) {
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betWinPercent = (bet.amount / betTotal);
                $.inidb.incr('points', i, (betPot * betWinPercent));
            }
        }

        // For the Panel
        $.inidb.set('betresults', 'winners', betWinners);
        $.inidb.set('betresults', 'amount', (betPot * betWinPercent));

        $.say($.lang.get('betsystem.closed', betWinning, $.getPointsString(betPot * betWinPercent)));
        resetBet();
    };

    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1],
            bet = args.slice(1);

        /**
         * @commandpath bet - Performs bet operations.
         */
        if (command.equalsIgnoreCase('bet')) {
            if (!action) {
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.command.usage'));
                return;
            }

            /**
             * @commandpath bet open [option option option ...] - Opens a bet with options; not allowed to be digits, words only.
             */
            if (action.equalsIgnoreCase('open')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }

                betOpen(event, bet, betTimer);
                return;

                /**
                 * @commandpath bet close [option] - Closes the bet and selects option as the winner.
                 * @commandpath bet close refundall - Closes the bet and refunds all points.
                 */
            } else if (action.equalsIgnoreCase('close')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }
                betClose(sender, event, subAction);
                return;

                /**
                 * @commandpath bet setminimum [value] - Set the minimum value of a bet.
                 */
            } else if (action.equalsIgnoreCase('setminimum')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }

                if (!subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.min.usage'));
                    return;
                }

                betMinimum = parseInt(subAction);
                $.inidb.set('betSettings', 'betMinimum', betMinimum);
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.min', betMinimum, $.pointNameMultiple));
                return;

                /**
                 * @commandpath bet setmaximum [value] - Set the maximum value of a bet.
                 */
            } else if (action.equalsIgnoreCase('setmaximum')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }

                if (!subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.max.usage'));
                    return;
                }

                betMaximum = parseInt(subAction);
                $.inidb.set('betSettings', 'betMaximum', betMaximum);
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.max', betMaximum, $.pointNameMultiple));
                return;

                /**
                 * @commandpath bet settimer [amount in seconds] - Sets a auto close timer for bets
                 */
            } else if (action.equalsIgnoreCase('settimer')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }

                if (!subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.timer.usage'));
                    return;
                }

                betTimer = parseInt(subAction);
                $.inidb.set('betSettings', 'betTimer', betTimer);
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.timer', betTimer));
                return;

                /**
                 * @commandpath togglebetmessage - Toggles the bet enter message
                 */
            } else if (action.equalsIgnoreCase('togglebetmessage')) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.whisperPrefix(sender) + $.modMsg);
                    return;
                }

                if (betMessageToggle) {
                    betMessageToggle = false;
                    $.inidb.set('betSettings', 'betMessageToggle', false);
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.toggle.off'));
                } else if (!betMessageToggle) {
                    betMessageToggle = true;
                    $.inidb.set('betSettings', 'betMessageToggle', true);
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.toggle.on'));
                }
                return;

                /**
                 * @commandpath bet [ [option amount] | [amount option] ]- Places a bet on option, betting an amount of points.
                 */
            } else {
                if (!betStatus) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
                    return;
                }

                var betWager,
                    betOption;

                if (!action || !subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.err'));
                    return;
                }

                if (isNaN(action) && isNaN(subAction)) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404'));
                    return;
                }
                if (isNaN(action) && !isNaN(subAction)) {
                    betWager = parseInt(subAction);
                    betOption = action;
                }
                if (!isNaN(action) && isNaN(subAction)) {
                    betWager = parseInt(action);
                    betOption = subAction;
                }

                if (!$.list.contains(betOptions, betOption.toLowerCase())) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404'));
                    return;
                } else if (betWager < 1) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.neg', $.pointNameMultiple));
                    return;
                } else if (betWager < betMinimum) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.less', $.getPointsString(betMinimum)));
                    return;
                } else if (betWager > betMaximum) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.more', $.getPointsString(betMaximum)));
                    return;
                } else if (parseInt($.getUserPoints(sender.toLowerCase())) < betWager) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.points', $.pointNameMultiple));
                    return;
                }

                for (i in betTable) {
                    if (sender.equalsIgnoreCase(i)) {
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.voted'));
                        return;
                    }
                }

                $.inidb.decr('points', sender, betWager);

                if (betPot == 0) {
                    betPot = betWager;
                } else {
                    betPot = (betPot + betWager);
                }

                betTable[sender] = {
                    amount: betWager,
                    option: betOption
                };

                if (betMessageToggle) {
                    $.say($.lang.get('betsystem.bet.updated', sender, $.getPointsString(betWager), betOption, $.getPointsString(betPot)));
                }
            }
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/betSystem.js')) {
            $.registerChatCommand('./systems/betSystem.js', 'bet', 7);
        }
    });
})();
