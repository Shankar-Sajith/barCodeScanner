import React, { Component } from 'react';
import { Text, View, FlatList,TextInput,TouchableOpacity,StyleSheet } from 'react-native';
import db from '../config'


export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      search:""
    }
  }

  fetchMoreTransactions = async () => {
    var text = this.state.search.toUpperCase()
    var enteredTexte = text.split("")
    if (enteredTexte[0].toUpperCase() === "B") {
      const query = await db.collection("Transactions").where('bookID', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
    else if (enteredTexte[0].toUpperCase() === "S") {
      const query = await db.collection("Transactions").where('bookID', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
  }
  SearchTransactions = async (text) => {
    
    var enteredTexte = text.split("")
    if (enteredTexte[0].toUpperCase() === "B") {
      const query = await db.collection("Transactions").where('bookID', '==', text).get()
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
    else if (enteredTexte[0].toUpperCase() === "S") {
      const query = await db.collection("Transactions").where('bookID', '==', text).get()
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
  }
  componentDidMount = async () => {
    const query = await db.collection("Transactions").get()
    query.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()]
      })
    })
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput style ={styles.bar} placeholder ='Enter BookID or StudentID' onChangeText={(text)=>{
            this.setState({
              search:text
            })
          }} />
          <TouchableOpacity style ={styles.searchButton} onPress={()=>{
            this.SearchTransactions (this.state.search);
          }}><Text>Search</Text></TouchableOpacity>          
        </View>
        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => {
            <View style={{ borderBottomWidth: 2 }}>
              <Text>{"bookID" + item.bookID}</Text>
              <Text>{"studentID" + item.studentID}</Text>
              <Text>{"transactionType" + item.transactionType}</Text>
              <Text>{"date" + item.date.toDate()}</Text>
            </View>
          }}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.7}
        />

      </View>

    )
  }
}
const styles=StyleSheet.create({
  container:{
    flex:1,
    marginTop:20
  },
  searchBar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'grey'
  },
  bar:{
    borderWidth:2,
    height:20,
    width:300,
    paddingLeft:10,
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
  },
})