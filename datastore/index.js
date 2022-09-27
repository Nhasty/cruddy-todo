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



exports.readOne = (id, readOneCallback) => {
  var toDoPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(toDoPath, (err, fileData) => {
    if (err) {
      /////////// CAN'T THROW STOPS SERVER, pass error to callback instead
      readOneCallback('No Such ID exists');
    } else {
      ////////// fileData is a buffer object, must be converted to put in object
      readOneCallback(null, {id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, updateCallback) => {
  var toDoPath = path.join(exports.dataDir, `${id}.txt`);
  // fs.truncate(toDoPath, (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  const flag = fs.constants.O_WRONLY | fs.constants.O_TRUNC;
  fs.writeFile(toDoPath, text, {flag}, (err) => {
    if (err) {
      updateCallback(err);
    } else {
      updateCallback(null, text);
    }
  });
};

exports.delete = (id, callback) => {
  var toDoPath = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(toDoPath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
