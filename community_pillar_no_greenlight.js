'use strict';

(function() {
  if (!location.href.match(/^https?:\/\/steamcommunity.com\/(?:id|profiles)\/[^\/]+\/badges\/2/)) {
    location.href = '//steamcommunity.com/my/badges/2';
    return;
  }

  if (!g_steamID) {
    alert('No logged on!');
    return;
  }

  var k_ExpectedTasksCount = 28;
  var g_SteamTasks = $J('.badge_task');

  if (g_SteamTasks.length != k_ExpectedTasksCount) {
    console.error('Expected tasks ' + k_ExpectedTasksCount + ', but found ' + g_SteamTasks.length);
    console.error('Stopped');
    return;
  }

  var g_TasksQueue = [];

  var bTaskBroadcast = isTaskAvailable(3);
  var bTaskWorkshopRate = isTaskAvailable(11);
  var bTaskWorkshopSubscribe = isTaskAvailable(12);
  var bTaskWorkshop = bTaskWorkshopRate || bTaskWorkshopSubscribe;
  var bTaskCommunityProfileRealName = isTaskAvailable(16);
  var bTaskCommunityProfile = bTaskCommunityProfileRealName || isTaskAvailable(15) || isTaskAvailable(17);
  var bTaskJoinGroup = isTaskAvailable(18);
  var bTaskProfileComment = isTaskAvailable(19);
  var bTaskFeedRateUp = isTaskAvailable(20);
  var bTaskPostStatus = isTaskAvailable(21);
  var bTaskSelectBadge = isTaskAvailable(24);
  var bTaskDiscussionsSearch = isTaskAvailable(26);

  function isTaskAvailable(task_id) {
    var task = g_SteamTasks.eq(task_id);
    if (!task.length)
      return false;

    return task.find('.quest_icon').attr('src').indexOf('_off') != -1;
  }

  function DoTaskBroadcast(next) {
    $J.get('//steamcommunity.com/apps/allcontenthome?appHubSubSection=13').done(function(data) {
      // first available broadcast
      var match = data.match(/watch\/(\d+)/);
      if (!match) {
        console.error('[DoTaskBroadcast] Fail! (2)');
        return next();
      }

      $J.get('//steamcommunity.com/broadcast/getbroadcastmpd/?steamid=' + match[1] + '&broadcastid=0&viewertoken=0').done(function(data) {
        if (data.success !== 'ready') {
          console.error('[DoTaskBroadcast] Fail! (4)');
        } else {
          console.log('[DoTaskBroadcast] OK!');
        }
      }).fail(function() {
        console.error('[DoTaskBroadcast] Fail! (3)');
      }).always(function() {
        next();
      });
    }).fail(function() {
      console.error('[DoTaskBroadcast] Fail! (1)');
      next();
    });
  }

  function DoTaskWorkshop(next) {
    $J.get('//steamcommunity.com/workshop/browse/', {
      appid: 440,
      browsesort: 'totaluniquesubscribers'
    }).done(function(data) {
      var matches = data.match(/sharedfile_(\d+)/g);
      if (!matches) {
        console.error('[DoTaskWorkshop] Fail! (2)');
        return next();
      }

      var file_id = matches[Math.floor(Math.random() * matches.length)].substr(11);
      var isDone = false;

      if (bTaskWorkshopRate) {
        console.log('[DoTaskWorkshop] Upvoting id#' + file_id);
        $J.post('//steamcommunity.com/sharedfiles/voteup', {
          id: file_id,
          sessionid: g_sessionID
        }).done(function(data) {
          if (data.success == 1) {
            console.log('[DoTaskWorkshop] Rate - OK!');
          } else {
            console.error('[DoTaskWorkshop] Rate - Fail! (4)');
          }
        }).fail(function() {
          console.error('[DoTaskWorkshop] Rate - Fail! (3)');
        }).always(function() {
          if (!bTaskWorkshopSubscribe || isDone) {
            return next();
          }
          isDone = true;
        });
      }

      if (bTaskWorkshopSubscribe) {
        console.log('[DoTaskWorkshop] Subscribing id#' + file_id);
        $J.post('//steamcommunity.com/sharedfiles/subscribe', {
          id: file_id,
          appid: 440,
          sessionid: g_sessionID
        }).done(function(data) {
          if (data.success == 1) {
            console.log('[DoTaskWorkshop] Subscribe - OK!');
            $J.post('//steamcommunity.com/sharedfiles/unsubscribe', {
              id: file_id,
              appid: 440,
              sessionid: g_sessionID
            }).done(function(data) {
              if (data.success == 1) {
                console.log('[DoTaskWorkshop] Unsubscribed');
              }
            });
          } else {
            console.error('[DoTaskWorkshop] Subscribe - Fail! (4)');
          }
        }).fail(function() {
          console.error('[DoTaskWorkshop] Subscribe - Fail! (3)');
        }).always(function() {
          if (!bTaskWorkshopRate || isDone) {
            return next();
          }
          isDone = true;
        });
      }
    }).fail(function() {
      console.error('[DoTaskWorkshop] Fail! (1)');
      next();
    });
  }

    function DoTaskCommunityProfile(next) {
    $J.get('//steamcommunity.com/profiles/' + g_steamID + '/edit').done(function(data) {
      var form = $J(data).find('form').eq(0);

      if (bTaskCommunityProfileRealName) {
        form.find('#real_name').val(form.find('#personaName').val())
      }

      $J.post('//steamcommunity.com/profiles/' + g_steamID + '/edit', form.serialize()).done(function(data) {
        console.log('[DoTaskCommunityProfile] OK!');
      }).fail(function() {
        console.error('[DoTaskCommunityProfile] Fail! (2)');
      }).always(function() {
        next();
      });
    }).fail(function() {
      console.error('[DoTaskCommunityProfile] Fail! (1)');
      next();
    });
  }

  function DoTaskJoinGroup(next) {
    $J.post('//steamcommunity.com/groups/tradingcards', {
      action: 'join',
      sessionID: g_sessionID
    }).done(function() {
      console.log('[DoTaskJoinGroup] OK!');
    }).fail(function() {
      console.error('[DoTaskJoinGroup] Fail!');
    }).always(function() {
      next();
    });
  }

  function DoTaskProfileComment(next) {
    $J.post('//steamcommunity.com/comment/Profile/post/' + g_steamID + '/-1/', {
      comment: ':steammocking:',
      count: 0,
      sessionid: g_sessionID
    }).done(function(data) {
      if (data.success) {
        console.log('[DoTaskProfileComment] OK!');
      } else {
        console.error('[DoTaskProfileComment] Fail! (2)');
      }
    }).fail(function() {
      console.error('[DoTaskProfileComment] Fail! (1)');
    }).always(function() {
      next();
    });
  }

  function DoTaskFeedRateUp(next) {
    $J.post('//steamcommunity.com/actions/LogFriendActivityUpvote', {
      sessionID: g_sessionID
    }).done(function() {
      console.log('[DoTaskFeedRateUp] OK!');
    }).fail(function() {
      console.error('[DoTaskFeedRateUp] Fail!');
    }).always(function() {
      next();
    });
  }

  function DoTaskPostStatus(next) {
    $J.post('//steamcommunity.com/profiles/' + g_steamID + '/ajaxpostuserstatus/', {
      sessionid: g_sessionID,
      status_text: 'Hello World!',
      appid: 0
    }).done(function(data) {
      if (data.success && data.blotter_html) {
        console.log('[DoTaskPostStatus] OK!');
        var postid = data.blotter_html.match(/userstatus_(\d+)_/)[1];
        $J.post('//steamcommunity.com/profiles/' + g_steamID + '/ajaxdeleteuserstatus/', {
          sessionid: g_sessionID,
          postid: postid
        }).done(function(data) {
          if (data.success) {
            console.log('[DoTaskPostStatus] Post removed');
          }
        });
      } else {
        console.error('[DoTaskPostStatus] Fail! (2)');
      }
    }).fail(function() {
      console.error('[DoTaskPostStatus] Fail! (1)');
    }).always(function() {
      next();
    });
  }

  function DoTaskSelectBadge(next) {
    $J.post('//steamcommunity.com/profiles/' + g_steamID + '/badges/2', {
      action: 'setfavoritebadge',
      sessionid: g_sessionID,
      badgeid: 2 // Community Badge
    }).done(function(data) {
      if (data.indexOf('class="profile_fatalerror"') != -1) {
        console.error('[DoTaskSelectBadge] Fail! (2)');
      } else {
        console.log('[DoTaskSelectBadge] OK!');
      }
    }).fail(function() {
      console.error('[DoTaskSelectBadge] Fail! (1)');
    }).always(function() {
      next();
    });
  }

  function DoTaskDiscussionsSearch(next) {
    $J.ajax({
      // Really where? :(
      url: '//steamcommunity.com/discussions/forum/search/?gidforum=882958665520871138&q=%57%68%65%72%65%20%69%73%20%48%61%6C%66%2D%4C%69%66%65%20%33%3F',
      type: 'HEAD'
    }).done(function() {
      console.log('[DoTaskDiscussionsSearch] OK!');
    }).fail(function() {
      console.error('[DoTaskDiscussionsSearch] Fail!');
    }).always(function() {
      next();
    });
  }

  function DoNextTask() {
    var Task = g_TasksQueue.shift();
    if (Task) {
      Task(DoNextTask);
    } else {
      console.log('Done! Refresh the page and see what happened')
    }
  };


  if (bTaskBroadcast) {
    g_TasksQueue.push(DoTaskBroadcast);
    console.log('Added task `Broadcast`');
  }
  if (bTaskWorkshop) {
    g_TasksQueue.push(DoTaskWorkshop);
    console.log('Added task `Workshop`');
  }
  if (bTaskCommunityProfile) {
    g_TasksQueue.push(DoTaskCommunityProfile);
    console.log('Added task `CommunityProfile`');
  }
  if (bTaskJoinGroup) {
    g_TasksQueue.push(DoTaskJoinGroup);
    console.log('Added task `JoinGroup`');
  }
  if (bTaskProfileComment) {
    g_TasksQueue.push(DoTaskProfileComment);
    console.log('Added task `ProfileComment`');
  }
  if (bTaskFeedRateUp) {
    g_TasksQueue.push(DoTaskFeedRateUp);
    console.log('Added task `FeedRateUp`');
  }
  if (bTaskPostStatus) {
    g_TasksQueue.push(DoTaskPostStatus);
    console.log('Added task `PostStatus`');
  }
  if (bTaskDiscussionsSearch) {
    g_TasksQueue.push(DoTaskDiscussionsSearch);
    console.log('Added task `DiscussionsSearch`');
  }
  if (bTaskSelectBadge) {
    g_TasksQueue.push(DoTaskSelectBadge);
    console.log('Added task `SelectBadge`');
  }

  if (!g_TasksQueue.length) {
    console.log('Nothing to do. Great job! :)');
    return;
  }

  DoNextTask();
})();