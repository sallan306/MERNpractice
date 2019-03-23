import React, { Component } from 'react';

import BookAPI from './BookAPI';
import TodoAPI from './TodoAPI';




class App extends Component {
  state = {

  }
  
  render() {

    return(
        <div>
            <BookAPI/>
            {/* <TodoAPI/> */}
        </div>
      )
  }
}

export default App
