import React, {Component} from 'react';
import utilAuth from './../utils/auth';

class App extends Component {
  constructor(props) {
    super(props);
    this._handleSignOutClick = this._handleSignOutClick.bind(this);
  };

  _handleSignOutClick() {
    utilAuth.signOut(this.props.router);
  };

  render() {
    return (
      <div>
        <button onClick={this._handleSignOutClick}>Sign Out</button>
        {this.props.children}
      </div>
    );
  };
};

export default App;
