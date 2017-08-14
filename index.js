// require('dotenv').config({ path: './.env' });

const app = require('./server/server');

app.listen(process.env.PORT || 3000, () => {
  console.log(`INFO: app is listening on port ${process.env.PORT || 3000}.`);
});
