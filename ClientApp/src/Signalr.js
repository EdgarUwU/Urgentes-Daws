import { createSignalRContext } from "react-signalr";

const SignalRContext = createSignalRContext();
// or createSocketContext for socket.io

const App = () => {
  const { token } = StoreAuthentication.useState();

  return (
    <SignalRContext.Provider
      connectEnabled={!!token}
      accessTokenFactory={() => token}
      dependencies={[token]} //remove previous connection and create a new connection if changed
      url={"https://example/hub"}
    >
      <Routes />
    </SignalRContext.Provider>
  );
};