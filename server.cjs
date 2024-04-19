const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const path = require('path');


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname }); // Send to login
});

app.get('/home', (req, res) => {
  const steamID64 = req.query.steamId || 0;
  res.send(`
    <!-- HTML file -->
    <!DOCTYPE html>
    <html>
    <head>
      <title>Script Example</title>
    </head>
    <body>
      <script type='module'>
        // First script: Set a variable
        window.steamIdVar = ${steamID64};
      </script>
      <div id="itemContainer">
        <!-- Content will be replaced by home.js -->
      </div>
      <script type='module' src="home.js"></script>
    </body>
    </html>
    `);
});

app.get('/steamApi/inventory/:steamId/:gameId/:contextId', async (req, res) => {
  const { steamId, gameId, contextId } = req.params;
  const response = await axios.get(`https://steamcommunity.com/inventory/${steamId}/${gameId}/${contextId}`, {
    params: req.query,
  });
  res.json(response.data);
});

app.get('/openIdProxy', async (req, res) => {
  try {
    // Extract the query string from the URL
    const query = req.url.split('?')[1];

    // Parse the query string into key-value pairs
    const params = new URLSearchParams(query);

    // Extract the specific OpenID parameters you need
    const openidParams = {
      'openid.assoc_handle': params.get('openid.assoc_handle'),
      'openid.signed': params.get('openid.signed'),
      'openid.sig': params.get('openid.sig'),
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'check_authentication',
    };

    console.log(openidParams);

    // Split and process openid_signed parameters
    const signed = params.get('openid.signed').split(',');

    console.log(signed);

    signed.forEach((item) => {
      const val = params.get('openid.' + item.replace('.', '_'));
      openidParams['openid.' + item] = val;
    });

    // Build the data for the HTTP POST request
    const data = new URLSearchParams(openidParams).toString();
    console.log(data);

    // Set up the HTTP POST request to Steam
    const response = await axios.post('https://steamcommunity.com/openid/login', data, {
      headers: {
        'Accept-language': 'en',
        'Content-type': 'application/x-www-form-urlencoded',
      },
    });

    // Check if the response indicates successful validation
    if (/is_valid\s*:\s*true/i.test(response.data)) {
      // Extract Steam ID from openid_claimed_id
      const matches = /https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/.exec(params.get('openid.claimed_id'));
      const steamID64 = (matches && matches[1]) || 0;

      console.log('Request has been validated by OpenID, Steam ID:', steamID64);

      // Make an API request to Steam
      const steam_api_key = '4327A6E6A22F21DFDA1292F6E6806135';

      const urlWithSteamId = `/home?steamId=${encodeURIComponent(steamID64)}`;

      res.send(`
        <!-- HTML file -->
        <!DOCTYPE html>
        <html>
        <head>
          <title>Script Example</title>
        </head>
        <body>
          <script type='module'>
            // First script: Set a variable
            window.location.href = '${urlWithSteamId}';
          </script>
        </body>
        </html>
      `);


    } else {
      console.log('Error: Unable to validate your request');
      res.send('Error: Unable to validate your request');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.send('Error: ' + error.message);
  }
});

app.get('/:filename', (req, res) => {
  // Get the filename from the route parameter
  const filename = req.params.filename;
  console.log("ballz LMAO" + filename);
  // Construct the relative path to the JavaScript file in the public folder
  const filePath = path.join(__dirname, 'public', filename);

  // Determine the Content-Type based on the file extension
  let contentType = 'application/javascript';

  // Set the Content-Type header
  res.setHeader('Content-Type', contentType);

  // Send the JavaScript file
  res.sendFile(filePath);
});


app.listen(port, () => {
  console.log(`Node.js server listening at http://localhost:${port}`);
});
