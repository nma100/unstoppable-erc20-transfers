import React from 'react';
import UAuth from '@uauth/js';
import { ethers } from 'ethers';
import * as Covalent from './Covalent.js';
import 'bootstrap-icons/font/bootstrap-icons.scss';

/*
TODO
  Ajouter clientid : https://dashboard.auth.unstoppabledomains.com/connect?redirectTo=%2Fclients
  format fees
*/

const CHAIN_ID = 1;
const SCAN_URL = 'https://etherscan.io/tx/';

const CLIENT_ID = 'c04b6d41-2e8d-4509-9196-52e31473b81e';
const URI  = window.location.origin

const uauth = new UAuth({
  clientID: CLIENT_ID,
  redirectUri: URI
})

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: null, mode: 0, transactions: [] };
  }
  
  componentDidMount() {
    console.log("did mount !");
  }

  async login() {
    await uauth.loginWithPopup()

    uauth.user()
      .then(user => {
        console.log("Connected user :", user)
        this.setState({user: user });
        Covalent.getTransactions(CHAIN_ID, user).then(tx => {
          console.log('tx', tx);
          this.setState({transactions: tx.data.items, mode: 1 });
        });
      }).catch (error => {
        console.error(error)
      });
  }

  render() {
    return (
      <div className="container py-5">
          <h1 className='pb-3'>Unstoppable transactions</h1>
          { this.state.mode === 0 &&
          <div className='shadow p-4'>
            <p className='lead mb-4'>Login to see your last transactions </p>
            <div id="btn-login" onClick={this.login} style={{cursor: 'pointer'}}><img src="unstop-button.png" alt="Login button" /></div>
          </div>
          }
          { this.state.mode === 1 &&
          <div>
            <p className='lead'>Last transactions for <span className='text-success'>{this.state.user}</span></p>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">block_signed_at</th>
                    <th scope="col">status</th>
                    <th scope="col">tx_hash</th>
                    <th scope="col">from_address</th>
                    <th scope="col">to_address</th>
                    <th scope="col">fees_paid</th>
                  </tr>
                </thead>
                <tbody>
                { this.state.transactions.map(tx => 
                    <tr key={tx.tx_hash }>
                      <td>{ tx.block_signed_at }</td>
                      <td>{ tx.successful ? 'success' : 'fail' }</td>
                      <td><a href={ SCAN_URL + tx.tx_hash }>{tx.tx_hash}</a></td>
                      <td>{ tx.from_address_label} { tx.from_address }</td>
                      <td>{ tx.to_address_label}  { tx.to_address }</td>
                      <td>{ tx.fees_paid }</td>
                    </tr>
                  ) }
                </tbody>
              </table>
            </div>
          </div>
          }
      </div>
    );
  }
}

export default App;
