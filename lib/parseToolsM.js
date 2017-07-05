/**
 * Parse tools
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const fs = require('fs');
const chalk = require('chalk');
const { rules } = require('../lib/parseRules.js');  // parameters how to parse each log type

/**
 * Supporting functions
 */
function onerror(err) {
  // log any uncaught errors in coroutines
  console.log(chalk.red(`[onerror] ERROR message = "${err.message}"`));
  console.log(`[onerror] ERROR stack = "${err.stack}"`);
  // throw err;
}

/**
 * The function parses filename and returns for which service log is
 * @param {string} fileName - Name of the file.
 */
function getLogType(fileName) {
  // usually the filename is like: "./logs/2016-09-11.FILES2.txt",
  // so we have to skip the first dot
  const firstDot = fileName.indexOf('.', 2);
  const secondDot = fileName.indexOf('.', firstDot + 1);

  // console.log(`Filename is ${fileName}`);
  // console.log(`First dot is on ${firstDot}. position`);
  // console.log(`Second dot is on ${secondDot}. position`);
  const type = fileName.slice(firstDot + 1, secondDot);
  // console.log(chalk.blue(`Extracted: ${type}`));
  return type;
}

/**
 * The function parses one line and returns selected entries in an object
 * @param {string} inputLine - one line from the log file.
 * @param {string} logType - type od the log file (e.g. FILES, PROFILES, WIKIS, ...).
 */
function parseLine(inputLine, logType) {
  const lineObj = {};     // parsed entries go here
  let line = inputLine;   // copy param into working variable
  let cutPos = 0;       // number of characters that have to be cut off from the beginnig of the line
  let endPos = 0;       // number of characters that will be copied to property

  line += ' ';     // adding special character (space) at the EOL so I can search for it in indexOf()

  if (!rules[logType]) {
    return 'unknown';
  }
  lineObj.service = logType;

  for (let i = 0, len = rules[logType].propertyName.length; i < len; i += 1) {
    cutPos = line.indexOf(rules[logType].beginChars[i]) + rules[logType].beginChars[i].length;

    // console.log(`Have to cut fisrt ${cutPos} chars.`);
    const lineTemp = line.slice(cutPos);
    line = lineTemp;

    endPos = line.indexOf(rules[logType].endChars[i]);
    const propName = rules[logType].propertyName[i];
    lineObj[propName] = line.substring(0, endPos);

    // console.log(`stop char "${rules[logType].endChars[i]}" is on ${endPos}.char, property#${i}/${len} (${propName}) = ${lineObj[propName]}`);
    // console.log(chalk.gray(`Remaining line to process: ${line}`));
  }

  //  console.log(JSON.stringify(lineObj));
  return lineObj;
}

/**
 * The function loads log file into linesArray,
 * parses it into parsedFileArray and then inserts it into database
 * @param {string} fileName - Name of the file.
 * @param {object} collection - handle to the database collection.
 * @param {boolean} writeDb - Whether to write result to the database or just to do "dry run" as a parsing test.
 * @returns {number} Number of rows successfully parsed.
 */
function* parseLogFile(fileName, collection, writeDb=false) {
  let fileContent;
  let linesArray;
  const parsedFileArray = [];
  let rowsNumber = 0; // number of rows successfully parsed form log file (return value)

  try {
    fileContent = fs.readFileSync(fileName);
    linesArray = fileContent.toString().split('\n');

    const logType = getLogType(fileName);

    for (let i = 0, len = linesArray.length; i < len; i += 1) {
      if (linesArray[i]) {
        // array is not empty (= is it not empty line)
        const parsedLine = parseLine(linesArray[i], logType);
        // console.log(`--- Processed line #${i}:`);
        // console.log(JSON.stringify(parsedLine));
        // append at the end of parsedFileArray
        if (parsedLine !== 'unknown') {
          parsedFileArray.push(parsedLine);
        } else {
          // console.log(`I do not know how to parse log type: ${logType}`);
        }

        // console.log("Parsed file array:" + JSON.stringify(parsedFileArray));
      } else {
        // console.log('Skipping empty line');
      }
    }

    // batch insert array of objects into database
    if (parsedFileArray.length === 0) {
      console.log(chalk.red(`######### File ${fileName} not parsed because rules for ${logType} are missing, nothing to insert into DB`));
    } else {
      console.log(chalk.green(`Bulk object to insert: ${JSON.stringify(parsedFileArray)}`));
      try {
        if (writeDb) {
          yield collection.insertMany(parsedFileArray);
        }
        rowsNumber += parsedFileArray.length;
        console.log(chalk.green(`[db.bulk] OK inserted bulk data into database for file ${fileName} with objects: ${parsedFileArray.length}`));
      } catch (err) {
        console.log(chalk.red(`[db.bulk] ERROR while inserting bulk data into database for file ${fileName}:`), err.message);
        throw err;
      }
      console.log(`######### Bulk object for file ${fileName} and type ${logType} sent to insert with objects: ${parsedFileArray.length}`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File ${fileName} not found!`);
    } else if (err.code === 'EACCES') {
      console.log('File not accessible!');
    } else {
      onerror(err);
      throw err;
    }
  }

  return rowsNumber;
}

module.exports.getLogType = getLogType;
module.exports.parseLine = parseLine;
module.exports.parseLogFile = parseLogFile;
