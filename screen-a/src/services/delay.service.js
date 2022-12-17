/**
 * Wait function
 * @param {number} ms
 */
const wait15seconds = async (ms) => {
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
};

module.exports = wait15seconds;