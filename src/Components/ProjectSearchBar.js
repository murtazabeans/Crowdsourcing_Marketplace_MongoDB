import React, { Component } from 'react';
import axios from 'axios';

class ProjectSearchBar extends Component {
  
  loadProjectsFromServer(){
    var self = this;
    axios.get("http://localhost:3001/get_all_projects")
    .then(function (response) {
      if(response.data.rows != null){
        let user_detail = response.data.rows;
        console.log(response);
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
      <div class= "container" id = "search_bar">
        <div class="row">
          <div class="col-lg-12">
            <div class="input-group">

              <input type="text" class="form-control" placeholder="Search project by name and skills" onChange = {this.props.handleSearchBar}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectSearchBar;
