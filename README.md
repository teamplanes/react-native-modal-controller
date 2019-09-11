## React Native Modal Controller 🕹

A more ergonomic interface for opening and managing modals in your react native
app.

- 🎣 Uses React hooks
- 🍆 Written in TypeScript
- 💥 Open multiple modals at once (tray and an alert, or whatever)
- 🎩 Fancy animations using `react-native-animatable`

For example, you might want to have a modal and a tray:

<img src="https://i.imgur.com/6JhOGID.gif" width="200" />

## Example Usage:

```tsx
// Your basic popup component
const MyModal = (props: ModalComponentProps<any>) => (
  <View style={{height: 300, width: 300, backgroundColor: 'white'}}>
    {/* Opens another modal from within */}
    <TouchableOpacity onPress={() => props.onShowModal({name: 'myModal'})}>
      <Text>Open another</Text>
    </TouchableOpacity>
  </View>
);

const MyScreen = () => {
  // The Hook!
  const modal = useModalController();
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() =>
          // Show the `myModal` popup declared in the the provider
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

// Your app entry point - define your Modals and pass into the Context Provider
const App = () => {
  return (
    <ModalControllerProvider
      modals={[
        {
          // Your unique name/key for this modal to be opened
          name: 'myModal',
          // Define whether, when opened, this modal should override or exist in parallel
          priority: Priority.Override,
          animation: {
            inDuration: 500,
            outDuration: 500,
            // Using react-native-animatable animations or your own
            in: 'fadeInDown' as Animation,
            out: 'fadeOutUp' as Animation,
          },
          Component: MyModal,
        },
      ]}
      // Customise the backdrop
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