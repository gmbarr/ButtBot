$.lang.register('donationhandler.donation.new', 'Thank you very much (name) for the tip of $(amount) (currency)!');
$.lang.register('donationhandler.donation.newreward', 'Thank you very much (name) for the tip of $(amount) (currency)! Here are (points) (pointname)!');
$.lang.register('donationhandler.lastdonation.no-donations', 'There are presently no tips.');
$.lang.register('donationhandler.lastdonation.404', 'Cannot find last tip!');
$.lang.register('donationhandler.lastdonation.success', 'The last tip was from (name) in the amount of $(amount) (currency).');
$.lang.register('donationhandler.donations.usage', 'usage: !streamlabs (announce | rewardmultiplier n.n | message | lastmessage)');
$.lang.register('donationhandler.donations.announce.disable', 'Tips will no longer be announced.');
$.lang.register('donationhandler.donations.announce.enable', 'Tips will now be announced.');
$.lang.register('donationhandler.donations.reward.usage', 'usage: !streamlabs rewardmultiplier n.n  Set to 0 to disable');
$.lang.register('donationhandler.donations.reward.success', 'The reward for tips has been set to $1 $2 per whole amount of currency donated.');
$.lang.register('donationhandler.donations.message.usage', 'usage: !streamlabs message [message...] Tags: (name) (amount) (currency) (message)');
$.lang.register('donationhandler.donations.rewardmessage.usage', 'usage: !streamlabs rewardmessage [message...] Tags: (name) (amount) (currency) (points) (pointname) (message)');
$.lang.register('donationhandler.donations.message.no-name', 'A (name) tag was not provided, at a minimum provide the (name) tag. Tags: (name) (amount) (currency) (message)');
$.lang.register('donationhandler.donations.rewardmessage.no-name', 'A (name) tag was not provided, at a minimum provide the (name) tag. Tags: (name) (amount) (currency) (points) (pointname) (message)');
$.lang.register('donationhandler.donations.message.success', 'Updated the message for tips when rewards are disabled.');
$.lang.register('donationhandler.donations.rewardmessage.success', 'Updated the message for tips with rewards enabled.');
$.lang.register('donationhandler.enabled.donators', 'The donators group has been enabled.');
$.lang.register('donationhandler.disabled.donators', 'The donators group has been disabled.');
$.lang.register('donationhandler.donators.min', 'The minimum before being promoted to a Donator was set to $1');
$.lang.register('donationhandler.donators.min.usage', 'usage: !streamlabs minmumbeforepromotion (amount)');
