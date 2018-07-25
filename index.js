import React from 'react';
import Contoller, { PRIORITIES } from './src/controller';

/*
 * Not a pretty solution.
 * TODO: Move to event based system, or redux, or both.
 */

// eslint-disable-next-line no-console
let modalRef = { 
  showModal: () => console.warn('showModal called before initialised'),
};

class ModalController extends React.Component {
  render() {
    return <Contoller {...this.props} ref={(ref) => { modalRef = ref; }} />;
  }
}

export { PRIORITIES, ModalController };
export default (...args) => modalRef.showModal(...args);
