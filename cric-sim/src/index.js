import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Material Icons', 'Open Sans:400, 700', 'Montserrat:400, 700'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
