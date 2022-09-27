const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, createCallback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, `${id}.txt`);

    fs.writeFile(filePath, text, (err) =>{
      if (err) {
        throw ('error writing TODO file');
      } else {
        createCallback(null, {id, text});
      }

    });
  });
};

exports.readAll = (readAllCallback) => {
  fs.readdir(exports.dataDir, 'utf8', (err, dirList) => {
    if (err) {
      console.log(err);
    } else {
      mappedDirList = dirList.map((file) => {
        var fileObject = {id: file.slice(0, -4), text: file.slice(0, -4)};
        return fileObject;
      });
      readAllCallback(null, mappedDirList);
    }
  });
};



exports.readOne = (id, callback) => {
  var toDoPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(toDoPath, (err, fileData) => {
    if (err) {
      /////////// CAN'T THROW STOPS SERVER, pass error to callback instead
      callback('No Such ID exists');
    } else {
      // var fileObject = {id: id, text: fileData};
      callback(null, {id: id, text: fileData.toString()});
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
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
