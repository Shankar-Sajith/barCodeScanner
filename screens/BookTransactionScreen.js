import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import *as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'
export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
    }
  }
  GetCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === 'granted',
      buttonState: "clicked",
    })
  }
  handelBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scanned: true,
      scannedData: data,
      buttonState: normal
    })
  }
  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState
    if (buttonState === "clicked" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handelBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )
    }
    else if (buttonState === "normal") {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.displayText}>
            {hasCameraPermissions===true?this.state.scannedData:"request camera permissions"}
        </Text>
          <TouchableOpacity style={styles.scanButton} onPress={this.GetCameraPermission}>
            <Text style={styles.buttonText}>scan QR code</Text>
          </TouchableOpacity>
        </View>

      )
    }
  }
}
const styles = StyleSheet.create({
  displayText: {
    fontSize: 15,
    textDecorationLine: "underLine",
  },
  scanButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
  }

})