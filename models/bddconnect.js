const mongoose = require('mongoose');

var user = process.env.MONGO_USER;
var password = process.env.MONGO_PWD;
var dbName = process.env.MONGO_URL;

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(`mongodb+srv://${user}:${password}@${dbName}`,
  options,
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.info('BDD PlainTextSearch OK');
    }
  }
);

module.exports = mongoose;