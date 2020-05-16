import React from 'react';
import './styles/imports.scss';
import fb from './config/fireBase.js';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';

interface IState {
  userObj: object | null,
}
export default class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      userObj: null,
    }
  }

  componentDidMount() {
    this.onAuth();
  }

  private onAuth():void {
    fb.auth().onAuthStateChanged((userData: object | null) => {
      if(userData) {
        this.setState({userObj: userData});
      }
    });
  }

  public render() {
    return(
      <Router>
        <Switch>
          {!this.state.userObj ?
            <>
              <Route exact path="/" render={() => (<Redirect to="/login" />)} /> 
              <Route exact path='/login'>
                <Login />
              </Route>
            </> :
            <>
              <Route exact path="/" render={() => (<Redirect to="/home" />)} />
              <Route exact path='/home'>
                <HomePage />
              </Route>
            </>
          }
        </Switch>
      </Router>
    )
  }
}
