!function(){function e(){var e=$.randRange(1,1e3);return 75>=e?4:e>75&&200>=e?3:e>200&&450>=e?2:e>450&&700>=e?1:e>700?0:void 0}function s(s){var a=e(),i=e(),o=e(),r=$.lang.get("slotmachine.result.start",$.username.resolve(s),n[a],n[i],n[o]);return a==i&&i==o?(r+=$.lang.get("slotmachine.result.win",parseInt($.getPointsString(t[a]))),$.inidb.incr("points",s,t[a]),void $.say(r+$.gameMessages.getWin(s))):a==i||i==o||o==a?(r+=$.lang.get("slotmachine.result.win",$.getPointsString(Math.floor(t[Math.min(a,i,o)]/3))),$.inidb.incr("points",s,Math.floor(t[Math.min(a,i,o)]/3)),void $.say(r+$.gameMessages.getWin(s))):void $.say(r+$.gameMessages.getLose(s))}var n=["Kappa","KappaPride","BloodTrail","ResidentSleeper","deIlluminati"],t=[75,150,300,450,1e3];$.bind("command",function(e){var n=(e.getCommand()+"").toLowerCase(),t=e.getSender().toLowerCase();n.equalsIgnoreCase("slot")&&s(t)}),$.bind("initReady",function(){$.bot.isModuleEnabled("./games/slotMachine.js")&&$.registerChatCommand("./games/slotMachine.js","slot",7)}),$.bot.isModuleEnabled("./games/slotMachine.js")&&!$.bot.isModuleEnabled("./systems/pointSystem.js")&&$.logError("slotMachine.js",88,"Disabled. ./systems/pointSystem.js is not enabled.")}();
