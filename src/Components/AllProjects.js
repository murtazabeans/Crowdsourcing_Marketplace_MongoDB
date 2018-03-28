import React, { Component } from 'react';
import axios from 'axios';
import ProjectDetail from './ProjectDetail'

//import './style.css';



class AllProjects extends Component {

  constructor(){
    super();
    this.state = { data: [] };
  }
  
  componentWillMount(){
    var self = this;
    axios.get('http://localhost:3001/check_session', { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = "http://localhost:3000/signin";
      }
    })
  }

  componentDidMount(){
    this.loadProjectsFromServer();
  }

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
    let projectList;
    if(this.state.data != null){
      projectList = this.state.data.map(project => {
        return(
          <ProjectDetail key = {project.id} id = {project.id} number_of_bids = {project.total_bids}  name={project.title} description={project.description} skills_required = {project.skills_required}
          max_budget = {project.max_budget} min_budget = {project.min_budget} employer_id = {project.user_id} employer_name={project.name}   />
        )
      })
    }
    return (
      <div>
        <table class="table details-table">
          <thead class = "table-header">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Skills Required</th>
              <th scope="col">Budget Range($)</th>
              <th scope="col">Employer Name</th>
              <th scope="col">Number of Bids</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            { projectList }
          </tbody>
        </table>
      </div>
    )
  }
}

export default AllProjects;
