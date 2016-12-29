/**
 * Functions for retrieveing data from Cloudant database
 */

/**
 * Dependencies
 */
const promisify = require('es6-promisify');

/**
 * Returns activites for the user
 */
function* getActivity(db, user) {
  const queryString = `{"selector": {"email": "${user}"}}`;
  console.log(`query = ${queryString}`);

  try {
    const coDbFind = promisify(db.find);
    const result = yield coDbFind(JSON.parse(queryString));
    return result.docs;
  } catch (err) {
    console.log(`ERROR while getting activity in DB for user ${user}.`);
    throw err;
  }
}

/**
 * View in database
 */
function* getUserActions(db, user) {
  console.log('Zacinam cist View');
  try {
    const coDbView = promisify(db.view);
    let params = {};
    if (user) {
      params = {
        reduce: true,
        group: true,
        keys: [user],
      };
    } else {
      params = {
        reduce: true,
        group: true,
      };
    }
    const result = yield coDbView('view-by-user', 'by-user', params);
    return result.rows;
  } catch (err) {
    console.log(`ERROR while getting view in DB for user ${user}.`);
    throw err;
  }
}

module.exports.getActivity = getActivity;
module.exports.getUserActions = getUserActions;
