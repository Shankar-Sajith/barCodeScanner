import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image} from 'react-native';
import *as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'
export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookID:'',
      scannedStudentID:'',
      buttonState: 'normal',
    }
  }
  GetCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === 'granted',
      buttonState: id,
      scanned:false,
    })
  }
  handelBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scanned: true,
      scannedData: data,
      buttonState: normal,
    })
  }
  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState
    if (buttonState !== "normal" && hasCameraPermissions) {
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
          <View>
            <Image source={require("../assets/assets/booklogo.jpg")} style={{width:200,height:200}}/>
            <Text style={{textAlign:'center',fontSize:30}}>WI-LY</Text>
          </View>
          <View style ={styles.inputView}>
            <TextInput style={styles.inputBox} placeholder="BookID" value={this.state.scannedBookID}/>
            <TouchableOpacity style={styles.scanButton} onPress={()=>{
              this.GetCameraPermission("BookID")
            }}>
              <Text style = {styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style ={styles.inputView}>
            <TextInput style={styles.inputBox} placeholder="StudentID" value={this.state.scannedStudentID}/>
            <TouchableOpacity style={styles.scanButton} onPress={()=>{
              this.GetCameraPermission("StudentID")
            }}>
              <Text style = {styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#66bb6a",
    width:50,
    borderWidth:1.56,
    borderLeftWidth:0
  },
  buttonText: {
    fontSize: 20,
    textAlign:'center',
    marginTop:10,
  },
  inputView:{
    flexDirection:'row',
    margine:20,
  },
  inputBox:{
    width:200,
    height:40,
    borderWidth:1.5,
    borderRightWidth:0,
    fontSize:20,
  },
})