var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header('Content-Type', 'application/x-www-form-urlencoded');
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/random-board', function(request, response) {
	response.set('Content-Type', 'application/json');
	
	var reqdata = request.query;
	var data,
		board = [],
		width = reqdata.width,
		height = reqdata.height,
		whitespace = reqdata.whitespace;

	for (var r = 0; r < height; r++) {
		var temp = [];
		for (var c = 0; c < width; c++) {
			temp[c] = Math.random() * 100 > whitespace ? 1 : 0;
		}
		board[r] = temp;
	}

	data = {
		name: width + 'x' + height + ' random board',
		height: height,
		width: width
	};
	data.row_data = [];
	data.col_data = [];

	generate_data(data.row_data, board, height, width, 'row');
	generate_data(data.col_data, board, height, width, 'col');

	// print_board(board, width, height);

	response.send(JSON.stringify(data));
});


function generate_data(dest, src, height, width, order) {
	var lim1,lim2,row_order;
	row_order = order == 'row' ? true : false;
	lim1 = row_order ? height : width;
	lim2 = row_order ? width : height;

	for (var d1 = 0; d1 < lim1; d1++) {
		var sum = 0;
		var temp = [];
		for (var d2 = 0; d2 < lim2; d2++) {
			if ( (row_order && src[d1][d2] == 1) ||
				 (!row_order && src[d2][d1] == 1) ) {
				sum++;
			} else if (sum != 0) {
				temp.push(sum);
				sum = 0;
			}
		}
		if (sum != 0) temp.push(sum);
		if (temp.length == 0) temp.push(0);
		dest[d1] = temp;
	}
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


