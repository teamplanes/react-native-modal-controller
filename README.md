## React Native Modal Controller

Modals can be fiddly in React Native. Lets say for example you have a mostly fullscreen modal with a form init and you want to show an error modal after an incorrect submission - you'd have to close the form modal and once `onDismiss` is called open the error modal.

React Native Modal Controller aims to solve this by providing a control component that manages your one or many modals. It does this by opening a single React Native Modal with a single backdrop.

For example, you might want to have a modal and a tray with a picker in it:

<img src="https://i.imgur.com/6JhOGID.gif" width="200" />

The code for the above looks like:

```js
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import showModal, { PRIORITIES, ModalController } from 'react-native-modal-controller';
import AlertModal from './components/alert';
import TrayModal from './components/tray';

export default class App extends React.Component {
  handleShowtray = () => {
    showModal({
      name: 'TRAY',
      priority: PRIORITIES.OVERRIDE,
      modalProps: {
        message: 'Hey tray.',
        onOpenAlert: () => this.handleOpen(PRIORITIES.STANDARD),
      },
    });
  };
  handleOpen = (priority) => {
    showModal({
      name: 'ALERT',
      priority: priority || PRIORITIES.OVERRIDE,
      modalProps: {
        message: 'Hello, modal.',
        onOpenAnother: this.handleOpen,
        onOpenTray: this.handleShowtray
      },
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Open Modal" onPress={this.handleOpen} />
        <ModalController
          customAnimations={{
            slideTrayUp: {
              from: { bottom: -300 },
              to: { bottom: 0 }
            },
            slideTrayDown: {
              from: { bottom: 0 },
              to: { bottom: -300 }
            }
          }}
          modals={{
            ALERT: { 
              animationIn: 'zoomInDown',
              animationOut: 'lightSpeedOut',
              Component: AlertModal 
            },
            TRAY: {
              animationIn: 'slideTrayUp',
              animationOut: 'slideTrayDown',
              Component: TrayModal,
              absolutePositioning: {
                bottom: 0,
                left: 0,
                right: 0,
              },
            },
          }}
        />
      </View>
    );
  }
}

```

