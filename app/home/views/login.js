import React, {Component} from 'react';
import _isEmpty from 'lodash/isEmpty';
import utilAuth from './../utils/auth';

class Login extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = {
      username: '',
      password: '',
      btnDisabled: true
    };
  };

  _handleChange(name, event) {
    let value = event.target.value;
    this.setState({[name]: value}, function() {
      let stateUsername = this.state.username,
        statePassword = this.state.password;
      this.setState({btnDisabled: _isEmpty(stateUsername) || _isEmpty(statePassword)});
    });
  };
  
  _handleKeyPress(event) {
    // Enter Key pressed
    if (event.charCode === 13 && !this.state.btnDisabled) {
      this._handleClick();
    }
  };

  _handleClick() {
    let self = this;

    // Disable button
    this.setState({btnDisabled: true});

    let credentials = {
      username: this.state.username,
      password: this.state.password
    };
    utilAuth.signIn(credentials, self, function(err, res) {
      // Enable button
      self.setState({btnDisabled: false});

      if (err) {
        switch(res.body.code) {
          case 'INVALID_USERNAME':
            window.alert(res.body.message);
            break;
          case 'INVALID_PASSWORD':
            window.alert(res.body.message);
            break;
          default:
            break;
        }
      }
    });
  };

  render() {
    return (
      <div>
        <label>Username</label><br />
        <input
          type='text'
          value={this.state.username}
          onChange={this._handleChange.bind(this, 'username')}
          onKeyPress={this._handleKeyPress}
        /><br />
        <label>Password</label><br />
        <input
          type='password'
          value={this.state.password}
          onChange={this._handleChange.bind(this, 'password')}
          onKeyPress={this._handleKeyPress}
        /><br />
        <button
          disabled={!!this.state.btnDisabled ? 'disabled' : ''}
          onClick={this._handleClick}
        >
          Sign in
        </button>
      </div>
    );
  };
};

export default Login;