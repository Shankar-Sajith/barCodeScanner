import React, { Component } from 'react';
import { View,Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'

// You can import from local files

import TransactionScreen from './screens/BookTransactionScreen .js';
import SearchScreen from './screens/SearchScreen.js';

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Appcontainer />
      </View>
    )
  }
}

var TabNavigator = createBottomTabNavigator({
  TransactionScreen: { screen: TransactionScreen },
  SearchScreen: { screen: SearchScreen }
},
  {
    defaultNavigationOptions:({navigation})=>({
      tabBarIcon:()=>{
        const routeName = navigation.state.routeName
        if(routeName==="TransactionScreen"){
          return(
            <Image source={require("./assets/book.png")}  style={{width:40,height:40}}/>
          );
        }
        else if(routeName==='SearchScreen'){
          return(
            <Image source={require("./assets/searchingbook.png")} style={{width:40,height:40}}/>
          );
        }
      }
    })
  }
)
const Appcontainer = createAppContainer(TabNavigator)