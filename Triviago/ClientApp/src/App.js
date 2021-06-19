import React, { Component } from 'react';
import { Route } from 'react-router';

import { Register } from './components/Register';
import { Login } from './components/Login';
import { Homepage } from './components/Homepage';
import { SoloPlay } from './components/SoloPlay';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <>
            <Route exact path='/Register' component={Register} />
            <Route exact path='/' component={Homepage} />
            <Route exact path='/Login' component={Login} />
            <Route exact path="/SoloPlay" component={SoloPlay}/>
      </>
    );
  }
}
