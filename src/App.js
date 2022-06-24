import React from 'react';
import UAuth from '@uauth/js';
import { ethers } from 'ethers';
import * as Covalent from './Covalent.js';
import 'bootstrap-icons/font/bootstrap-icons.scss';

const CHAIN_ID = 1;
const SCAN_URL = 'https://etherscan.io/tx/';

// redirectUri : 127.0.0.1
//const CLIENT_ID = '96719a7e-8a22-4f4d-b050-2f604c418b65';

// redirectUri : https://unstoppable-transactions.vercel.app/
const CLIENT_ID = '7ebac5a8-65a0-40ef-a67a-391b38965ec3';

const uauth = new UAuth({
  clientID: CLIENT_ID,
  redirectUri: window.location.origin
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = { user: null, mode: 0, transactions: [] };
  }

  async login() {
    await uauth.loginWithPopup()

    uauth.user()
      .then(userInfo => {
        console.log("Connected user :", userInfo)
        this.setState({user: userInfo.sub });
        Covalent.getTransactions(CHAIN_ID, userInfo.wallet_address).then(tx => {
          console.log('tx', tx);
          this.setState({transactions: tx.data.items, mode: 1 });
        });
      }).catch (error => {
        console.error(error)
      });
  }

  fees(value) {
    let bigNumberValue = ethers.utils.parseUnits(value, 0);
    return ethers.utils.formatUnits(bigNumberValue);
  }

  render() {
    return (
      <div className="container py-5">
          <h1 className='pb-3'>Unstoppable transactions</h1>
          { this.state.mode === 0 &&
          <div className='shadow p-4'>
            <p className='lead mb-4'>Login to see your transactions </p>
            <div id="btn-login" onClick={this.login} style={{cursor: 'pointer'}}><img src="unstop-button.png" alt="Login button" /></div>
          </div>
          }
          { this.state.mode === 1 &&
          <div>
            <p className='lead'>Last transactions for <span className='fw-bold text-success'>{this.state.user}</span></p>
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
                      <td>{ this.fees(tx.fees_paid) }</td>
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
