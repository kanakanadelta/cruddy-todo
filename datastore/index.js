const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //invoke getNextUniqueId to retrieve id from counter
  counter.getNextUniqueId((err, id) => {
    //since we are in scope, we are able to get the id, and write a new file with given padded id.
    fs.writeFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
      //error-first callback pattern initiate - node.js standard practice
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }
    });
  });
};

//check if todo-item is written in the directory it is looking for
exports.readOne = (id, callback) => {
  //no longer using the items object, instead use DataDir
  // var item = items[id];

  fs.readFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
    //error-first callback pattern initiate - node.js standard practice
    if (err) {
      callback(err);
    } else if (!item) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: item});
    }
  })
};

exports.readAll = (callback) => {
  var data = [];
  _.each(items, (item, idx) => {
    data.push({ id: idx, text: items[idx] });
  });
  callback(null, data);

  //iterate through our data folder / "todo list"
    //retrieve length?

};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if(!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`))
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
