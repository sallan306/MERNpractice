import React, { Component } from 'react';
import gql from "graphql-tag"
import {graphql, compose} from "react-apollo"
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import { Checkbox, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import Form from "./Form"
const TodosQuery = gql`
 {
    todos {
      id
      text
      complete
    }
  }
`
const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo (id: $id, complete: $complete)
  }
`
const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
 `

 const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  } 

 `
class App extends Component {
  state = {
    checked: [0]
  }
  updateTodo = async todo => {

    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(x => x.id === todo.id ? ({
          ...todo,
          complete: !todo.complete 
        }) : x)
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    })
  }
  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id,
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.filter(x => x.id !== todo.id)
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    })
  }
  createTodo = async text => {
    await this.props.createTodo({
      variables: {
        text
      },
      update: (store, {data: { createTodo } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos.unshift(createTodo)
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    })
  }
  render() {
    const {data: {loading, todos}} = this.props
    if (loading) {
      return null
    }
    return (
      <div style={{display: "flex"}}>
        <div style={{margin: "auto", width: 400}}>
        
          <Paper elevation={1}>
            <Form submit={this.createTodo}/>
            <List>
              {todos.map(todo => (
              <ListItem 
                button 
                key={todo.id}
                dense
                onClick={() => this.updateTodo(todo)}
                >

                <Checkbox
                  checked={todo.complete}
                  tabIndex/>
                <ListItemText primary={todo.text}></ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.removeTodo(todo)}><CloseIcon/></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              
              ))}
            </List>
          </Paper>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(TodosQuery),
  graphql(CreateTodoMutation, {name: "createTodo"}),
  graphql(RemoveMutation, {name: "removeTodo"}),
  graphql(UpdateMutation, {name: "updateTodo"})
  )
  (App)

