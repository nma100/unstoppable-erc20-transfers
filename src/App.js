import React from 'react';
import * as Covalent from './Covalent.js';
import 'bootstrap-icons/font/bootstrap-icons.scss';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: null, transactions: [] };
  }

  async componentDidMount() {
    console.log("did mount !");
    let theUser = 'demo.eth';
    this.setState({user: theUser });
    Covalent.getTransactions(1, theUser).then(tx => {
      console.log('tx', tx);
      this.setState({transactions: tx.data.items });
    });
  }

  render() {
    return (
      <div className="container py-5">
          <h1 className='pb-3'>Unstoppable transactions</h1>
          <p>Transactions for {this.state.user}</p>
          { this.state.transactions &&
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
                    <td><a href={ 'https://etherscan.io/tx/' + tx.tx_hash }>{tx.tx_hash}</a></td>
                    <td>{ tx.from_address_label} { tx.from_address }</td>
                    <td>{ tx.to_address_label}  { tx.to_address }</td>
                    <td>{ tx.fees_paid }</td>
                  </tr>
                ) }
              </tbody>
            </table>
          </div>
          }
      </div>
    );
  }
}

export default App;
