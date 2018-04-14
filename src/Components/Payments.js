import React, { Component } from 'react';
import axios from 'axios';
import AddPayment from './AddPayment'
import WithdrawPayment from './WithdrawPayment'
import PieChart from 'react-simple-pie-chart';
var config = require('../config');


class Payments extends Component {

  constructor(){
    super();
    this.state = {data: [], values_present: false, userBalance: 0}
  }

  componentDidMount(){
    document.getElementById("root").style.width = "99%";
    document.getElementById("payment-withdraw").style.display = "none"
    var self = this;
    axios.get(config.host + ":3001/check_session", { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = config.host + ":3000/signin";
        return;
      }
    })
    this.handleBalanceUpdate();
    this.getPaymentForUser();
  }

  getPaymentForUser(){
    var user_id = localStorage.user_id;
    var self = this;
    axios.get(config.host + ":3001/past_payments?u_id=" + user_id, { withCredentials: true })
    .then((response) => {
      if(response.data.data_present){
        self.setState({data: response.data.rows, values_present: true})
      }
    })
  }
  
  handleBalanceUpdate(){
    const user_id = localStorage.getItem("user_id");
    var self = this;
    axios.get(config.host + ":3001/get_user?id=" + user_id, { withCredentials: true })
    .then((response) => {
      if(response.data.correctCredentials){
        var user_balance = response.data.rows.balance == undefined ? 0 : response.data.rows.balance
        self.setState({userBalance: user_balance})
      }
    })
  }

  render() {
    let pie_chart = null;
    if(this.state.values_present){
      var amount_debited = 0;
      var amount_credited = 0
      var data = this.state.data;
      for(let i = 0; i < this.state.data.length; i++){
        data[i].transaction_type == "Credit" ? amount_credited+= parseFloat(data[i].amount) : amount_debited+= parseFloat(data[i].amount)
      }
      pie_chart = <div id="graph_div"><h1 id = "graph_header">Payments</h1><PieChart slices={[ {  color: '#f00', value: amount_debited,  },  { color: '#0f0', value: amount_credited, }, ]}/></div>
    }
    return (
      <div>
        <h2 id = "table_header" class="display-4">Balance: ${this.state.userBalance}</h2>
        <div class="modal-body row">
          <div class="col-md-6">
            <AddPayment handleBalanceUpdate={this.handleBalanceUpdate.bind(this)} />
          </div>
          <div class="col-md-6">
            <WithdrawPayment handleBalanceUpdate={this.handleBalanceUpdate.bind(this)}/>
          </div>
          <br/>
          {pie_chart}
        </div>
      </div>
      
    )
  }
}

export default Payments;
