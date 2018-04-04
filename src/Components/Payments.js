import React, { Component } from 'react';
import axios from 'axios';
import AddPayment from './AddPayment'
import WithdrawPayment from './WithdrawPayment'

class Payments extends Component {

  constructor(){
    super();
  }

  componentDidMount(){
    document.getElementById("root").style.width = "99%";
    document.getElementById("payment-withdraw").style.display = "none"
  }

  render() {
    return (
      <div class="modal-body row">
        
        <div class="col-md-6">
          <AddPayment />
        </div>
        <div class="col-md-6">
          <WithdrawPayment />
        </div>
      </div>
    )
  }
}

export default Payments;
