(function(){var e=$.inidb.exists("settings","hostReward")?$.inidb.get("settings","hostReward"):200,s=$.inidb.exists("settings","hostMessage")?$.inidb.get("settings","hostMessage"):$.lang.get("hosthandler.host.message"),t=216e5,n=[],a=[],r=false;$.bind("twitchHostsInitialized",function(){if(!$.bot.isModuleEnabled("./handlers/hostHandler.js")){return}$.consoleLn(">> Enabling hosts announcements");r=true});$.bind("twitchHosted",function(i){if(!$.bot.isModuleEnabled("./handlers/hostHandler.js")){return}var o=$.username.resolve(i.getHoster()),h=$.systemTime(),d=s;if(!r){return}$.writeToFile(o,"./addons/hostHandler/latestHost.txt",false);if(n[o]>h||a[o]>h){return}n[o]=h+t;d=d.replace("(name)",o);d=d.replace("(reward)",e.toString());$.say(d)});$.bind("twitchUnhosted",function(e){if(!$.bot.isModuleEnabled("./handlers/hostHandler.js")){return}var s=e.getHoster(),t;for(t in n){if(s.equalsIgnoreCase(t)){a[t]=n[t];n.splice(t,1);return}}});$.bind("command",function(e){var t=e.getSender().toLowerCase(),a=e.getCommand(),r=e.getArgs(),i=parseInt(r[0]),o=[],h;if(a.equalsIgnoreCase("hostreward")){if(!$.isAdmin(t)){$.say($.whisperPrefix(t)+$.adminMsg);return}if(isNaN(i)){$.say($.whisperPrefix(t)+$.lang.get("hosthandler.set.hostreward.usage",$.pointNameMultiple));return}$.inidb.set("settings","hostReward",i);$.say($.whisperPrefix(t)+$.lang.get("hosthandler.set.hostreward.success",$.getPointsString(i)))}if(a.equalsIgnoreCase("hostmessage")){if(!r||r.length==0){$.say($.whisperPrefix(t)+$.lang.get("hosthandler.set.hostmessage.usage"));return}s=e.getArguments();$.inidb.set("settings","hostMessage",s);$.say($.whisperPrefix(t)+$.lang.get("hosthandler.set.hostmessage.success"))}if(a.equalsIgnoreCase("unhost")){if(!$.isAdmin(t)){$.say($.whisperPrefix(t)+$.adminMsg);return}$.say(".unhost")}if(a.equalsIgnoreCase("host")){if(!$.isAdmin(t)){$.say($.whisperPrefix(t)+$.adminMsg);return}$.say(".host "+r[0])}if(a.equalsIgnoreCase("hostcount")){$.say($.lang.get("hosthandler.newhost",n.length))}if(a.equalsIgnoreCase("hostlist")){for(h in n){o.push(h)}$.say($.lang.get("hosthandler.hostlist",o.join(", ")))}});$.bind("initReady",function(){if($.bot.isModuleEnabled("./handlers/hostHandler.js")){$.registerChatCommand("./handlers/hostHandler.js","hostmessage",1);$.registerChatCommand("./handlers/hostHandler.js","hostreward",1);$.registerChatCommand("./handlers/hostHandler.js","unhost",1);$.registerChatCommand("./handlers/hostHandler.js","host",1);$.registerChatCommand("./handlers/hostHandler.js","hostcount");$.registerChatCommand("./handlers/hostHandler.js","hostlist")}})})();
