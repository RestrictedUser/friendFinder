var friends = require("../data/friends");

module.exports = function(app) {
  // Return all friends found in friends.js as JSON
  app.get("/api/friends", function(req, res) {
    res.json(friends);
  });

  app.post("/api/friends", function(req, res) {
    console.log(req.body.scores);

    // Receive user details (name, photo, scores)
    var user = req.body;

    // parseInt for scores
    for(var i = 0; i < user.scores.length; i++) {
      user.scores[i] = parseInt(user.scores[i]);
    }

    // default friend match is the first friend but result will be whoever has the minimum difference in scores
    var bestFriendIndex = 0;
    var minimumDifference = 30;

    // in this for-loop, start off with a zero difference and compare the user and the ith friend scores, one set at a time
    //  whatever the difference is, add to the total difference
    for(var i = 0; i < friends.length; i++) {
      var totalDifference = 0;
      for(var j = 0; j < friends[i].scores.length; j++) {
        var difference = Math.abs(user.scores[j] - friends[i].scores[j]);
        totalDifference += difference;
      }

      // if there is a new minimum, change the best friend index and set the new minimum for next iteration comparisons
      // When loop hits a friend that qualifies the bestFriendsIndex recives a value = i which represents an index in friends array.
      // if totalDiff is less then the previous friend then set minDiff = lowest totalDiff
      
      // ex. index i hits friends[2]=John and gets a totalDiff = 25 which is less then minDiff defualt so John becomes current bestFriend and the new minDiff = 25
      //ex. index i hits friends[3] Dave and gets a totalDiff = 20 which is less then Johns totalDiff so Dave becomes the new current bestFriend and the new minDiff = 20.
      if(totalDifference < minimumDifference) {
        // value givin to i represents the bestFriend that will be chosen from friends[i]
        bestFriendIndex = i;
        minimumDifference = totalDifference;
      }
    }

    // after finding match, add user to friend array. So that the current users info can be used to match bestFriends with a new user
    friends.push(user);

    // send back to browser the best friend match
    res.json(friends[bestFriendIndex]);
  });
};