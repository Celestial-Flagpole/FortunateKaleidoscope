// # Database configuration

//We use sequelize ORM to connect to MySql database.
//Credentials for the database are stored in /lib/secrets.js
//To use with your own database recreate the file and export an
//object with the key 'sql' and your password as the value


// Declare dependencies
var Sequelize = require('sequelize');
if (process.env.NODE_ENV === 'production') {
  var sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
} else {
  var secret = require('../lib/secrets').sql;
  var sequelize = new Sequelize('sniphub', 'root', secret);
}
var mysql = require('mysql');

// Connection to MySql database using database named sniphub



var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  imgUrl: Sequelize.STRING
});

var Snippet = sequelize.define('snippet', {
  text : Sequelize.STRING(2000),
  forkedCount : Sequelize.INTEGER,
  tabPrefix : Sequelize.STRING,
  title : Sequelize.STRING,
  scope : Sequelize.STRING,
  forkedFrom : Sequelize.STRING, 
  starCount : Sequelize.INTEGER
});

// Tag tables are inserted for later addition of tags
var Tag = sequelize.define('tag', {
  tagname: {
    type: Sequelize.STRING,
    unique: true
  }
});

// Creates one to many relationship between User and Snippets table
// Instances of User will get the accessors getSnippets and setSnippets
Snippet.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Snippet, {foreignKey: 'userId'});
// Creates many to many relationship between Snippets and Tags
Snippet.belongsToMany(Tag, { through: 'snippet_tag'});
Tag.belongsToMany(Snippet, { through: 'snippet_tag'});
// This will create a new model called snippet_tag with the equivalent 
// foreign keys SnippetId and TagId. 
// This will add methods getSnippets, setSnippets, addSnippet,addSnippets
// to Tags, and getTags, setTags and addTag, addTags to Snippet.

User.belongsToMany(User, { as: 'Follower', through: 'Followers'});

sequelize
  .sync()
  .then(function (err) {
    console.log('It worked!');
    // Tag.create({tagname: 'test'})
    //   .then (function (tag) {
    //     console.log('tag', tag)
    //     Snippet.create({text: 'adfasdfasdf'})
    //     .then (function (snippet) {
    //       console.log('snippet', snippet)
    //       snippet.addTag(tag);
    //     })
    //   });
  }, function (err) {
    console.log('An error occurred while creating the table:', err);
  });
// Snippet.sync();
// User.sync();
// Tag.sync();



module.exports = {
  User: User,
  Snippet: Snippet,
  Tag: Tag,
};
