const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
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
      throw ('error reading data folder');
    } else {
      mappedDirList = dirList.map((file) => {
        var id = path.basename(file, '.txt');
        var toDoPath = path.join(exports.dataDir, file);
        return readFilePromise(toDoPath).then((fileData) => {
          return {
            id: id,
            text: fileData.toString()
          };
        });
      });
      Promise.all(mappedDirList)
        .then(items => readAllCallback(null, items));
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
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
