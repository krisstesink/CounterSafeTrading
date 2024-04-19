function p(arr) {
    return '<pre>' + JSON.stringify(arr, null, 2) + '</pre>';
}

// Replace PHP's $_GET with URLSearchParams in JavaScript
const queryParams = new URLSearchParams(window.location.search);

const params = {
    'openid.assoc_handle': queryParams.get('openid.assoc_handle'),
    'openid.signed': queryParams.get('openid.signed'),
    'openid.sig': queryParams.get('openid.sig'),
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'check_authentication',
};

const signed = params['openid.signed'].split(',');

signed.forEach(item => {
    const val = queryParams.get('openid_' + item.replace('.', '_'));
    params['openid.' + item] = val;
});

// Construct the data to be sent in the POST request
const data = new URLSearchParams(params);

// Data prep
const requestOptions = {
    method: 'POST',
    headers: {
        'Accept-language': 'en',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data.toString(),
};

// Send a POST request (requires server-side handling due to cross-origin restrictions)
// You may need to use server-side code or a proxy for making HTTP requests.

fetch('https://steamcommunity.com/openid/login', requestOptions)
    .then(response => response.text())
    .then(result => {
        if (result.match(/is_valid\s*:\s*true/i)) {
            const match = result.match(/^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/);
            const steamID64 = match && isNumeric(match[1]) ? match[1] : 0;
            console.log('Request has been validated by OpenID, returning the client ID (Steam ID) of: ' + steamID64);
        } else {
            console.log('Error: Unable to validate your request');
            return;
        }
        
        // Continue with user data retrieval
        const steamApiKey = 'CC44117316D82218722AE496A5644CF1';

        // Send an API request to Steam (requires server-side handling)
        fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamID64}`)
            .then(response => response.json())
            .then(response => {
                const userData = response.response.players[0];
                // You can use the userData object as needed.
            });
    });
