'use strict';
var Promise = require('bluebird');
var db = require('../db/dbconfig');
var User = db.User;
var Tag = db.Tag;
var Snippet = db.Snippet;


module.exports = {
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

  writeSnippet: function (req, cb) {
    // takes the array of body tags and turns them into objects
    // var tags = req.body.tags.map(function (tag) {
    //   return { tagname: tag };
    // });
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
      return Snippet.create(post);
    }).then(function (post) {
        // generate tag objects so that we can add them to the post
        // return Promise.map(tags, function (tag) {
        //   return Tag.findOrCreate({
        //     where: {tagname: tag}
        //   });
        // })
        Tag.findOrCreate({
          where: {tagname: tags[0]}
        })
        .then(function (tag) {
          console.log('tag', tag[0].id)
          console.log('POST', post)
          post.addTag([tag, tag[0].id]);
          cb(null, post);
        })
        // .then(function(post){
        //   cb(null, post);
        // });
        // cb(null, post);       
    })
    .catch(function(err){
      console.log(err.message);
      cb(err, null);
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
    //Search all snippets, limit 10, ordered by createdAt date
    return Snippet.findAll({
      limit: 10,
      order: 'createdAt DESC',
      include: [{
        model: User
      }]
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
        include: [{
          model: User
        }]
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
  }
};
