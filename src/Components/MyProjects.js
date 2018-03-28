import React, { Component } from 'react';
import MyProject from './MyProject';
import axios from 'axios';

class MyProjects extends Component {

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
    var user_id = localStorage.user_id;
    this.loadProjectsFromServer(user_id);
  }

  loadProjectsFromServer(user_id){
    var self = this;
    axios.get("http://localhost:3001/get_all_user_published_projects?u_id=" + user_id)
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
          <MyProject key = {project.id} freelancer_id= {project.freelancer_id} employer_id = {project.id}  project_name = {project.title} employer_name={project.owner} avg_bid={project.avgDays}
          project_id = {project.id} employer_id = {project.employer_id} assigned_to = {project.freelancer_name} completion_date={project.date_of_completion}   />
        )
      })
    }
    return (
      <div>
        <table class="table details-table">
          <thead class = "table-header">
            <tr>
              <th scope="col">Project Name</th>
              <th scope="col">Employer</th>
              <th scope="col">Average Bid(in days)</th>
              <th scope="col">FreeLancer Name</th>
              <th scope="col">Estimate Project Completion Date</th>
              <th scope="col">Status</th>
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
export default MyProjects;