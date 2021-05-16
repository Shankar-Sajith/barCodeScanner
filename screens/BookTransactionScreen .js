import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, KeyboardAvoidingView, Alert, ToastAndroid } from 'react-native';
import *as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'
import *as firebase from 'firebase';
import db from '../config.js'
export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookID: '',
      scannedStudentID: '',
      buttonState: 'normal',
      transactionMessage: "",
    }
  }
  GetCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === 'granted',
      buttonState: id,
      scanned: false,
    })
  }
  handelBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scanned: true,
      scannedData: data,
      buttonState: normal,
    })
  }
  initiateBookIssue = async () => {
    db.collection("Transaction").add({
      'studentID': this.state.scannedStudentID,
      'bookID': this.state.scannedBookID,
      'data': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Issue"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability':false
    })
    db.collection("Students").doc(this.state.scannedStudentID).update({
      'NoOfBooksIssued': firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Issued")
    this.setState({
      scannedStudentID: '',
      scannedBookID: '',
    })
  }
  initiateBookReturn = async () => {
    db.collection("Transaction").add({
      'studentID': this.state.scannedStudentID,
      'bookID': this.state.scannedBookID,
      'data': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Return"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability': true
    })
    db.collection("Students").doc(this.state.scannedStudentID).update({
      'NoOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scannedStudentID: '',
      scannedBookID: '',
    })
  }
  checkBookEligibility = async () => {
    const BookRef = await db
      .collection("Books").where("bookID", "==", this.state.scannedBookID).get()
    var transactionType = ""
    if (BookRef.docs.length == 0) {
      transactionType = false
    } else {
      BookRef.docs.map(doc => {
        var book = doc.data()
        if (book.bookAvailability) {
          transactionType = "Issue"
        } else {
          transactionType = "Return"
        }
      })
    }
    return transactionType
  }
  checkStudentEligibilityForBookIssue = async () => {
    const StudentRef = await db
      .collection("Books").where("bookID", "==", this.state.scannedStudentID).get()
    var isStudentEligible = ""
    if (StudentRef.docs.length == 0) {
      this.setState({
        scannedStudentID: "",
        scannedBookID: ""
      })
      isStudentEligible = false
      Alert.alert("the Student ID does not Exist in the data bse")
    } else {
      StudentRef.docs.map(doc => {
        var student = doc.data()
        if (student.NoOfBooksIssued < 2) {
          isStudentEligible = true

        } else {
          isStudentEligible = false
          Alert.alert("the Student has Already issed 2 books ")
          this.setState({
            scannedStudentID: "",
            scannedBookID: ""
          })
        }
      })
    }
    return isStudentEligible
  }
  checkStudentEligibilityForBookReturn = async () => {
    const transactionRef = await db
      .collection("Transaction").where("bookID", "==", this.state.scannedBookID).limit(1).get()
    var isStudentEligible = ""


    transactionRef.docs.map(doc => {
      var lastBokTransaction = doc.data()
      if (lastBokTransaction.studentID===this.state.scannedStudentID) {
        isStudentEligible = true

      } else {
        isStudentEligible = false
        Alert.alert("the book was not issued by this student ")
        this.setState({
          scannedStudentID: "",
          scannedBookID: ""
        })
      }
    })
  
    return isStudentEligible
  }
handleTransaction = async () => {
  //verify if the student is eligible for book issue or return or none
  //student id exists in the database
  //issue : number of book issued < 2
  //issue: verify book availability
  //return: last transaction -> book issued by the student id
  var transactionType = await this.checkBookEligibility()
  if (!transactionType) {
    Alert.alert("the book does not exist in the data base")
    this.setState({
      scannedStudentID: "",
      scannedBookID: ""
    })
  }
  else if (transactionType === "Issue") {
    var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
    if (isStudentEligible) {
      this.initiateBookIssue()
      Alert.alert("Book Issued To The Student")
    }

  } else {
    var isStudentEligible = await this.checkStudentEligibilityForBookReturn()
    if (isStudentEligible) {
      this.initiateBookReturn()
      Alert.alert("Book Returned By The Student")
    }
  }
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
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: "center", alignItems: "center" }} behavior='padding'>
        <View>
          <Image source={require("../assets/assets/booklogo.jpg")} style={{ width: 200, height: 200 }} />
          <Text style={{ textAlign: 'center', fontSize: 30 }}>WI-LY</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputBox} placeholder="BookID" value={this.state.scannedBookID}
            onChangeText={text => this.setState({
              scannedBookID: text
            })} />
          <TouchableOpacity style={styles.scanButton} onPress={() => {
            this.GetCameraPermission("BookID")
          }}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputBox} placeholder="StudentID" value={this.state.scannedStudentID}
            onChangeText={text => this.setState({
              scannedStudentID: text
            })} />
          <TouchableOpacity style={styles.scanButton} onPress={() => {
            this.GetCameraPermission("StudentID")
          }}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={async () => {
          var transactionMessage = this.handleTransaction()
          this.setState({
            scannedBookID: '',
            scannedStudentID: ''
          })
        }}>
          <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

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
    width: 50,
    borderWidth: 1.56,
    borderLeftWidth: 0
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  inputView: {
    flexDirection: 'row',
    margine: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: "#fbc02d",
    width: 100,
    height: 50,
  },
  submitBtnText: {
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
})