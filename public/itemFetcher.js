import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.1/+esm'

export async function getNItems(steamId, n) {
	const apiUrl = `http://localhost:3000/steamApi/inventory/${steamId}/730/2?l=english&count=${n}`
	//const apiUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=${n}`;
	try {
		const response = await axios.get(apiUrl);
		return response;
	} catch (error) {
		console.error(error);
	}

}
