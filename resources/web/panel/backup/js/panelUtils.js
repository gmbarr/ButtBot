/*
 * Copyright (C) 2016 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @author IllusionaryOne
 */

/*
 * Filename : panelUtils.js
 * Purpose  : Contains utilities for the control panel.
 */
var DEBUG_MODE = false;

var url = window.location.host.split(":");
var addr = 'ws://' + url[0] + ':' + getPanelPort();
var connection = new WebSocket(addr, []);
var isConnected = false;
var panelStatsEnabled = false;

/**
 * @function debugMsg
 * @param {String} message
 */
function debugMsg(message) {
    if (DEBUG_MODE) console.log("WebPanel::" + message);
}

/**
 * @function logMsg
 * @param {String} message
 */
function logMsg(message) {
    console.log("WebPanel::" + message);
}

/**
 * @event connection.onopen
 * Triggered when the WebSocket connection is opened.
 */
connection.onopen = function(data) {
    var jsonObject = {};
    debugMsg("connection.onopen()");
    jsonObject["authenticate"] = getAuth();
    connection.send(JSON.stringify(jsonObject));
    newPanelAlert('Connecting to WebSocket', 'success', 1000);
    isConnected = true;
}

/**
 * @event connection.onclose
 * Triggered when the WebSocket connection is closed by the bot.
 */
connection.onclose = function(data) {
    debugMsg("connection.onclose()");
    newPanelAlert('WebSocket Disconnected - Restart Panel When Restored', 'danger', 0);
    isConnected = false;
}

/**
 * @event connection.onmessage
 * Triggered when a message comes in from the WebSocket. This event is in the other
 * panel JS files as well.
 */
connection.onmessage = function(e) {
    try {
        var messageObject = JSON.parse(e.data);
    } catch (ex) {
        logMsg('connection.onmessage: badJson(' + e.data + '): ' + ex.message);
        return;
    }
    debugMsg("connection.onmessage("+ e.data + ")");

    if (messageObject['authresult'] == false) {
        if (!messageObject['authresult']) {
            isConnected = false;
            newPanelAlert('Authorization Failed! Check Configuration File', 'danger', 0);
            return;
        }
        return;
    }

    // Look for the tag in the return value of the message to route to the proper onMessage handler.
    // If new panels are added a new tag MUST be created and implemented.
    //
    if (e.data.indexOf('dashboard_') !== -1) $.dashboardOnMessage(e);
    if (e.data.indexOf('modules_') !== -1) $.modulesOnMessage(e);
    if (e.data.indexOf('commands_') !== -1) $.commandsOnMessage(e);
    if (e.data.indexOf('moderation_') !== -1) $.moderationOnMessage(e);
    if (e.data.indexOf('cooldown_') !== -1) $.cooldownOnMessage(e);
    if (e.data.indexOf('logging_') !== -1) $.loggingOnMessage(e);
    if (e.data.indexOf('time_') !== -1) $.timeOnMessage(e);
    if (e.data.indexOf('points_') !== -1) $.pointsOnMessage(e);
    if (e.data.indexOf('viewers_') !== -1) $.viewersOnMessage(e);
    if (e.data.indexOf('ranks_') !== -1) $.ranksOnMessage(e);

    if (e.data.indexOf('help_') !== -1) $.helpOnMessage(e);
}

/**
 * @function newPanelAlert
 * @param {String} message
 * @param {String} type (danger, success)
 * @param {Number} timeout (0 = infinite, else timeout in ms)
 */
function newPanelAlert(message, type, timeout) {
    debugMsg("newPanelAlert(" + message + ", " + type + ", " + timeout + ")");
    $(".alert").fadeIn(1000);
    $("#newPanelAlert").show().html('<div class="alert alert-' + type + '"><button type="button" '+
                        'class="close" data-dismiss="alert" aria-hidden="true"></button><span>' + 
                         message + '</span></div>');
    if (timeout != 0) {
        $(".alert-" + type).delay(timeout).fadeOut(1000, function () { $(this).remove(); });
    }
}

/**
 * @function requestVersion
 * @param {String} unique_id
 */
function requestVersion(unique_id) {
    var jsonObject = {};
    jsonObject["version"] = unique_id;
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function sendCommand
 * @param {String} command
 * @param {String} username
 */
function sendCommand(command, username) {
    var jsonObject = {};
    jsonObject["command"] = command;
    if (username) {
        jsonObject["username"] = username;
    }
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function sendDBQuery
 * @param {String} unique_id
 * @param {String} table
 * @param {String} key
 */
function sendDBQuery(unique_id, table, key) {
    jsonObject = {};
    jsonObject["dbquery"] = unique_id;
    jsonObject["query"] = { "table": table, "key": key };
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function sendDBKeys
 * @param {String} unique_id
 * @param {String} table
 */
function sendDBKeys(unique_id, table) {
    jsonObject = {};
    jsonObject["dbkeys"] = unique_id;
    jsonObject["query"] = { "table": table };
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function sendDBUpdate
 * @param {String} unique_id
 * @param {String} table
 * @param {String} key
 * @param {String} value
 */
function sendDBUpdate(unique_id, table, key, value) {
    jsonObject = {};
    jsonObject["dbupdate"] = unique_id;
    jsonObject["update"] = { "table" : table, "key" : key, "value" : value };
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function sendDBDelete
 * @param {String} unique_id
 * @param {String} table
 * @param {String} key
 */
function sendDBDelete(unique_id, table, key) {
    jsonObject = {};
    jsonObject["dbdelkey"] = unique_id;
    jsonObject["delkey"] = { "table" : table, "key" : key };
    connection.send(JSON.stringify(jsonObject));
}

/**
 * @function panelStrcmp
 * @param {String} a
 * @param {String} b
 * @return {Number} match == 0; no match != 0
 */
function panelStrcmp(a, b) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

/**
 * @function panelMatch
 * @param {String} a
 * @param {String} b
 * @return {Boolean}
 */
function panelMatch(a, b) {
   return (panelStrcmp(a, b) === 0);
}
