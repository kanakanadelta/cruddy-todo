const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//   items[id] = text;
//   callback(null, {id: id, text: text});
// };

// exports.readOne = (id, callback) => {
//   var item = items[id];
//   if (!item) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, {id: id, text: item});
//   }

  counter.getNextUniqueId((err, id) => {

    console.log(id)
    fs.writeFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }   
    });
  });
};

exports.readAll = (callback) => {
  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);

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
