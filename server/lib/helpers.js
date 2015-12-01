'use strict';
var Promise = require('bluebird');
var db = require('../db/dbconfig');
var User = db.User;
var Tag = db.Tag;
var Snippet = db.Snippet;

module.exports = {
  // Create a new user and add to database
  findOrCreateUser: function (profile) {
    return new Promise(function (resolve, reject) {
      db.User.findOrCreate({
        where: {
          username: profile.username,
          imgUrl: profile._json.avatar_url,
        }
      }).spread(function (user, created) {
        resolve(user, created);
      }).catch(reject);
    });
  },

  findUserByUsername: function (username) {
    return new Promise(function (resolve, reject) {
      db.User.findOne({
        where: {
          username: username
        }
      }).then(function (user) {
        resolve(user);
      }).catch(function (err) {
        reject('Got an error: ', err);
      });
    });
  },

  // Writes a new snippet to the database
  writeSnippet: function (req, cb) {
    // takes the array of body tags and turns them into objects
    // Parses snippet
    var snippet = escape(req.body.text);
    var languageScope = req.body.scope;
    var snipTitle = escape(req.body.title);
    var tab = escape(req.body.tabPrefix);
    var forkedFrom = req.body.forkedFrom;
    var tags = req.body.tags;

    // Building snippet object to create
    var post = {
      text: snippet,
      forkedCount: 0,
      tabPrefix: tab,
      title: snipTitle,
      scope: languageScope,
      forkedFrom: forkedFrom
    };

    // Retrieves user name from request
    var user = req.user.username;

    // Searches for User based on request
    User.findOrCreate({
      where: { username: user }
      // if found, adjusts snippet userId to match found user's id
    })
    .then(function (result) {
      post.userId = result[0].id;
      return Snippet.create(post)
        .then(function (post) {
        // generate tag objects so that we can add them to the post
        return Promise.map(tags, function (tag) {
          return Tag.findOrCreate({
            where: {tagname: tag}
          });
        })
        .then(function (tags) {
          var tagsArray = [];
          for (var i = 0; i < tags.length; i++) {
            tagsArray.push(tags[i][0]);
          }
          return post.addTags(tagsArray)
            .then(function () {
              cb(null, post);
            })
        })      
      })
    })
    .catch(function(err){
      console.log(err.message);
      cb(err, null);
    });
  },

  // forks a snippet from a single user for a single snippet
  forkSnippet: function (req, cb) {
    // Parses snippet
    var snippet = escape(req.body.text);
    var languageScope = req.body.scope;
    var snipTitle = escape(req.body.title);
    var tab = escape(req.body.tabPrefix);
    var forkedFrom = req.body.forkedFrom;
    var snippetId = req.body.id;
    var tags = req.body.tags;
    // Update our snippet's fork count
    Snippet.findOne({
      where: { id: snippetId }
    })
      .then(function (snippet) {
        var newCount = snippet.dataValues.forkedCount + 1;
        snippet.update({forkedCount: newCount });
      });
    // Building NEW snippet object to fork
    var post = {
      text: snippet,
      forkedCount: 0,
      tabPrefix: tab,
      title: snipTitle,
      scope: languageScope,
      forkedFrom: forkedFrom
    };
    // Retrieves user name from request
    var user = req.user.username;

    // Searches for User based on request
    User.findOrCreate({
      where: { username: user }
      // if found, adjusts snippet userId to match found user's id
    })
    .then(function (result) {
      post.userId = result[0].id;
      return Snippet.create(post)
        .then(function (post) {
        // generate tag objects so that we can add them to the post
        return Promise.map(tags, function (tag) {
          return Tag.findOrCreate({
            where: {tagname: tag}
          });
        })
        .then(function (tags) {
          var tagsArray = [];
          for (var i = 0; i < tags.length; i++) {
            tagsArray.push(tags[i][0]);
          }
          return post.addTags(tagsArray)
            .then(function () {
              cb(null, post);
            })
        })      
      })
    })
    .catch(function(err){
      console.log(err.message);
      cb(err, null);
    });
  },

  starSnippet: function (req, cb) {
    var snippetId = req.body.id;
    Snippet.findOne({
      where: { id: snippetId }
    })
      .then(function (snippet) {
        var newCount = snippet.dataValues.starCount === undefined ? 0 :  snippet.dataValues.starCount + 1;
        return snippet.update({starCount: newCount })
        .then(function (snippet) {
          cb(null, snippet);
        })
      })
      .catch(function (err) {
        cb (err, null);
      });
  },

  getSnippet: function (snippetID) {
    return Snippet.findOne({
      where: {
        id: snippetID
      },
      include: [{
        model: User
      }]
    }).then(function (result) {
      return result;
    });
  },

  updateSnippet: function (req) {
    // Parse and sanitize req
    var snippet = escape(req.body.text);
    var languageScope = req.body.scope;
    var snipTitle = escape(req.body.title);
    var tab = escape(req.body.tabPrefix);
    var tags = req.body.tags;
    // Building snippet object to create
    var post = {
      text: snippet,
      tabPrefix: tab,
      title: snipTitle,
      scope: languageScope,
    };
    // Update Snippet
    return Snippet.update(post, {
      where: {
        id: req.body.id
      }
    }).then(function (result) {
      return result;
    });
  },

  getSnippetsMostRecent: function () {
    //Search all snippets, limit 20, ordered by createdAt date
    return Snippet.findAll({
      limit: 20,
      order: 'createdAt DESC',
      include: [
      { model: User }, 
      { model: Tag }
      ]
    }).then(function (result) {
      return result;
    });
  },

  getSnippetsByUser: function (user, cb) {
    User.find({
      where: {
        username: user
      }
    }).then(function (user) {
      var id = user.get('id');
      Snippet.findAll({
        where : {
          userId : id
        },
        include: [
        { model: User },
        { model: Tag }
        ]
      }).then(function (result) {
        //We are good here;
        cb(null, result);
      }).catch(function (err) {
        cb(err);
      });
    });
  },

  searchSnippets: function (searchTerm) {
    return Promise.map(searchTerm.split(' '), function (term) {
      return db.Snippets.findAll({ include: [{
        model: db.Tags,
        where: { tagname: term }
      }]});
    });
  },

  followUser: function (userToFollow, user) { 
    return Promise.all([
      User.findOne({where: {username: userToFollow}}), 
      User.findOne({where: {username: user}})])
    .spread(function (userToFollow, user) {
      return userToFollow.addFollower(user);
    })
    .then(function (something) {
      // DO SOMETHING;
    });
  }, 

  getFollowers: function (user) {
    return User.findOne({where: {username: user}})
            .then(function (user) {
              return user.getFollower()
            })
            .then(function (followersArray) {
              return Promise.map(followersArray, function (followerObj) {
                return User.findOne({where: {id: followerObj.dataValues.id}})
              })
              .then(function (followers) {
                console.log('followers', followers)
                return followers;
              })
            });
  }
};
