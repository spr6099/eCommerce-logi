(\*)npx express-generator --view=hbs
npm install express

(\*)
npm install -g nodemon
npm i express-handlebars

(\*)
install bootstrap

(\*)
enctype="multipart/form-data"
https://www.npmjs.com/package/express-fileupload
npm i express-fileupload
app.js
------
var fileupload = require("express-fileupload");
app.use(fileupload());

(\*)
npm i express-session