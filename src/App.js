import React, { Component } from 'react';

import BookAPI from './BookAPI';
import TodoAPI from './TodoAPI';
import MovieAPI from "./MovieAPI"




class App extends Component {
  state = {
    currentTab: "books",

  }

  currentTab = clickedTab => {
    this.setState({
      currentTab: clickedTab
    })


  }

  render() {

    return(
        <div>
          <header style={{display: "flex"}}>
            <button style={{margin: "auto", width: 400}}onClick={ () => this.currentTab("books")}>Books Database</button>
            <button style={{margin: "auto", width: 400}}onClick={ () => this.currentTab("todos")}>Todos Database</button>
            <button style={{margin: "auto", width: 400}}onClick={ () => this.currentTab("movies")}>Movies Database</button>
          </header>
            {this.state.currentTab === "books" ? <BookAPI/> : ""}
            {this.state.currentTab === "todos" ? <TodoAPI/> : ""}
            {this.state.currentTab === "movies" ? <MovieAPI/> : ""}
        </div>
      )
  }
}

export default App
