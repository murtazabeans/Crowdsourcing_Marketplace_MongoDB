import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';  
import {bindActionCreators} from 'redux';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/simple-line-icons.css';
import '../css/custom.css';
import Home from './Home';
import axios from 'axios';
import Background from '../img/bg-01.jpg';
import {withRouter} from 'react-router-dom'
import { Redirect } from 'react-router';
import allreducers from '../reducers';
// import UserSession from '../reducers/user-session'
import reducer from '../reducers/user-session';
import { debug } from 'util';



class SignUp extends Component {


  constructor(props){
    super(props);
    this.state = { name: '', email: '', password: '' , emailAlreadyPresent: false};
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  componentWillMount(){
    // var self = this;
    // axios.get('http://localhost:3001/check_session', { withCredentials: true })
    // .then((response) => {
    //   if(response.data.session.email !=  undefined){
    //     window.location.href = "http://localhost:3000/projects";
    //   }
    // })
  }

  handleNameChange(e){
    this.setState({ name: e.target.value });
    e.target.value == "" ? document.getElementById("name-error").innerHTML = "Please enter your name" : 
      document.getElementById("name-error").innerHTML = "";
  }
  handlePasswordChange(e){
    this.setState({ password: e.target.value });
    e.target.value == "" ? document.getElementById("password-error").innerHTML = "Please enter your password" : 
      document.getElementById("password-error").innerHTML = "";
  }
  handleEmailChange(e){
    this.setState({ email: e.target.value });
    e.target.value == "" ? document.getElementById("email-error").innerHTML = "Please enter your email" : 
      document.getElementById("email-error").innerHTML = "";
  }
  handleFormSubmit(e){
    e.preventDefault();
    let form_values = {name: this.state.name.trim(), password: this.state.password.trim(), email: this.state.email.trim()};
    let nameErrorPresent = !this.validateNameFormat(this.state.name) ? true : false;
    let passwordErrorPresent = !this.validatePasswordFormat(this.state.password) ? true : false;
    let emailErrorPresent = !this.validateEmailFormat(this.state.email) ? true : false;

    axios.post('http://localhost:3001/check_email', form_values)
    .then((response) => {
      var self = this;
      if(response.data.emailPresent){
        document.getElementById("email-error").innerHTML = "Email already present";
        self.setState({emailAlreadyPresent: true});
      }
    })
    debugger
    // this.state.emailAlreadyPresent || nameErrorPresent || passwordErrorPresent || emailErrorPresent ? "" : this.props.registerUser(form_values);
    this.props.registerUser(form_values);
  }

  validateNameFormat(name){
    if(name.trim() == ""){
      document.getElementById("name-error").innerHTML = "Please enter your name";
      return false;
    }
    return true;
  }

  validatePasswordFormat(password){
    if(password.trim() == ""){
      document.getElementById("password-error").innerHTML = "Please enter your password";
      return false;
    }
    else if(password.trim().length < 8){
      document.getElementById("password-error").innerHTML = "Password should be of 8 characters or more";
      return false;
    }
    return true;
  }

  validateEmailFormat(email){
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email == ""){
      document.getElementById("email-error").innerHTML = "Please enter your email";
      return false;
    }
    else if(!regex.test(String(email).toLowerCase())){
      document.getElementById("email-error").innerHTML = "Please enter valid email address";
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-form-title" style={{backgroundImage: `url(${Background})`}}>
                <span className="login100-form-title-1">
                
                  Sign Up
                </span>
              </div>

              <form className="login100-form validate-form" method="POST" onSubmit={this.handleFormSubmit}>
                <div className="wrap-input100 validate-input m-b-26 form-div">
                  <span className="label-input100">Name</span>
                  <input className="input100" type="text" name="name" placeholder="Enter name"  value={ this.state.name } 
                  onChange={ this.handleNameChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "name-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-26 div-space form-div" data-validate="Email is required">
                  <span className="label-input100">Email</span>
                  <input className="input100" type="text" name="email" placeholder="Enter email" value={ this.state.email } 
                  onChange={ this.handleEmailChange } />
                  <span className="focus-input100"></span>
                </div>
                <div id = "email-error" class= "error"></div>

                <div className="wrap-input100 validate-input m-b-18 div-space form-div" data-validate = "Password is required">
                  <span className="label-input100">Password</span>
                  <input className="input100" type="password" name="pass" placeholder="Enter password" value={ this.state.password } 
                  onChange={ this.handlePasswordChange }/>
                  <span className="focus-input100"></span>
                </div>
                <div id = "password-error" class= "error"></div>

                <div className="container-login100-form-btn btn-space">
                  <button className="login100-form-btn">
                    Register
                  </button>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    user: state.userLoggedIn
  }
}

function mapDispatchToProps(dispatch){
  return{
    registerUser: (details) => {
      debugger
      axios.post('http://localhost:3001/signup', details, { withCredentials: true })
      .then((response) => {
        window.location.href = "http://localhost:3000/projects";
        dispatch({type: 'LoggedIn', payload: response.data.rows});
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("user_id", response.data.rows.id)
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)