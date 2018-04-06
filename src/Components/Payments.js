import React, { Component } from 'react';
import axios from 'axios';
import AddPayment from './AddPayment'
import WithdrawPayment from './WithdrawPayment'
import PieChart from 'react-simple-pie-chart';


class Payments extends Component {

  constructor(){
    super();
    this.state = {data: [], values_present: false}
  }

  componentDidMount(){
    document.getElementById("root").style.width = "99%";
    document.getElementById("payment-withdraw").style.display = "none"
    this.getPaymentForUser();
  }

  getPaymentForUser(){
    var user_id = localStorage.user_id;
    var self = this;
    axios.get('http://localhost:3001/past_payments?u_id=' + user_id, { withCredentials: true })
    .then((response) => {
      debugger
      var a = ""
      if(response.data.data_present){
        self.setState({data: response.data.rows, values_present: true})
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
      <div class="modal-body row">
        
        <div class="col-md-6">
          <AddPayment />
        </div>
        <div class="col-md-6">
          <WithdrawPayment />
        </div>
        <br/>
        {pie_chart}
      </div>
    )
  }
}

export default Payments;
