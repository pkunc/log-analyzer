/**
 * Functions for retrieveing data from Cloudant database
 * @author Petr Kunc <petr_kunc@cz.ibm.com>
 */

/**
 * Returns activites for the user
 * @param {object} collection - handle to the database collection.
 * @param {string} user - ID of the requested user (=email).
 */
async function getActivity(collection, user) {
  console.log(`[db.getActivty] Getting activity for user ${user}`);

  try {
    const result = await collection.find({ email: user }).toArray();
    return result;
  } catch (err) {
    console.log(`[db.getActivty] ERROR while getting activity in DB for user ${user}.`);
    throw err;
  }
}

/**
 * Returns list of all kinds of actions (field ACTION) stored in the database
 * @param {object} collection - handle to the database collection.
 */
async function getActions(collection) {
  try {
    const result = await collection.aggregate([
      { $group: { _id: { service: '$service', event: '$event' }, total: { $sum: 1 } } },
      { $project: { action: '$_id', total: '$total', _id: 0 } },
      { $sort: { action: 1 } },
    ]).toArray();
    return result;
  } catch (err) {
    console.log('[db.getActions] ERROR while getting view for list of events.');
    throw err;
  }
}

/**
 * Returns list of users and their first and last activity data
 * @param {object} collection - handle to the database collection.
 */
async function getUserDate(collection) {
  try {
    const result = await collection.aggregate([
      { $group: { _id: '$email', firstLogin: { $min: '$date' }, lastLogin: { $max: '$date' } } },
      { $project: { email: '$_id', firstLogin: '$firstLogin', lastLogin: '$lastLogin', _id: 0 } },
      { $sort: { email: 1 } },
    ]).toArray();
    return result;
  } catch (err) {
    console.log('[db.getUserDate] ERROR while getting view for user login dates.');
    throw err;
  }
}

// module.exports.getActivity = getActivity;
// module.exports.getActions = getActions;
// module.exports.getUserDate = getUserDate;
