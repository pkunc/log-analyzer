/**
 * PARSE TOOLS
 */

/**
 * Dependencies
 */
const fs = require('fs');
const chalk = require('chalk');
const promisify = require('es6-promisify');
const _ = require('lodash');
const { rules } = require('../lib/parseRules.js');  // parameters how to parse each log type

/**
 * Supporting functions
 */
function onerror(err) {
  // log any uncaught errors in coroutines
  console.log(chalk.red(`[onerror] ERROR message = "${err.message}"`));
  console.log(`[onerror] ERROR stack = "${err.stack}"`);
  /* throw err; */
}

/**
 * The function that parses filename and returns for which service log is
 */
function getLogType(fileName) {
  // usually the filename is like: "./logs/2016-09-11.FILES2.txt",
  // so we have to skip the first dot
  const firstDot = fileName.indexOf('.', 2);
  const secondDot = fileName.indexOf('.', firstDot + 1);

  // console.log(`Jmeno souboru je ${fileName}`);
  // console.log(`Tecka je na ${firstDot}.poradi`);
  // console.log(`Tecka je na ${secondDot}.poradi`);
  const type = fileName.slice(firstDot + 1, secondDot);
  // console.log(chalk.blue(`Vykousnuto: ${type}`));
  return type;
}

/**
 * The function parses one line and returns selected entries in an object
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
 * The function that loads log file into linesArray,
 * parses it into parsedFileArray and then inserts it into database
 */
function* parseLogFile(fileName, dbHandle) {
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
      const arrayForBulkInsert = _.chunk(parsedFileArray, 10);

      for (const load of arrayForBulkInsert) {
        const objectForBulkInsert = { docs: load };

        console.log(chalk.green(`Bulk object to insert: ${JSON.stringify(objectForBulkInsert)}`));
        try {
          // yield promisify(dbHandle.bulk)(objectForBulkInsert);
          rowsNumber += load.length;
          console.log(chalk.green(`[db.bulk] OK inserted bulk data into database for file ${fileName} with objects: ${load.length}`));
        } catch (err) {
          console.log(chalk.red(`[db.bulk] ERROR while inserting bulk data into database for file ${fileName}:`), err.message);
          throw err;
        }
      }

      console.log(`######### Bulk object for file ${fileName} and type ${logType} sent to insert with objects: ${parsedFileArray.length}`);

      const waitTill = new Date(new Date().getTime() + (2 * 1000));
      while (waitTill > new Date()) { /* wait 2 seconds */ }
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

  console.log(`navratova hodnota je: ${rowsNumber}`);
  return rowsNumber;
}

module.exports.getLogType = getLogType;
module.exports.parseLine = parseLine;
module.exports.parseLogFile = parseLogFile;
