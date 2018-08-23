const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

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


exports.readAll = (callback) => {
  var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
  
  fs.readdir(exports.dataDir, (err, files) =>{
    if (err) {
      callback(err);
    } else {
      if(!files.length) {
        callback(null, data);
      } else if (files.length) {

        let newData = [];

        console.log(files)
        files.forEach((file) => {
          fs.readFile(path.join(exports.dataDir,file), (err, chunk) => {
            let text = []
            text.push(chunk)
            console.log(file, Buffer.concat(text).toString());
            let fileId = file.slice(0,5);
            newData.push({id: fileId, text: Buffer.concat(text).toString()})
            data = newData
          })
        })
        console.log('this is the data with objects', newData)
        callback (null, newData);
      }
    }
  })

  //iterate through our data folder / "todo list"
  //retrieve length?

};

//check if todo-item is written in the directory it is looking for
exports.readOne = (id, callback) => {
  //no longer using the items object, instead use DataDir
  // var item = items[id];

  fs.readFile(path.join(exports.dataDir,`/`,`${id}`), (err, results) => {
    //error-first callback pattern initiate - node.js standard practice
    var text= []
    if (err) {
      // console.log('this is id! ', `${id}`)
      // console.log('error callback!',err)
      callback(err);
    } else {
      // console.log(Buffer.concat(ar).toString())
      if (!results) {
        console.log('no result found')
        callback(new Error(`No item with id: ${id}`));
      } else {
        text.push(results);
        text = Buffer.concat(text).toString()
        console.log({id: id, text: text})
        callback(null, {id: id, text: text});
      }
    }
  })
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
