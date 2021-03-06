import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app.js';
import About from './containers/about.js';
import Home from './containers/home.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/about" component={About}/>
  </Route>
);
