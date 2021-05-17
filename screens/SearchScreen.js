import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import db from '../config'


export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null
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
  SearchTransactions = async () => {
    
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
    )
  }
}
