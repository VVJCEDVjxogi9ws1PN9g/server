const path = require('path');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const chain = require('./chain');

const app = express();
app.use(bodyParser.json());
app.use(cors());

if (!fs.existsSync('counter2.txt')) {
	fs.writeFileSync('counter2.txt', '0');
}

app.get('/locations/:user', (req, res) => {
	const user = req.params.user;
	console.log(`Get location names for ${user}`);

	chain.getNames(user, (_err, result) => {
		res.json(result);
	});
});

app.post('/select-locations', (req, res) => {
	const ids = req.body.ids;
	const details = {};

	ids.forEach(id => {
		details[id] = JSON.parse(fs.readFileSync(`./points4/${getRating(id)}/${id}`).toString());
	});

	res.json(details);
});

app.use(express.static(path.join(__dirname, 'points4')));
app.listen(80, '0.0.0.0');

const RATING_BREAKPOINTS = [207974, 516027, 1015195];
function getRating(id) {
	if (id <= RATING_BREAKPOINTS[0]) return 1;
	else if (id <= RATING_BREAKPOINTS[1]) return 2;
	
	return 3;
}