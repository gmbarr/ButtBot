!function(){function e(){var e=$.randRange(1,1e3);return 75>=e?4:e>75&&200>=e?3:e>200&&450>=e?2:e>450&&700>=e?1:e>700?0:void 0}function s(s){var a,i=e(),o=e(),r=e(),l=$.lang.get("slotmachine.result.start",$.username.resolve(s),n[i],n[o],n[r]);return i==o&&o==r?(l+=$.lang.get("slotmachine.result.win",parseInt($.getPointsString(t[i]))),$.inidb.incr("points",s,t[i]),void $.say(l+$.gameMessages.getWin(s))):i==o||o==r||r==i?(a=Math.floor(t[Math.min(i,o,r)]/3),l+=$.lang.get("slotmachine.result.win",$.getPointsString(a)),$.inidb.incr("points",s,a),void $.say(l+$.gameMessages.getWin(s))):void $.say(l+$.gameMessages.getLose(s))}var n=["Kappa","KappaPride","BloodTrail","ResidentSleeper","deIlluminati"],t=[75,150,300,450,1e3];$.bind("command",function(e){var n=(e.getCommand()+"").toLowerCase(),t=e.getSender().toLowerCase();n.equalsIgnoreCase("slot")&&s(t)}),$.bind("initReady",function(){$.bot.isModuleEnabled("./games/slotMachine.js")&&$.registerChatCommand("./games/slotMachine.js","slot",7)}),$.bot.isModuleEnabled("./games/slotMachine.js")&&!$.bot.isModuleEnabled("./systems/pointSystem.js")&&$.logError("slotMachine.js",88,"Disabled. ./systems/pointSystem.js is not enabled.")}();
