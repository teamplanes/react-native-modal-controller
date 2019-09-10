## React Native Modal Controller

Modals can be fiddly in React Native. Lets say for example you have a mostly-fullscreen modal with a form in it and you want to show an error modal after an incorrect submission - you'd have to close the form modal and once `onDismiss` is called open the error modal.

React Native Modal Controller aims to solve this by providing a control component that manages your one or many modals. It does this by opening a single React Native Modal with a single backdrop.

For example, you might want to have a modal and a tray with a picker in it:

<img src="https://i.imgur.com/6JhOGID.gif" width="200" />

## Example Usage:

```tsx
const MyModal = (props: ModalComponentProps<any>) => (
  <View style={{height: 300, width: 300, backgroundColor: 'white'}}>
    <TouchableOpacity onPress={() => props.onShowModal({name: 'myModal'})}>
      <Text>Open another</Text>
    </TouchableOpacity>
  </View>
);

const MyScreen = () => {
  const modal = useModalController();
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() =>
          modal.onShowModal({
            name: 'myModal',
            priority: Priority.Override,
          })
        }>
        <Text>Show Modal</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <ModalControllerProvider
      modals={[
        {
          name: 'myModal',
          priority: Priority.Override,
          animation: {
            inDuration: 500,
            outDuration: 500,
            in: 'fadeInDown' as Animation,
            out: 'fadeOutUp' as Animation,
          },
          Component: MyModal,
        },
      ]}
      backdrop={{
        activeOpacity: 0.5,
        transitionInTiming: 500,
        transitionOutTiming: 500,
      }}>
      <MyScreen />
    </ModalControllerProvider>
  );
};

```