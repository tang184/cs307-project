var express = require('express');
var app = express();
var path = require('path');



app.use(express.static('assets'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
    });

app.use(express.static(__dirname));
app.listen(8080);