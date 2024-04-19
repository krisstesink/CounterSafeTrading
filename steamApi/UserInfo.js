const axios = require('axios');
import Escrow from 'abis/Escrow.abi'

async function main() {

  try {

	const apiKey = 'CC44117316D82218722AE496A5644CF1';
	const id = await resolveSteamID('https://steamcommunity.com/id/165641/', apiKey);

	
	const inventory = await getInventory(id)
	console.log(inventory);


  } catch (error) {
    console.error(error);
  }
}

async function resolveSteamID(userURL, apiKey) {
	try {
		return 76561198117193000;
	} catch (error) {
		console.error(error);
	}
}

async function getInventory(steamID) {
	try {
		const apiUrl = `https://steamcommunity.com/inventory/${steamID}/730/2?l=english&count=5000`;
		return await axios.get(apiUrl);
	} catch (error) {
		console.error(error);
	}

}

main()
  .then(() => {
    console.log('Async function completed.');
  })
  .catch((error) => {
    console.error('Async function failed:', error);
  });


