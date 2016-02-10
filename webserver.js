var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
app.use(serveStatic(__dirname));
app.listen(5000);
