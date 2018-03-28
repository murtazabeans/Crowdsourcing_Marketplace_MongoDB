import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class Header extends Component {
  constructor(){
    super();
    this.state = {sessionPresent: false}
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      debugger
      if(response.data.session.email !=  undefined){
        self.setState({
          sessionPresent: true
        });
      }
    })
  }

  handleSignOut(e){
    localStorage.clear();
    axios.get('http://localhost:3001/destroy_session', { withCredentials: true })
    .then((response) => {
    })
    window.location.href = "http://localhost:3000";
  }

  render(props) {
    let  session_link, post_project, user_profile, projects_page, bid_page, mybidprojects, my_projects, user_name = null;
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if(this.state.sessionPresent) {
      mybidprojects = <a className="link-style nav-link btn-info" href="/my-bid-projects">My Bid Projects</a>
      my_projects = <a className="link-style nav-link btn-info" href="my-projects">My Projects</a>
      projects_page = <a className="link-style nav-link btn-info" href = "/projects"  >All Projects</a>
      post_project = <a className="link-style nav-link btn-info" href="/new-project">Post Project </a>
      user_profile = <a className="link-style nav-link btn-info" href="/edit_profile">Edit Profile </a>
      session_link = <a className="link-style nav-link btn-info" onClick = {this.handleSignOut} href="#">Sign Out</a>
    }
    else{
      session_link = <a className="btn btn-primary" href="/signin">Sign In</a>      
    }
    if(this.props.user.login_data != null){
      user_name = <div id = "name"><i class="fa fa-user" aria-hidden="true"></i>    {this.props.user.login_data.name}  </div>
    }
    return (
      <div id = "header-main-div">
        <nav className="navbar navbar-light bg-light static-top">
          <div className="container">
          <a href="https://www.freelancer.com/" id="freelancer-img" target="_blank" className="navbar-brand web-link" title="Home"><img src= {require('../img/freelancer.svg')} /></a>
          { mybidprojects }
          { my_projects }
          { projects_page }
          { post_project }
          { user_profile }
          { session_link }
          { user_name }
          </div>
        </nav>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    user: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Header)

