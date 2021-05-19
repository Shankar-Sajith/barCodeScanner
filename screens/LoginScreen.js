import React, { Component } from 'react';
import *as firebase from 'firebase';
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Image, Alert, } from 'react-native';

export default class LoginScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailID: "",
            password: ''
        }
    }
    login = async (email, password) => {
        if (email && password) {
            try {
                const response = await firebase.auth().signInWithEmailAndPassword(email, password)
                if (response) {
                    this.props.navigation.navigate('TransactionScreen')
                }
            }
            catch (error) {
                switch (error.code) {
                    case 'auth/user-not-found': Alert.alert("user dose not exist")
                        break
                    case 'auth/invali-email': Alert.alert("incorrect email/password")
                        break
                }
            }
        }else{
            Alert.alert('enter Email and password ')
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={{ alignItems: 'center', marginTop: 20 }}>
                <View>
                    <Image source={require("../assets/assets/booklogo.jpg")} style={{ width: 200, height: 200 }} />
                    <Text style={{ textAlign: 'center', fontSize: 30 }}>WI-LY</Text>
                </View>
                <View>
                    <TextInput style={styles.loginBox} placeholder="abc@example.com" keyboardType='emailAdress' onChangeText={(text) => { this.setState({ emailID: text }) }} />
                    <TextInput style={styles.loginBox} secureTextEntry={true} placeholder="enter password" onChangeText={(text) => { this.setState({ password: text }) }} />
                </View>
                <View>
                    <TouchableOpacity style={{ height: 30, width: 90, borderWidth: 1, marginTop: 20, paddingTop: 5, borderRadius: 7 }} onPress={() => {
                        this.login(this.state.emailID, this.state.password)
                    }}>
                        <Text style={{ textAlign: 'center' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }

}
const styles =StyleSheet.create({
    loginBox:{
        width:300,
        height:40,
        borderWidth:1.5,
        fontSize:20,
        margin:10,
        paddingLeft:10,

    },
})