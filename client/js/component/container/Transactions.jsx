import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  getAllTransactions,
  allowTransaction,
  cancelTransaction,
  deleteTransaction,
  clearTransactionStatus
} from '../../actions/transactionActions';

import UserSideNav from '../common/SideNavigation.jsx';
import Header from '../common/Header.jsx';
import TransactionCards from '../common/TransactionCards.jsx';
import { UserTopNav } from '../common/TopNavigation.jsx';
import { WarningAlert } from '../common/Alert';

@connect((store) => {
  return {
    user: store.user.user,
    authenticated: store.user.status.fetched,
    transactions: store.transactions,
  }
})

export default class Transactions extends React.Component {
  componentWillMount() {
    this.props.dispatch(getAllTransactions(this.props.user.token));
  }

  refresh = () => {
    this.props.dispatch(clearTransactionStatus());
    this.props.dispatch(getAllTransactions(this.props.user.token));
  }

  componentDidUpdate() {
    if (this.props.transactions.status.allowed ||
      this.props.transactions.status.canceled ||
      this.props.transactions.status.deleted) {
      this.refresh();
    }
  }

  cancelTransaction = (e) => {
    this.props.dispatch(cancelTransaction(this.props.user.token, e.target.dataset.transactionId));
  }

  allowTransaction = (e) => {
    this.props.dispatch(allowTransaction(this.props.user.token, e.target.dataset.transactionId));
  }

  deleteTransaction = (e) => {
    this.props.dispatch(deleteTransaction(this.props.user.token, e.target.dataset.transactionId));
  }

  render() {
    if (!this.props.authenticated) {
      return (<Redirect to="/users/login" />)
    } else {
      return (
        <div id="transactions-container">
          {/* Top navigation on small screen */}
          <UserTopNav name={this.props.user.name} title='Transactions' />

          <div class="container-fluid">
            <div class="row">

              {/*  Side navigation on large screen */}
              <UserSideNav userName={this.props.user.name} />

              {/* Main content */}
              <div class="col-lg-10 offset-md-2" id="add-event-section">

                {/* Content Header(navigation) on large screen */}
                <Header text='Transactions' />

                <div id="transactions" class="mt-lg-0">
                  <div id="accordion" role="tablist">

                    <TransactionCards
                      centers={this.props.transactions.centers}
                      onCancel={this.cancelTransaction}
                      onAllow={this.allowTransaction}
                      onDelete={this.deleteTransaction} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}