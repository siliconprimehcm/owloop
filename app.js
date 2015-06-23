var express = require('express');
var app = module.exports = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
      res.sendfile("./index.html");
});

http.listen(1338, function(){
  	console.log('listening on port:1338');
});



