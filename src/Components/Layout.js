import React, { Component } from 'react';
import axios from 'axios';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import allreducers from '../reducers'
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/simple-line-icons.css';
import '../css/landing-page.min.css';
var config = require('../config');


class Layout extends Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount(){
    var self = this;
    axios.get(config.host + ":3001/check_session", { withCredentials: true })
    .then((response) => {
      if(response.data.session.email !=  undefined){
        this.props.getUserName(localStorage.user_id)
      }
    })
  }

  render() {
    return (
    <div>
      <Header/>
        <div className= "table-header-div">
          {this.props.children}
        </div>
      <Footer/>
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
    getUserName: (user_id) => {
      axios.get(config.host + ":3001/get-user-name?id=" + user_id)
      .then(response => {
        console.log(response.data);
        if(response.data.data_present){
          dispatch({type: 'LoggedIn', payload: response.data.rows});
        }
     }) 
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)

