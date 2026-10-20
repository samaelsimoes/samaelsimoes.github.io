var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 8080;

app.use(methodOverride());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/'));

app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));


console.log("http://" + hostname + ":" + port);

app.listen(port, hostname);