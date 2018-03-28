import ReactDOM from 'react-dom';
import Layout from './Components/Layout'
import App from './Components/App';
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allreducers from './reducers'
import axios from 'axios';
import Home from './Components/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import UserProfile from './Components/UserProfile';
import CreateProject from './Components/CreateProject';
import AllProjects from './Components/AllProjects';
import ProjectView from './Components/ProjectView';
import AllProjectBids from './Components/AllProjectBids';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AllUserBidProjects from './Components/AllUserBidProjects';
import MyProjects from './Components/MyProjects';
import UserProfileView from './Components/UserProfileView';

function loadState() {
  try {
      let current_state = localStorage.getItem("isLoggedIn");
      if (current_state === null) { return this.initializeState();}
      return;
  }
  catch (err) {
      return initializeState();
  }
}

function initializeState(){
  let initial_state = false;
  localStorage.setItem("isLoggedIn", initial_state);
}

const store = createStore(allreducers, loadState());

ReactDOM.render(
  <Provider store = {store}>
    <Layout>
      <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/edit_profile" component={UserProfile} />
            <Route path="/new-project" component={CreateProject} />
            <Route path="/projects" component={AllProjects} />
            <Route path="/project-detail" component={ProjectView}/>
            <Route path="/project-bids" component={AllProjectBids}/>
            <Route path = "/my-bid-projects" component = {AllUserBidProjects} />
            <Route path = "/my-projects" component = {MyProjects} />
            <Route path = "/profile" component = {UserProfileView} />
          </div>
        </Router>
    </Layout>
  </Provider>,
 document.getElementById('root')
);
