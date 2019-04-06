# log-analyzer
Download activity log files from Connections Cloud, parse them and upload to Cloudant database for future processing.
## Purpose
IBM Connections Cloud offers organisations two ways how to monitor and measure usage of its services:
*   Metrics. Allows Community owners or global admins see some selected statistics in a table or simple chart UI.
*   Journal logs. Each user activity is logged and stored in journal text files, available to admins via SFTP.
So *Metrics* has web UI but shows only a small subset of data, and *Journal logs* have all the data, but no user interface.

## What is inside?
*log-analyzer* is a set of tools, that allows admins to work with Journal logs:
### 1. Download logs.
First, you have to fetch log files. Script **downloadLogs.sh** connects to cloud journal server and download all log files into a local folder (logs/). Journal server keeps logs for 30 days.

![Journal Files](/images/journal-files.png)
*Image: example of journal file names downloaded from journal server.*

### 2. Parse logs.
Now you have all log files stored locally, and you need to parse them so you can work with the data.
Server-side JavaScript Node application **script/parse.js** takes care of it.

![Journal File Example](/images/journal-file-example.png)
*Image: This is how content of log file looks like.*

The script takes one file at a time, recognises its type, parse each line, transform data into JSON object and store such objects into NoSQL database in batch. I use the Cloudant database.

*Code: This is an example of JSON object with data parsed from log file. One object for one line.*
```javascript
{
  "service" : "FILES2",
  "date" : "2016-11-30T07:29:40+0000",
  "email" : "frank.adams@silvergreen.eu",
  "userid" : "200193207",
  "customerid" : "200081823",
  "event" : "FILE_DOWNLOADED",
  "object" : "image.jpg",
  "status" : "SUCCESS"
},
{
  "service" : "FILES2",
  "date" : "2016-11-30T13:22:35+0000",
  "email" : "heather.reeds@silvergreen.eu",
  "userid" : "200193924",
  "customerid" : "200081823",
  "event" : "FILE_VIEWED",
  "object" : "Budget Central.xlsx",
  "status" : "SUCCESS"
}
```

### 3. Browse logs.
Once are data from logs parsed and stored in a database, you can work with them - browse them, filter them, create charts, compute statistics and trends.
This part is in development. In the current release, you can access and browse data via a simple web interface provided by client-side JavaScript script **client/index.html**.
In this sample, you can select a user name and then browse/sort/filter activity entries that are stored for this user.

![Browsig User Activities](/images/browsing-user-activities.png)
*Image: Simple web application for browsing user activities.*

## License
The code and associated scripts are licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
