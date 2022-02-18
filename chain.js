const RPC_URL = 'https://speedy-nodes-nyc.moralis.io/b5ff4012083d66a83fad1e18/polygon/mumbai';
const CHAIN_ID = 80001;

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(RPC_URL);

const mflJson = require('./LAND.json');
const landData = mflJson.networks[CHAIN_ID];
const landContract = new web3.eth.Contract(mflJson.abi, landData.address);

console.log(landData.address);

module.exports = {
	getNames: async (address, callback) => {
		let data = await landContract.methods.getMyLands(address).call();
		data = data.filter(id => id > 0);

		const data2 = {};
		data.forEach(id => {
			data2[id] = JSON.parse(fs.readFileSync(`./points4/${getRating(id)}/${id}`).toString());
		});

		console.log(data2);

		callback(null, data2);
	}
}

const RATING_BREAKPOINTS = [207974, 516027, 1015195];
function getRating(id) {
	if (id <= RATING_BREAKPOINTS[0]) return 1;
	else if (id <= RATING_BREAKPOINTS[1]) return 2;
	
	return 3;
}