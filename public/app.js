const loginUrlParams = {
  'openid.ns': 'http://specs.openid.net/auth/2.0',
  'openid.mode': 'checkid_setup',
  'openid.return_to': 'http://localhost:3000/openIdProxy',
  'openid.realm': (location.protocol === 'https:' ? 'https' : 'http') + '://' + location.host,
  'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
  'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
};

// Construct the Steam login URL
const steamLoginUrl = 'https://steamcommunity.com/openid/login' + '?' + new URLSearchParams(loginUrlParams);


const htmlElement = document.createElement('html');
const headElement = document.createElement('head');
const bodyElement = document.createElement('body');

// Create meta elements
const metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
const metaViewport = document.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

// Create link elements
const linkCss = document.createElement('link');
linkCss.setAttribute('rel', 'stylesheet');
linkCss.setAttribute('href', './styles/output.css');
const linkFontAwesome = document.createElement('link');
linkFontAwesome.setAttribute('rel', 'stylesheet');
linkFontAwesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');
linkFontAwesome.setAttribute('integrity', 'sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==');
linkFontAwesome.setAttribute('crossorigin', 'anonymous');
linkFontAwesome.setAttribute('referrerpolicy', 'no-referrer');

// Create body content
const divContainer = document.createElement('div');
divContainer.className = 'flex items-center justify-center h-screen bg-slate-900 text-white';

const aLink = document.createElement('a');
aLink.className = 'bg-steam-lightGray text-xl px-5 py-3 rounded-md font-bold flex items-center space-x-4 hover:bg-gray-600 transition duration-75';

const iFontAwesome = document.createElement('i');
iFontAwesome.className = 'fa-brands fa-steam text-2xl';

const spanText = document.createElement('span');
spanText.textContent = 'Login with Steam';

// Build the DOM structure
aLink.appendChild(iFontAwesome);
aLink.appendChild(spanText);
divContainer.appendChild(aLink);
bodyElement.appendChild(divContainer);

aLink.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default link behavior
  window.location.href = steamLoginUrl; // Perform the redirection
});

headElement.appendChild(metaCharset);
headElement.appendChild(metaViewport);
headElement.appendChild(linkCss);
headElement.appendChild(linkFontAwesome);
htmlElement.appendChild(headElement);
htmlElement.appendChild(bodyElement);

// Add the entire HTML structure to the document
document.documentElement.replaceWith(htmlElement);

document.body.appendChild(list);



