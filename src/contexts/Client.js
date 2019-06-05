import React from "react";
import { Alert } from "react-native";
import io from "socket.io-client";

const socket = io("ws://localhost:2424");

const ClientContext = React.createContext();

class Provider extends React.Component {
  constructor(props) {
    super(props);

    socket.on("lets-go", response => {
      const params = JSON.parse(response);

      Alert.alert("Bora", "Seu parceiro é: " + params.opponent.name);

      this.setState({
        opponent: params.opponent,
        playing: true
      });
    });

    socket.on("join", response => {
      const { gamer } = JSON.parse(response);

      this.setState({ gamer, waiting: true });
    });

    socket.on("abort-game", response => {
      const { gamer } = JSON.parse(response);

      Alert.alert("Poxa", "Seu parceiro arregou");

      this.setState({
        gamer: {},
        opponent: {},
        playing: false,
        waiting: false
      });
    });
  }

  state = {
    playing: false,
    waiting: false,
    gamer: null,
    opponent: null
  };

  join = async ({ name }) => {
    socket.emit("join", JSON.stringify({ name }));
  };

  left = () => {
    socket.emit("left", JSON.stringify(params));
  };

  render() {
    const { children } = this.props;

    const value = {
      store: this.state,
      join: this.join,
      left: this.left
    };

    return (
      <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
    );
  }
}

export const Client = {
  Context: ClientContext,
  ...ClientContext,
  Provider
};
