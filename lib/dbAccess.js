/**
 * Functions for retrieveing data from Cloudant database
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

const promisify = require('es6-promisify');

/**
 * Returns activites for the user using index
 * @param {object} db - dbhandle to the database.
 * @param {string} user - ID of the requested user (=email).
 */
function* getActivity(db, user) {
  const queryString = `{"selector": {"email": "${user}"}}`;
  console.log(`[db.getActivty] query = ${queryString}`);

  try {
    const coDbFind = promisify(db.find);
    const result = yield coDbFind(JSON.parse(queryString));
    return result.docs;
  } catch (err) {
    console.log(`[db.getActivty] ERROR while getting activity in DB for user ${user}.`);
    throw err;
  }
}

/**
 * Returns activites for the user using view
 * @param {object} db - dbhandle to the database.
 * @param {string} user - ID of the requested user (=email).
 */
function* getUserActions(db, user) {
  try {
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
    const coDbView = promisify(db.view);
    const result = yield coDbView('view-by-user', 'by-user', params);
    return result.rows;
  } catch (err) {
    console.log(`[db.getUserActions] ERROR while getting view in DB for user ${user}.`);
    throw err;
  }
}

/**
 * Returns list of all kinds of actions (field ACTION) stored in the database
 * @param {object} db - dbhandle to the database.
 */
function* getActions(db) {
  try {
    let params = {};
    params = {
      reduce: true,
      group: true,
    };
    const coDbView = promisify(db.view);
    const result = yield coDbView('view-by-event', 'by-event', params);
    return result.rows;
  } catch (err) {
    console.log('[db.getActions] ERROR while getting view for list of events.');
    throw err;
  }
}

module.exports.getActivity = getActivity;
module.exports.getUserActions = getUserActions;
module.exports.getActions = getActions;
