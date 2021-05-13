import React, { Component } from 'react';
import {  View } from 'react-native';
import { createAppContainer} from 'react-navigation'; 
import {createBottomTabNavigator} from 'react-navigation-tabs'

// You can import from local files

import TransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from './screens/SearchScreen';

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default class App extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <Appcontainer />
      </View>
    )
  }
}

var TabNavigator = createBottomTabNavigator({
  TransactionScreen  :{screen:TransactionScreen} ,
  SearchScreen : {screen:SearchScreen} 
})
const Appcontainer = createAppContainer(TabNavigator)