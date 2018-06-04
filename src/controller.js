import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { initializeRegistryWithDefinitions } from 'react-native-animatable';
import ModalAnimator from './modal-animator';

export const PRIORITIES = {
  STANDARD: 'STANDARD',
  OVERRIDE: 'OVERRIDE',
};

class Controller extends React.Component {
  static propTypes = {
    activeBackdropOpacity: PropTypes.number,
    backdropTransitionInTiming: PropTypes.number,
    backdropTransitionOutTiming: PropTypes.number,
    customAnimations: PropTypes.objectOf(PropTypes.shape({
      from: PropTypes.object,
      to: PropTypes.object,
    })),
    modals: PropTypes.objectOf(PropTypes.shape({
      Component: PropTypes.func.isRequired,
      animationIn: PropTypes.string,
      animationOut: PropTypes.string,
      animationInDuration: PropTypes.number,
      animationOutDuration: PropTypes.number,
    })).isRequired,
  };

  static defaultProps = {
    activeBackdropOpacity: 0.5,
    backdropTransitionInTiming: 500,
    backdropTransitionOutTiming: 500,
    customAnimations: null,
  };

  state = { modals: [] };

  componentDidMount() {
    if (this.props.customAnimations) {
      initializeRegistryWithDefinitions(this.props.customAnimations);
    }
  }

  showModal({
    name,
    modalProps,
    priority = PRIORITIES.STANDARD,
    ...config
  }) {
    const otherModals =
      priority === PRIORITIES.STANDARD
        // Keep all all other modal open in parallel
        ? [...this.state.modals]
        // Hide all others - at the moment we only have
        // OVERRIDE - in the future ENQUEUE could be cool!
        : this.state.modals.map(modal => ({ ...modal, isVisible: false }));
    const newModals = [
      ...otherModals,
      {
        name,
        isVisible: true,
        id: `${Math.random()}`,
        // Props passed through to modal Component
        modalProps,
        // Modal base configs
        ...this.props.modals[name],
        // Modal override configs
        ...config,
        Component: this.props.modals[name].Component,
      },
    ];

    this.setState(
      {
        modals: newModals,
      },
      () => {
        Animated.timing(this.backdropOpacity, {
          toValue: this.props.activeBackdropOpacity,
          duration: this.props.backdropTransitionInTiming,
        }).start();
      },
    );
  }

  handleCloseTop = () => {
    const modals = [...this.state.modals];
    modals[modals.length - 1] = {
      ...modals[modals.length - 1],
      isVisible: false,
    };
    this.setState({ modals }, () => {
      const visibleModals = modals.filter(({ isVisible }) => isVisible);
      if (!visibleModals.length) {
        Animated.timing(this.backdropOpacity, {
          toValue: 0,
          duration: this.props.backdropTransitionOutTiming,
        }).start();
      }
    });
  };

  handleAnimationOutDidEnd = id => () => {
    this.setState({
      modals: this.state.modals.filter(modal => modal.id !== id),
    });
  };

  backdropOpacity = new Animated.Value(0);

  render() {
    return (
      <Modal
        transparent
        animationType="none"
        visible={this.state.modals.length > 0}
      >
        <TouchableWithoutFeedback onPress={() => this.handleCloseTop()}>
          <Animated.View
            style={[styles.backdrop, { opacity: this.backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        {this.state.modals.map(({
            Component,
            modalProps,
            animationIn,
            animationOut,
            animationInDuration,
            animationOutDuration,
            absolutePositioning,
            isVisible,
            id,
          }) => (
            <ModalAnimator
              key={id}
              isVisible={isVisible}
              absolutePositioning={absolutePositioning}
              animationIn={animationIn}
              animationOut={animationOut}
              animationInDuration={animationInDuration}
              animationOutDuration={animationOutDuration}
              onAnimationOutDidEnd={this.handleAnimationOutDidEnd(id)}
            >
              <Component {...modalProps || {}} />
            </ModalAnimator>
          ))}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});

export default Controller;
