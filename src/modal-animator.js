import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';

class ModalAnimator extends React.Component {
  static propTypes = {
    animationIn: PropTypes.string,
    animationOut: PropTypes.string,
    animationInDuration: PropTypes.number,
    animationOutDuration: PropTypes.number,
    isVisible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onAnimationOutDidEnd: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    absolutePositioning: PropTypes.object,
  };

  static defaultProps = {
    animationIn: 'fadeIn',
    animationOut: 'fadeOut',
    animationInDuration: 500,
    animationOutDuration: 500,
    absolutePositioning: null,
  };

  state = {
    isVisible: this.props.isVisible,
  };

  async componentWillReceiveProps(nextProps) {
    if (
      this.state.isVisible &&
      !nextProps.isVisible &&
      !this.isAnimatingOut &&
      this.view
    ) {
      this.isAnimatingOut = true;
      await this.view[this.props.animationOut](this.props.animationOutDuration);
      this.setState({ isVisible: false }, () => {
        this.isAnimatingOut = false;
        this.props.onAnimationOutDidEnd();
      });
    }
  }

  isAnimatingOut = false;
  view = null;

  render() {
    if (!this.state.isVisible) return null;
    return (
      <View
        pointerEvents="box-none"
        style={
          this.props.absolutePositioning
            ? [styles.absoluteWrapper, this.props.absolutePositioning]
            : styles.wrapper
        }
        duration={this.props.animationInDuration}
        animation={this.props.animationIn}
        ref={ref => {
          this.view = ref;
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteWrapper: {
    position: 'absolute',
  },
});

export default ModalAnimator;
