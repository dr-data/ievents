import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { getAllCenters } from '../../../actions/centerActions';
import { setCenterToBook } from '../../../actions/eventActions';
import './styles.scss';
import View from './View';

@connect(store => (
  {
    isUserAuthenticaed: store.authReducer.loggingUserResolved,
    fetchingCenterStarted: store.fetchCentersReducer.fetchingCenterStarted,
    centers: store.fetchCentersReducer.centers,
    pagination: store.fetchCentersReducer.pagination,
  }
))
class RegularCenters extends React.Component {
  constructor() {
    super();
    this.state = {
      modalContent: null,
    };
  }
  componentWillMount() {
    this.props.dispatch(getAllCenters({
      limit: this.props.pagination.limit,
      offset: this.props.pagination.offset,
    }));
  }

  /**
   * It updates the store about a center that is to be booked.
   * @param {Number} centerId The ID of the center.
   */
  onBook = (centerId) => {
    this.props.dispatch(setCenterToBook(centerId));
  }

  /**
   * Displays the center modal.
   * It uses the center ID to get the details of the center to show.
   * @param {Event} event The event object.
   */
  showModal = (event) => {
    const state = { ...this.state };
    const centerId = Number(event.target.id);
    state.modalContent = find(this.props.centers, { id: centerId });
    this.setState(state);
  }

  updatePagination = (pageData) => {
    const nextOffset = pageData.selected * this.props.pagination.limit;
    this.props.dispatch(getAllCenters({
      limit: this.props.pagination.limit,
      offset: nextOffset
    }));
  }

  render() {
    if (this.props.isUserAuthenticaed) {
      return <Redirect to="/centers" />;
    }
    return (
      <View
        centers={this.props.centers}
        onBook={this.onBook}
        showModal={this.showModal}
        modalContent={this.state.modalContent}
        fetchingCenterStarted={this.props.fetchingCenterStarted}
        pagination={this.props.pagination}
        updatePagination={this.updatePagination}
      />
    );
  }
}

RegularCenters.defaultProps = {
  isUserAuthenticaed: false,
  fetchingCenterStarted: false,
  centers: [],
  dispatch: () => {},
  pagination: {}
};

/* eslint-disable react/forbid-prop-types */
RegularCenters.propTypes = {
  isUserAuthenticaed: PropTypes.bool,
  fetchingCenterStarted: PropTypes.bool,
  centers: PropTypes.array,
  dispatch: PropTypes.func,
  pagination: PropTypes.object,
};

export default RegularCenters;
