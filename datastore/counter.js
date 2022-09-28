const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
                         /* (error, id) */
exports.getNextUniqueId = (setIDCallBack) => {
  // counter = counter + 1;
  // read count use efcb to return a Number(filedata)
  readCounter((err, int) => {
    if (err) {
      setIDCallBack(err);
    } else {
      var currentCount = int;
      currentCount++;
      writeCounter(currentCount, (err, uniqueID) => {
        setIDCallBack(err, uniqueID);
      });
    }
  });
  // console.log('Current Count:' + currentCount + ' after readCounter');
  // // increment count
  // currentCount++;
  // console.log('After increment: ' + currentCount);
  // // use writeCounter with incremented count, callback returns counterstring to use as id
  // writeCounter(currentCount, (err, countString) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     return countString;
  //   }
  // });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
