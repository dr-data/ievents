/* global shallow */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import AddEvent from '../../container/AddEvent.jsx';

const props = {
  user: { name: 'test-user' },
  centers: [
    { id: 1, name: 'test-center1' },
    { id: 2, name: 'test-center2' },
  ],
  defaultCenter: null,
  authenticated: true,
  isAdmin: true,
  isSuperAdmin: false,
  status: {
    adding: false,
    success: false,
    error: false,
  },
  dispatch: () => { },
};

const alterProps = newProps => ({
  user: props.user,
  centers: props.centers,
  defaultCenter: newProps.defaultCenter || null,
  authenticated: newProps.authenticated === undefined ? true : newProps.authenticated,
  isAdmin: newProps.isAdmin === undefined ? true : newProps.isAdmin,
  isSuperAdmin: newProps.isSuperAdmin || false,
  status: {
    adding: newProps.adding || false,
    success: newProps.success || false,
    error: newProps.error || false,
  },
  dispatch: () => { },
});

describe('<AddEvent />', () => {
  describe('Rendering:', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<AddEvent {...props} />);
    })
    it('should redirect to login page if user is not authenticated', () => {
      wrapper.setProps(alterProps({ authenticated: false }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should redirect to events page if event is successfully added', () => {
      wrapper.setProps(alterProps({ success: true }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly on page load', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when adding', () => {
      wrapper.setProps(alterProps({ adding: true }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when there is an error', () => {
      wrapper.setProps(alterProps({ error: 'there was an error' }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly if there is a default center', () => {
      wrapper.setProps({ defaultCenter: props.centers[0].id });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Behaviour:', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<AddEvent {...props} />)
    })
    it('should update the state when the user keys in the event title', () => {
      const title = 'test-title';
      wrapper
        .find('#title')
        .simulate('change', { target: { name: 'title', value: title } });
      expect(wrapper.state('title')).toEqual(title);
    });
    it('should update the state when user keys in the event description', () => {
      const description = 'test-description';
      wrapper
        .find('#description')
        .simulate('change', { target: { name: 'description', value: description } });
      expect(wrapper.state('description')).toEqual(description);
    });
    it('should update the state when user keys in the event date', () => {
      const date = '12-02-2019';
      wrapper
        .find('#date')
        .simulate('change', { target: { name: 'date', value: date } });
      expect(wrapper.state('date')).toEqual(date);
    });
    it('should update the state when user chooses a center', () => {
      const centerId = 1; // The center is represented with its ID.
      wrapper
        .find('#centers')
        .simulate('change', { target: { name: 'centerId', value: centerId } });
      expect(wrapper.state('centerId')).toEqual(centerId);
    });
  });
});
