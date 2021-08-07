import React, { Component } from 'react';
import { Route } from 'react-router';

import { Register } from './routes/Register';
import { Login } from './routes/Login';
import { Homepage } from './routes/Homepage';
import { SoloPlay } from './routes/SoloPlay';
import { MultiplayerLobby } from './routes/MultiplayerLobby'
import { GameSession } from './routes/GameSession'
export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <>
            <Route exact path='/Register' component={Register} />
            <Route exact path='/' component={Homepage} />
            <Route exact path='/Login' component={Login} />
            <Route exact path="/SoloPlay" component={SoloPlay} />
            <Route exact path="/MultiplayerLobby" component={MultiplayerLobby} />
            <Route path="/GameSession/:gameSID" component={GameSession}/>
                
      </>
    );
  }
}
