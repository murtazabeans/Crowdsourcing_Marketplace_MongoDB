import React, { Component } from 'react';
import axios from 'axios';
var config = require('../config');

class ProjectSearchBar extends Component {
  
  loadProjectsFromServer(){
    var self = this;
    axios.get(config.host + ":3001/get_all_projects")
    .then(function (response) {
      if(response.data.rows != null){
        self.setState({
          data: response.data.rows
        })
        return;
      }
      return;
    })
  }

  render() {
    return (
      <div id = "search_bar">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Search project by name and skills" onChange = {this.props.handleSearchBar}/>
        </div>
      </div>
    )
  }
}

export default ProjectSearchBar;
