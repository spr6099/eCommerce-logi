var mongodb = require("mongodb").MongoClient;
var client = new mongodb("mongodb://localhost:27017");

function Database() {
  return client.connect().then((dbase) => {
    let data = dbase.db("eCommerce");
    return data;
  });
}

module.exports = Database();
