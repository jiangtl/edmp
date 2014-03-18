var sys = require('sys');
var fs = require('fs');
var express = require('express');
var app = express();
var email = require('./email');
var category = require('./category');
var collection = require('./collection');
var sc = require('./sc');

app.configure(function () {	
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use('/web', express.static(__dirname + '/web'))
});

app.post('/category/list', function(req, res) {
	category.list(req, res);
});
app.post('/category/add', function(req, res) {
	category.add(req, res);
});
app.post('/category/update', function(req, res) {
	category.update(req, res);
});
app.get('/category/del', function(req, res) {
	category.del(req, res);
});

app.get('/collection/list', function(req, res) {
	collection.list(req, res);
});

app.get('/email/list', function (req, res) {
	var search = {
		type : req.query.type,
		addTime :  req.query.addTime,
		email :  req.query.email,
		limit :	 req.query.limit,
		start :  req.query.start,
	};
	var callback = req.query.callback;	
	email.list(search, function(data){
		res.send(callback+"("+data+")");
	});	
});
app.get('/scapi/getlist', function(req, res){
	var search = {
		type : req.query.type,
		limit : 10000,
		email : req.query.email,
		start_date :  req.query.start_date,
		end_date :  req.query.end_date,
		days :	 req.query.days
	};
	var callback = req.query.callback;	
	console.log(callback);
	sc.getlist(search, function(data){
		res.send(callback+"("+data+")");
	});	
})
app.listen(8088);
console.log("8088 running...");