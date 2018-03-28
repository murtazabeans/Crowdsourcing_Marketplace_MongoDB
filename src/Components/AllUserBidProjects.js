import React, { Component } from 'react';
import UserBidProject from './UserBidProject';
import axios from 'axios';

class AllUserBidProjects extends Component {

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
    axios.get("http://localhost:3001/get_all_user_bid_projects?u_id=" + user_id)
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
          <UserBidProject key = {project.id} employer_id = {project.id}  project_name = {project.title} employer_name={project.name} avg_bid={project.avgDays}
          user_bid={project.number_of_days} project_id = {project.project_id} assigned_to = {project.assigned_to}    />
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
              <th scope="col">Your Bid(in days)</th>
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
export default AllUserBidProjects;