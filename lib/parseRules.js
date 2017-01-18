/**
 * Parse Rules for ParseTools library
 */

let rules = {};
rules.FILES2 = {};    // create oject to store 3 arrays for each log type
rules.FILES2.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];   // names of properies within object
rules.FILES2.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome ']; // substrings to cut off
rules.FILES2.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];  // end of substring to copy into property
rules.SAMETIME = {};
rules.SAMETIME.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'status'];
rules.SAMETIME.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'outcome '];
rules.SAMETIME.endChars = [' ', ' ', ', ', ')', ' ', ' '];
rules.DOCS = {};
rules.DOCS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.DOCS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.DOCS.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.FEB = {};
rules.FEB.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.FEB.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.FEB.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.FORUMS = {};
rules.FORUMS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.FORUMS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.FORUMS.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.COMMUNITIES = {};
rules.COMMUNITIES.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.COMMUNITIES.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.COMMUNITIES.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.PROFILE = {};
rules.PROFILE.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.PROFILE.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.PROFILE.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.STMEETINGS = {};
rules.STMEETINGS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.STMEETINGS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.STMEETINGS.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.WIKIS = {};
rules.WIKIS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'wiki', 'status'];
rules.WIKIS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'name=\"', 'outcome '];
rules.WIKIS.endChars = [' ', ' ', ', ', ')', ' ', '\"', '\"', ' '];
rules.BLOGS = {};
rules.BLOGS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'blog', 'status'];
rules.BLOGS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'name=\"', 'outcome '];
rules.BLOGS.endChars = [' ', ' ', ', ', ')', ' ', '\"', '\"', ' '];
rules.CONTACT = {};
rules.CONTACT.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.CONTACT.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.CONTACT.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.COMPANY = {};
rules.COMPANY.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.COMPANY.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.COMPANY.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.NOTES_NRPC_SESSION = {};
rules.NOTES_NRPC_SESSION.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.NOTES_NRPC_SESSION.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.NOTES_NRPC_SESSION.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.REPORTS_AUDIO = {};
rules.REPORTS_AUDIO.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.REPORTS_AUDIO.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.REPORTS_AUDIO.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];
rules.BSS = {};
rules.BSS.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'status'];
rules.BSS.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'outcome '];
rules.BSS.endChars = [' ', ' ', ', ', ')', ' ', ' '];
rules.LIVE_ADMIN = {};
rules.LIVE_ADMIN.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'status'];
rules.LIVE_ADMIN.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'outcome '];
rules.LIVE_ADMIN.endChars = [' ', ' ', ', ', ')', ' ', ' '];
rules.AUTH = {};
rules.AUTH.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'status'];
rules.AUTH.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'outcome '];
rules.AUTH.endChars = [' ', ' ', ', ', ')', ' ', ' '];
rules.ACTIVITIES = {};
rules.ACTIVITIES.propertyName = ['date', 'email', 'userid', 'customerid', 'event', 'object', 'status'];
rules.ACTIVITIES.beginChars = ['', ' user ', '(id=', 'customerId=', 'performed ', 'name=\"', 'outcome '];
rules.ACTIVITIES.endChars = [' ', ' ', ', ', ')', ' ', '\"', ' '];

module.exports.rules = rules;
