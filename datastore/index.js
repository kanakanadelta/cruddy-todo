const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
//promise consts
const Promise = require('bluebird');
////promise////
const readFilePromise = Promise.promisify(fs.readFile);
//promiseEnd//


// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //invoke getNextUniqueId to retrieve id from counter
  // counter.getNextUniqueId((err, id) => {
  //   //since we are in scope, we are able to get the id, and write a new file with given padded id.
  //   fs.writeFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
  //     //error-first callback pattern initiate - node.js standard practice
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback(null, {id: id, text: text});
  //     }
  //   });
  // });

  //Promise Refactor//
  counter.getNextUniqueId((err, id) => {

    var promise = function() {
      return new Promise(function(res, rej){
        fs.writeFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
        //error-first callback pattern initiate - node.js standard practice
          if (err) {
            rej(err);
          } else {
            res(id, text);
          }
        });
      });
    }
    promise()
      .then(function(res) {
        // console.log(res, {id: id, text: text})
        callback(null, {id: id, text: text});
      })
      .catch(function(err) {
        throw 'error';
      })
  });

};


exports.readAll = (callback) => {
  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
  
  // fs.readdir(exports.dataDir, (err, files) =>{
  //   if (err) {
  //     callback(err);
  //   } else {
  //     if(!files.length) {
  //       callback(null, data);
  //     } else if (files.length) {

  //       files.forEach((file) => {
  //         fs.readFile(path.join(exports.dataDir,file), (err, chunk) => {
  //           // console.log('file ',file, chunk.toString());
  //           let fileId = path.basename(file, '.txt')
  //           data.push({id: fileId, text: chunk.toString()})
  //           console.log('this is the data with objects', data)
  //         })
  //       })
  //       console.log('this is the data with objects 2', data)
  //       callback (null, data);
  //     }
  //   }
  // })

  // Promise refactor:
  fs.readdir(exports.dataDir, (err, files) =>{
    if (err) {
      callback(err);
    }
    //map through the files, and make new data array to return
    var data = _.map(files, (file) => {
      //assigning id to be padded number without the txt filename
      var id = path.basename(file, '.txt');
      var filePath = path.join(exports.dataDir, file);

      return readFilePromise(filePath)
        .then( (fileData) => {
          return { id: id, text: fileData.toString()}
        })
    });

    Promise.all(data)
      .then(function(promisedFiles) {
        callback(null, promisedFiles);
      })
      .catch(function(err) {
        throw 'error';
      })
  });
};

//check if todo-item is written in the directory it is looking for
exports.readOne = (id, callback) => {
  //no longer using the items object, instead use DataDir
  // var item = items[id];

  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8',(err, results) => {
    //error-first callback pattern initiate - node.js standard practice
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, {id: id, text: results});
      }
  })

  //Promise re-factor:
  // var promise = function() {
  //   return new Promise(function(res, rej){
  //     fs.readFile(path.join(exports.dataDir,`/`,`${id}.txt`), 'utf8', (err, results) => {
  //       //error-first callback pattern initiate - node.js standard practice
  //       if (err) {
  //         rej(err);
  //       } else {
  //         res(results);
  //       }
  //     })
  //   })
  // }
  // promise()
  //   .then(function(res){
  //     console.log('resolved!')
  //     callback(null, {id: id, text: results})
  //   })
  //   .catch(function(rej){
  //     throw 'error at readOne';
  //   })

};

exports.update = (id, text, callback) => {
  // var item = items[id];

  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, {id: id, text: text});
  // }

  fs.readFile(path.join(exports.dataDir,`/`,`${id}.txt`), (err, results) => {
    if (err) {
      callback(err);
    } else if (!id) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir,`${id}.txt`), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  })
};

exports.delete = (id, callback) => {
//   var item = items[id];
//   delete items[id];
//   if(!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }

//Asynchronously removes a file or symbolic link. 
//No arguments other than a possible exception are given to the completion callback.
  fs.unlink(path.join(exports.dataDir,`/`,`${id}.txt`), (err) => {
      callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
