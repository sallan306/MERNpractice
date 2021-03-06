import React from "react"
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from "@material-ui/icons/Description"
import { Checkbox, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import NewTodoForm from "./NewTodoForm"
import gql from "graphql-tag"
import {graphql, compose} from "react-apollo"

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
 const ChangeTodoNameMutation = gql`

  mutation($id: ID!, $text: String!) {

    changeTodoName(text: $text, id: $id)

  }

 `
class TodoAPI extends React.Component {
    constructor() {
        super()
        this.state = {
            checked: [0],
            formInformation: "",
            editDisplay: "none"
        }
    }
    createTodo = async text => {
      await this.props.createTodo({
        variables: {
          text
        },
        update: (store, {data: { createTodo } }) => {

          const data = store.readQuery({ query: TodosQuery });
          data.todos.unshift(createTodo)
          store.writeQuery({ query: TodosQuery, data });

        }
      })
    }

    updateTodo = async todo => {

        await this.props.updateTodo({
          variables: {
            id: todo.id,
            complete: !todo.complete
          },
          update: store => {

            const data = store.readQuery({ query: TodosQuery });
            data.todos = data.todos.map(x => x.id === todo.id ? ({
                ...todo,
                complete: !todo.complete 
                }) : x
            )
            store.writeQuery({ query: TodosQuery, data });

          }
        })
      }
      changeTodoName = async todo => {
        console.log("hi")
        await this.props.changeTodoName({
          variables: {
            id: todo.id,
            text: this.state.formInformation
          },
          
          update: store => {

            const data = store.readQuery({ query: TodosQuery });
            data.todos = data.todos.map(x => x.id === todo.id ? ({
                ...todo,
                text: this.state.formInformation
                }) : x
            )
            store.writeQuery({ query: TodosQuery, data });
            this.setState({
              formInformation: ""
            })

          }
        })
      }


      updateFormInformation = text => {
        this.setState({
          formInformation: text
        })
      }
      
      removeTodo = async todo => {
        await this.props.removeTodo({
          variables: {
            id: todo.id,
          },
          update: store => {
  
            const data = store.readQuery({ query: TodosQuery });
            data.todos = data.todos.filter(x => x.id !== todo.id)
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
          <div style={{display: this.props.todoDisplay}}>
            <div style={{margin: "auto", width: 400}}>
              <Paper elevation={1}>
                  <NewTodoForm submit={this.createTodo}/>
                  <List>
                    {todos.map(todo => (
                            <ListItem 
                              button 
                              key={todo.id}
                              dense
                              disableRipple

                            >
                              <Checkbox
                                checked={todo.complete}
                                tabIndex={todo.id}
                                onClick={() => this.updateTodo(todo)}
                              />
                              <ListItemText primary={todo.text}/>
                              <ListItemSecondaryAction>
                                <IconButton onClick={() => this.removeTodo(todo)}><CloseIcon/></IconButton>
                                <IconButton onClick={this.toggleEditVisibility}><EditIcon/></IconButton>
                                
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
    graphql(ChangeTodoNameMutation, {name: "changeTodoName"}),
    graphql(RemoveMutation,     {name: "removeTodo"}),
    graphql(UpdateMutation,     {name: "updateTodo"})
    
    )(TodoAPI)