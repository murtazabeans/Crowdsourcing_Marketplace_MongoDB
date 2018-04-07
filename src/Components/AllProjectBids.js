import React, { Component } from 'react';
import axios from 'axios';
import ProjectBid from './ProjectBid'

class AllProjectBids extends Component {

  constructor(){
    super();
    this.state = { data: [], sort_state: 1 };
    this.handlePriceSort = this.handlePriceSort.bind(this);
  }

  componentDidMount(){
    this.loadBidsFromServer();
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

  handlePriceSort(e){
    this.loadBidsFromServer();
  }

  loadBidsFromServer(){
    var self = this;
    var new_state = this.state.sort_state == 1 ? -1 : 1;
    let project_id = localStorage.getItem("project_id")
    axios.get("http://localhost:3001/get_project_bids?pid=" + project_id + "&s=" + this.state.sort_state)
    .then(function (response) {
      if(response.data.rows != null){
        let user_detail = response.data.rows;
        console.log(user_detail);
        self.setState({
          sort_state: new_state,
          data: response.data.rows
        })
        return;
      }
      return;
    })
  }

  render() {
    let bidList;
    if(this.state.data != null){
      bidList = this.state.data.map(bid => {
        let current_user_id = localStorage.user_id;
        let isProjectOwner = current_user_id == bid.project.user_id ? true : false;
        let profile_image_name = bid.user[0].profile_image_name == undefined ? "default.png" : bid.user[0].profile_image_name
        let project_assigned_to = bid.project.assigned_to == undefined ? "" : bid.project.assigned_to;
        return(
          <ProjectBid key = {bid.id} id = {bid.id} image_name = {profile_image_name}  
          freelancer_name={bid.user[0].name} free_lancer_id = {bid.user[0].id} price={bid.price} days = {bid.number_of_days} 
          isProjectOwner = {isProjectOwner} assigned_to={project_assigned_to}  />
        )
      })
    }
    return (
      <div>
        <table className="table details-table table-striped table-bordered">
          <thead className = "table-header">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">FreeLancer Name</th>
              <th scope="col">Bid Price($)
                <a href="#" onClick = {this.handlePriceSort} >
                  <b></b> <i className="fa fa-fw fa-sort"></i>
                </a>
              </th>

              
              <th scope="col">Period in Days</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            { bidList }
          </tbody>
        </table>
      </div>
    )
  }
}

export default AllProjectBids;
