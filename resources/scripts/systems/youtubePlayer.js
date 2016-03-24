!function(){function e(e,t){var n="",s="",i=-1;if(this.found=!1,this.getVideoId=function(){return n},this.getOwner=function(){return t},this.getVideoLength=function(){if(-1!=i)return i;for(var e=$.youtube.GetVideoLength(n);0==e[0]&&0==e[1]&&0==e[2];)e=$.youtube.GetVideoLength(n);return 0==e[0]&&0==e[1]&&0==e[2]?0:(i=e[2],e[2])},this.getVideoLengthMMSS=function(){var e,t;return-1==i&&(i=this.getVideoLength()),e=(10>i/60?"0":"")+Math.floor(i/60),t=(10>i%60?"0":"")+Math.floor(i%60),e+":"+t},this.getVideoLink=function(){return"https://youtu.be/"+n},this.getVideoTitle=function(){return s},!e)throw"No Search Query Given";if(t.equals(playlistDJname)||(t=t.toLowerCase()),$.inidb.exists("ytcache",e)){var a=$.inidb.get("ytcache",e),l=JSON.parse(a);n=l.id,s=l.title,i=l.time}else{var r=null;do r=$.youtube.SearchForVideo(e);while(r[0].length()<11&&"No Search Results Found"!=r[1]);if(n=r[0],s=r[1],s.equalsIgnoreCase("video marked private")||s.equalsIgnoreCase("no search results found"))throw s;this.getVideoLength();var l={};l.id=n+"",l.title=s+"",l.time=i;var a=JSON.stringify(l);$.inidb.set("ytcache",n,a)}}function t(t,n){var l=null,u=null,d=s+t,c=[],p=[],m=[],P="";return this.playlistName=t,this.loaded=!1,this.importPlaylistFile=function(t,n,i){var a=[],l=0,r=0;if($.inidb.exists("yt_playlists_registry","ytPlaylist_"+t)){if($.fileExists("./addons/youtubePlayer/"+n)){$.say($.whisperPrefix(i)+$.lang.get("ytplayer.command.importpl.file.start")),a=readFile("./addons/youtubePlayer/"+n);for(var o=0;o<a.length;o++)try{var y=new e(a[o],"importPlaylistFile");$.inidb.set(s+t,l,y.getVideoId()),l++}catch(g){$.logError("youtubePlayer.js",182,"importPlaylistFile::skipped ["+a[o]+"]: "+g),r++}return $.inidb.set(s+t,"lastkey",l),$.lang.get("ytplayer.command.importpl.file.success",l,r,n,t)}return $.lang.get("ytplayer.command.importpl.file.404",n)}return $.lang.get("ytplayer.command.importpl.file.registry404",t)},this.loadNewPlaylist=function(e){$.inidb.exists("yt_playlists_registry","ytPlaylist_"+e)&&(this.playlistName=e,d=s+e,this.loadPlaylistKeys(),connectedPlayerClient.pushPlayList())},this.getplayListDbId=function(){return d},this.getRequestFailReason=function(){return P},this.addToPlaylist=function(e,t){if(!e)return-1;var n;return t=t?t:this.playlistName,this.videoExistsInPlaylist(e,t)?-1:(t&&(n=$.inidb.exists(s+t,"lastkey")?parseInt($.inidb.get(s+t,"lastkey"))+1:0,$.inidb.set(s+t,n,e.getVideoId()),$.inidb.set(s+t,"lastkey",n)),t.equals(this.playlistName)&&(this.loadPlaylistKeys(),connectedPlayerClient.pushPlayList()),n)},this.deleteCurrentVideo=function(){var e,t=$.inidb.GetKeyList(d,"");for(e=0;e<t.length;e++)if(!t[e].equals("lastkey")&&$.inidb.get(d,t[e])==u.getVideoId()){$.inidb.del(d,t[e]);break}return this.loadPlaylistKeys()>0?(connectedPlayerClient.pushPlayList(),this.nextVideo()):connectedPlayerClient.pushPlayList(),this.getplaylistLength()},this.deleteVideoByID=function(e){var t,n=$.inidb.GetKeyList(d,"");for(t=0;t<n.length;t++)if($.inidb.get(d,n[t]).equals(e)){$.inidb.del(d,n[t]);break}this.loadPlaylistKeys(),connectedPlayerClient.pushPlayList()},this.deletePlaylist=function(e){return $.inidb.exists("yt_playlists_registry","ytPlaylist_"+e)?($.inidb.del("yt_playlists_registry","ytPlaylist_"+e),$.inidb.RemoveFile("ytPlaylist_"+e),!0):!1},this.getCurrentVideo=function(){return u},this.getPlaylistname=function(){return this.playlistName},this.getplaylistLength=function(){return c.length},this.getReadOnlyPlaylistData=function(){return p},this.getPreviousVideo=function(){return l},this.getRequestList=function(){return m},this.getRequestAtIndex=function(e){return e>m.length?null:m[e]},this.getRequestsCount=function(){return m.length},this.jumpToSong=function(t){if($.inidb.exists(d,t)){l=u;try{u=new e($.inidb.get(d,t),$.ownerName)}catch(n){return $.logError("youtubePlayer.js",233,"YoutubeVideo::exception: "+n),!1}return connectedPlayerClient.play(u),!0}return!1},this.loadPlaylistKeys=function(){var e=$.inidb.GetKeyList(d,"");c=[],p=[];for(var t=0;t<e.length;t++)e[t].equals("lastkey")||c.push(e[t]);c=i?$.arrayShuffle(c):c;for(var t=0;t<c.length;t++)p.push(c[t]);return this.loaded=!0,e.length},this.nextVideo=function(){if(!connectedPlayerClient)return null;if(l=u,m.length>0)u=m.shift();else{if(0==c.length&&0==this.loadPlaylistKeys())return null;try{var t=c.shift();u=new e($.inidb.get(d,t),playlistDJname)}catch(n){$.logError("youtubePlayer.js",277,"YoutubeVideo::exception: "+n),this.nextVideo()}}return connectedPlayerClient.play(u),this.updateCurrentSongFile(u),a&&$.say($.lang.get("ytplayer.announce.nextsong",u.getVideoTitle(),u.getOwner())),u},this.preparePlaylist=function(){return $.inidb.set("ytSettings","activePlaylistname","default"),$.inidb.exists("yt_playlists_registry",d)&&$.inidb.FileExists(d)||($.setIniDbBoolean("yt_playlists_registry",d,!0),$.inidb.AddFile(d)),!0},this.removeSong=function(e){var t,n=null,s=[];for(t in m)m[t].getVideoId().equals(e)?n=m[t].getVideoTitle():s.push(m[t]);return m=s,n},this.removeUserSong=function(e){var t,n=null,s=[];for(t=m.length-1;t>=0;t--)m[t].getOwner().equals(e)&&null==n?n=m[t].getVideoTitle():s.push(m[t]);return m=s,n},this.requestSong=function(t,n){if(!$.isAdmin(n)&&(!o||this.senderReachedRequestMax(n)))return P=this.senderReachedRequestMax(n)?$.lang.get("ytplayer.requestsong.error.maxrequests"):$.lang.get("ytplayer.requestsong.error.disabled"),null;try{var s=new e(t,n)}catch(i){return P=$.lang.get("ytplayer.requestsong.error.yterror",i),$.logError("youtubePlayer.js",315,"YoutubeVideo::exception: "+i),null}if(this.videoExistsInRequests(s))return P=$.lang.get("ytplayer.requestsong.error.exists"),null;if(this.videoLengthExceedsMax(s)&&!$.isAdmin(n))return P=$.lang.get("ytplayer.requestsong.error.maxlength",s.getVideoLengthMMSS()),null;m.push(s);var a=connectedPlayerClient.checkState();return a!=playerStateEnum.UNSTARTED&&a!=playerStateEnum.ENDED||this.nextVideo(),s},this.senderReachedRequestMax=function(e){var t,n=0;e=e.toLowerCase();for(t in m)m[t].getOwner()==e&&++n;return $.bot.isModuleEnabled("./handlers/gameWispHandler.js")?n>=y+$.getTierData(e,"songrequests"):n>=y},this.updateCurrentSongFile=function(e){$.writeToFile(e.getVideoTitle(),r+"currentSong.txt",!1)},this.videoExistsInPlaylist=function(e,t){var n,i=$.inidb.GetKeyList(s+t,"");for(n in i)if(!i[n].equals("lastkey")&&$.inidb.get(s+t,i[n])==e.getVideoId())return!0;return!1},this.videoExistsInRequests=function(e){var t;for(t in m)if(m[t].getVideoId()==e.getVideoId())return!0;return!1},this.videoLengthExceedsMax=function(e){return e.getVideoLength()>g},this.playlistName?(this.preparePlaylist(),void(n&&this.loadPlaylistKeys())):this.loaded}function n(){var t=$.ytplayer,n=!1;this.pushPlayList=function(){var n,s,i={},a=[];if(currentPlaylist){for(i.playlistname=currentPlaylist.getPlaylistname()+"",i.playlist=[],a=currentPlaylist.getReadOnlyPlaylistData(),s=0;s<a.length;s++)n=new e($.inidb.get(currentPlaylist.getplayListDbId(),a[s]),$.botName),i.playlist.push({song:n.getVideoId()+"",title:n.getVideoTitle()+"",duration:n.getVideoLengthMMSS()+""});t.playList(JSON.stringify(i))}},this.pushSongList=function(){var e,n,s={},i=[];if(currentPlaylist){s.songlist=[],i=currentPlaylist.getRequestList();for(n in i)e=i[n],s.songlist.push({song:e.getVideoId()+"",title:e.getVideoTitle()+"",duration:e.getVideoLengthMMSS()+"",requester:e.getOwner()+""});t.songList(JSON.stringify(s))}},this.play=function(e){t.play(e.getVideoId(),e.getVideoTitle(),e.getVideoLengthMMSS(),e.getOwner())},this.getVolume=function(){return t.getVolume()},this.setVolume=function(e){e=parseInt(e),isNaN(e)||(t.setVolume(e),$.inidb.set("ytSettings","volume",e))},this.togglePause=function(){return t.pause(),n=!n},this.checkState=function(){return parseInt(t.getPlayerState())}}var s="ytPlaylist_",i=$.inidb.exists("ytSettings","randomizePlaylist")?$.getIniDbBoolean("ytSettings","randomizePlaylist"):!1,a=$.inidb.exists("ytSettings","announceInChat")?$.getIniDbBoolean("ytSettings","announceInChat"):!1,l=$.inidb.exists("ytSettings","activePlaylistname")?$.inidb.get("ytSettings","activePlaylistname"):"default",r=$.inidb.exists("ytSettings","baseFileOutputPath")?$.inidb.get("ytSettings","baseFileOutputPath"):"./addons/youtubePlayer/",o=$.inidb.exists("ytSettings","songRequestsEnabled")?$.getIniDbBoolean("ytSettings","songRequestsEnabled"):!0,y=$.inidb.exists("ytSettings","songRequestsMaxParallel")?parseInt($.inidb.get("ytSettings","songRequestsMaxParallel")):1,g=$.inidb.exists("ytSettings","songRequestsMaxSecondsforVideo")?parseInt($.inidb.get("ytSettings","songRequestsMaxSecondsforVideo")):480;playlistDJname=$.inidb.exists("ytSettings","playlistDJname")?$.inidb.get("ytSettings","playlistDJname"):$.botName,playerStateEnum={NEW:-2,UNSTARTED:-1,ENDED:0,PLAYING:1,PAUSED:2,BUFFERING:3,CUED:5,KEEPALIVE:200},connectedPlayerClient=null,currentPlaylist=null,$.bind("yTPlayerDeletePlaylistByID",function(e){currentPlaylist.deleteVideoByID(e.getYouTubeID())}),$.bind("yTPlayerSongRequest",function(e){var t=currentPlaylist.requestSong(e.getSearch(),$.ownerName);null!=t&&connectedPlayerClient.pushSongList()}),$.bind("yTPlayerStealSong",function(t){var n=t.getYouTubeID()+"";n.length>1?currentPlaylist.addToPlaylist(new e(n,$.ownerName)):currentPlaylist.addToPlaylist(currentPlaylist.getCurrentVideo())}),$.bind("yTPlayerSkipSong",function(e){currentPlaylist.nextVideo(),connectedPlayerClient.pushSongList()}),$.bind("yTPlayerDeleteSR",function(e){currentPlaylist.removeSong(e.getId()),connectedPlayerClient.pushSongList()}),$.bind("yTPlayerVolume",function(e){$.inidb.set("ytSettings","volume",e.getVolume())}),$.bind("yTPlayerRequestSonglist",function(e){connectedPlayerClient.pushSongList()}),$.bind("yTPlayerRequestPlaylist",function(e){connectedPlayerClient.pushPlayList()}),$.bind("yTPlayerState",function(e){var t,n=e.getStateId();n==playerStateEnum.NEW&&(t=$.inidb.exists("ytSettings","volume")?parseInt($.inidb.get("ytSettings","volume")):5,connectedPlayerClient.setVolume(t),currentPlaylist&&currentPlaylist.nextVideo()),n==playerStateEnum.ENDED&&currentPlaylist&&currentPlaylist.nextVideo()}),$.bind("yTPlayerConnect",function(e){connectedPlayerClient=new n,$.consoleLn($.lang.get("ytplayer.console.client.connected")),o&&$.say($.lang.get("ytplayer.songrequests.enabled")),connectedPlayerClient.pushPlayList(),$.youtubePlayerConnected=!0}),$.bind("yTPlayerDisconnect",function(e){connectedPlayerClient=null,$.consoleLn($.lang.get("ytplayer.console.client.disconnected")),o||$.say($.lang.get("ytplayer.songrequests.disabled")),$.youtubePlayerConnected=!1}),$.bind("command",function(n){var l,r,u,d=n.getCommand(),c=n.getSender().toLowerCase(),p=n.getArgs();if(d.equalsIgnoreCase("ytp")||d.equalsIgnoreCase("musicplayer")){if(l=["volume","pause"].join(", "),r=p[0],u=p.splice(1),!r)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.usage"));if(r.equalsIgnoreCase("djname")&&(u[0]?(playlistDJname=u.join(" "),$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.setdjname.success",playlistDJname)),$.inidb.set("ytSettings","playlistDJname",playlistDJname)):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.setdjname.usage"))),r.equalsIgnoreCase("delrequest")){if(u[0]){var m=currentPlaylist.removeSong(u[0]);m?($.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.delrequest.success",u[0],m)),connectedPlayerClient.pushSongList()):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.delrequest.404",u[0]))}else $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.delrequest.usage"));return}if(r.equalsIgnoreCase("volume"))return connectedPlayerClient?void(u[0]&&!isNaN(parseInt(u[0]))?(connectedPlayerClient.setVolume(u[0]),$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.volume.set",u[0]))):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.volume.get",connectedPlayerClient.getVolume()))):void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(r.equalsIgnoreCase("pause"))return connectedPlayerClient?void connectedPlayerClient.togglePause():void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(r.equalsIgnoreCase("togglerandom")||r.equalsIgnoreCase("shuffle"))return i=!i,$.setIniDbBoolean("ytSettings","randomizePlaylist",i),currentPlaylist&&currentPlaylist.loadPlaylistKeys(),connectedPlayerClient&&connectedPlayerClient.pushPlayList(),void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.togglerandom.toggled",i?$.lang.get("common.enabled"):$.lang.get("common.disabled")));if(r.equalsIgnoreCase("toggleannounce")||r.equalsIgnoreCase("togglenotify"))return a=!a,$.setIniDbBoolean("ytSettings","announceInChat",a),void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.toggleannounce.toggled",a?$.lang.get("common.enabled"):$.lang.get("common.disabled")));if(r.equalsIgnoreCase("togglerequests")||r.equalsIgnoreCase("togglesr"))return o=!o,$.setIniDbBoolean("ytSettings","songRequestsEnabled",o),void(o?$.say($.lang.get("ytplayer.songrequests.enabled")):$.say($.lang.get("ytplayer.songrequests.disabled")));if(r.equalsIgnoreCase("setrequestmax")||r.equalsIgnoreCase("limit"))return!u[0]||isNaN(parseInt(u[0]))?void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.setrequestmax.usage")):(y=parseInt(u[0]),$.inidb.set("ytSettings","songRequestsMaxParallel",y),void $.say($.lang.get("ytplayer.command.ytp.setrequestmax.success",y)));if(r.equalsIgnoreCase("setmaxvidlength")||r.equalsIgnoreCase("maxvideolength"))return!u[0]||isNaN(parseInt(u[0]))?void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.ytp.setmaxvidlength.usage")):(g=parseInt(u[0]),$.inidb.set("ytSettings","songRequestsMaxSecondsforVideo",g),void $.say($.lang.get("ytplayer.command.ytp.setmaxvidlength.success",g)))}if(d.equalsIgnoreCase("playlist")){if(l=["add","delete","loadpl","deletepl","importpl"].join(", "),r=p[0],u=p.splice(1),!r)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.usage",l));if(r.equalsIgnoreCase("add")){if(!connectedPlayerClient)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(u.length>0){try{var P=new e(u.join(" "),c)}catch(h){return $.logError("youtubePlayer.js",641,"YoutubeVideo::exception: "+h),void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.add.failed",h))}currentPlaylist.addToPlaylist(P)?$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.add.success",P.getVideoTitle(),currentPlaylist.getPlaylistname())):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.add.failed",currentPlaylist.getRequestFailReason()))}else $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.add.usage"));return}if(r.equalsIgnoreCase("delete"))return connectedPlayerClient?void currentPlaylist.deleteCurrentVideo():void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(r.equalsIgnoreCase("loadpl")){if(!connectedPlayerClient)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(u.length>0){var f=new t(u[0],!0);0==f.getplaylistLength()?$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.load.success.new",f.getPlaylistname())):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.load.success",f.getPlaylistname())),currentPlaylist.loadNewPlaylist(u[0]),connectedPlayerClient.pushPlayList()}else $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.load.usage"));return}if(r.equalsIgnoreCase("listpl")){var b=$.inidb.GetKeyList("yt_playlists_registry","");b&&$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.listpl",b.join(", ").replace(/ytPlaylist_/g,"")))}if(r.equalsIgnoreCase("deletepl")){if(!currentPlaylist)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(u.length>0){if(u[0].equalsIgnoreCase("default"))return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.delete.isdefault"));currentPlaylist.deletePlaylist(u[0])?$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.delete.success",u[0])):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.delete.404",u[0]))}else $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.playlist.delete.usage"));return}if(r.equalsIgnoreCase("importpl")){if(3==u.length&&u[0].equalsIgnoreCase("file")){var x=new t(u[1],!1);return void $.say($.whisperPrefix(c)+x.importPlaylistFile(u[1],u[2],c))}$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.importpl.file.usage"))}}else{if(null==connectedPlayerClient)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.client.404"));if(d.equalsIgnoreCase("stealsong")&&(0==p.length?(currentPlaylist.addToPlaylist(currentPlaylist.getCurrentVideo()),$.say($.lang.get("ytplayer.command.stealsong.this.success",$.username.resolve(c)))):$.inidb.FileExists(s+p[0].toLowerCase())?(currentPlaylist.addToPlaylist(currentPlaylist.getCurrentVideo(),p[0].toLowerCase()),$.say($.lang.get("ytplayer.command.stealsong.other.success",$.username.resolve(c),p[0]))):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.playlist.404",p[0]))),(d.equalsIgnoreCase("jumptosong")||d.equalsIgnoreCase("playsong"))&&(currentPlaylist.jumpToSong(p[0])||$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.jumptosong.failed",p[0]))),d.equalsIgnoreCase("skipsong")&&(currentPlaylist.nextVideo(),connectedPlayerClient.pushSongList()),d.equalsIgnoreCase("songrequest")||d.equalsIgnoreCase("addsong")){if(0==p.length)return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.songrequest.usage"));var C=currentPlaylist.requestSong(n.getArguments(),c);null!=C?($.say($.lang.get("ytplayer.command.songrequest.success",$.resolveRank(c),C.getVideoTitle(),currentPlaylist.getRequestsCount(),C.getVideoId())),connectedPlayerClient.pushSongList()):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.songrequest.failed",currentPlaylist.getRequestFailReason()))}if(d.equalsIgnoreCase("wrongsong"))if(0==p.length){var v=currentPlaylist.removeUserSong(c);v?($.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.wrongsong.success",v)),connectedPlayerClient.pushSongList()):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.wrongsong.404"))}else if(p[0].equalsIgnoreCase("user")){if(p[1]){var v=currentPlaylist.removeUserSong(p[1].toLowerCase());v?($.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.wrongsong.user.success",p[1],v)),connectedPlayerClient.pushSongList()):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.wrongsong.404"))}}else $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.wrongsong.usage"));if(d.equalsIgnoreCase("previoussong")&&(currentPlaylist.getPreviousVideo()?$.say($.lang.get("ytplayer.command.previoussong",currentPlaylist.getPreviousVideo().getVideoTitle(),currentPlaylist.getPreviousVideo().getOwner(),currentPlaylist.getPreviousVideo().getVideoLink())):$.say($.lang.get("ytplayer.command.previoussong.404"))),d.equalsIgnoreCase("currentsong")&&$.say($.lang.get("ytplayer.command.currentsong",currentPlaylist.getCurrentVideo().getVideoTitle(),currentPlaylist.getCurrentVideo().getOwner(),currentPlaylist.getCurrentVideo().getVideoLink())),d.equalsIgnoreCase("nextsong")){var q,w;if(!p[0])return null==currentPlaylist.getRequestAtIndex(1)?void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.404")):void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.single",currentPlaylist.getRequestAtIndex(1).getVideoTitle()));if(!isNaN(p[0]))return null==currentPlaylist.getRequestAtIndex(parseInt(p[0]))?void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.404")):void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.single","#"+p[0]+": "+currentPlaylist.getRequestAtIndex(parseInt(p[0])).getVideoTitle()));if(p[0].equalsIgnoreCase("next")){if(!p[1])return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.usage"));if(isNaN(p[1]))return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.usage"));q=1,w=parseInt(p[1])}else{if(!p[0].equalsIgnoreCase("list"))return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.usage"));if(!p[1])return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.usage"));if(!p[1].match(/\d+\-\d+/))return void $.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.usage"));q=parseInt(p[1].match(/(\d+)\-\d+/)[1]),w=parseInt(p[1].match(/\d+\-(\d+)/)[1]),w-q>5&&(w=q+5)}for(var I="";w>=q&&null!=currentPlaylist.getRequestAtIndex(q);)I+="[(#"+q+") "+currentPlaylist.getRequestAtIndex(q).getVideoTitle().substr(0,20)+"] ",q++;I.equals("")?$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.range.404")):$.say($.whisperPrefix(c)+$.lang.get("ytplayer.command.nextsong.range",I))}}}),$.bind("initReady",function(){if($.bot.isModuleEnabled("./systems/youtubePlayer.js")&&($.registerChatCommand("./systems/youtubePlayer.js","ytp",1),$.registerChatCommand("./systems/youtubePlayer.js","musicplayer",1),$.registerChatCommand("./systems/youtubePlayer.js","playlist",1),$.registerChatCommand("./systems/youtubePlayer.js","stealsong",1),$.registerChatCommand("./systems/youtubePlayer.js","jumptosong",1),$.registerChatCommand("./systems/youtubePlayer.js","playsong",1),$.registerChatCommand("./systems/youtubePlayer.js","skipsong",1),$.registerChatCommand("./systems/youtubePlayer.js","songrequest"),$.registerChatCommand("./systems/youtubePlayer.js","addsong"),$.registerChatCommand("./systems/youtubePlayer.js","previoussong"),$.registerChatCommand("./systems/youtubePlayer.js","currentsong"),$.registerChatCommand("./systems/youtubePlayer.js","wrongsong"),$.registerChatCommand("./systems/youtubePlayer.js","nextsong"),$.registerChatSubcommand("wrongsong","user",2),null==currentPlaylist&&(currentPlaylist=new t(l,!0),currentPlaylist.getPlaylistname().equals("default")&&0==currentPlaylist.getplaylistLength()))){try{currentPlaylist.addToPlaylist(new e("gotxnim9h8w",$.botName))}catch(n){$.logError("youtubePlayer.js",839,"YoutubeVideo::exception: "+n)}try{currentPlaylist.addToPlaylist(new e("WFqO9DoZZjA",$.botName))}catch(n){$.logError("youtubePlayer.js",846,"YoutubeVideo::exception: "+n)}try{currentPlaylist.addToPlaylist(new e("l7C29RM1UmU",$.botName))}catch(n){$.logError("youtubePlayer.js",855,"YoutubeVideo::exception: "+n)}}})}();
