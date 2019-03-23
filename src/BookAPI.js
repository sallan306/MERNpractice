import React from "react"
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import { Checkbox, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import NewBookForm from "./NewBookForm"
import gql from "graphql-tag"
import {graphql, compose} from "react-apollo"

const CreateBookMutation = gql`
    mutation($title: String!, $author: String, $releaseDate: String) {
        createBook(title: $title, author: $author, releaseDate: $releaseDate) {
            id
            title
            author
            releaseDate
            isRead
        }
    }     
`
const ReadBookQuery = gql`
    {
        books {
            id
            title
            author
            releaseDate
            isRead
        }
    }
`
const UpdateBookMutation = gql`
    mutation($id: ID!, $author: String, $releaseDate: String, $isRead: Boolean) {
        updateBook (id: $id, author: $author, releaseDate: $releaseDate, isRead: $isRead)
    }
`

const DeleteBookMutation = gql`
    mutation($id: ID!) {
        deleteBook(id: $id)
    }
 `
 
 class API2 extends React.Component {
     constructor() {
         super()
         this.state = {

        }
    }
    
    createBook = async response => {
        await this.props.createBook({
            variables: {
                title: response.title,
                author: response.author,
                releaseDate: response.releaseDate
            },
            update: (store, {data: { createBook } }) => {

                const data = store.readQuery({ query: ReadBookQuery });
                data.books.unshift(createBook)
                store.writeQuery({ query: ReadBookQuery, data });
    
              }
        })
    }
    updateBook = async book => {
        await this.props.updateBook({
            variables: {
                id: book.id,
                isRead: !book.isRead
            },
            update: store => {
                const data = store.readQuery({ query: ReadBookQuery });
                data.books = data.books.map(x => x.id === book.id ? ({
                    ...book,
                    isRead: !book.isRead 
                    }) : x
                )
                store.writeQuery({ query: ReadBookQuery, data });
            }
            
        })
    }
    deleteBook = async book => {
        await this.props.deleteBook({
            variables: {
                id: book.id
            },
            update: store => {

                const data = store.readQuery({ query: ReadBookQuery });
                data.books = data.books.filter(x => x.id !== book.id)
                store.writeQuery({ query: ReadBookQuery, data });
    
              }
        })
    }


    render() {
        const {data: {loading, books}} = this.props
        if (loading) {
          return null
        }
        return (
          <div style={{display: "flex"}}>
            <div style={{margin: "auto", width: 400}}>

            <Paper elevation={1}>
                <NewBookForm submit={this.createBook}/>
                <List>
                {books.map(book => (
                        <ListItem 
                            button 
                            key={book.id}
                            dense
                            disableRipple
                            >

                            <Checkbox
                                onClick={() => this.updateBook(book)}
                                primary={"read"}
                                checked={book.isRead}
                                tabIndex/>
                            <ListItemText 
                                primary={book.title} 
                                secondary={"Author: "+book.author+" Release date: "+book.releaseDate}
                            />
                            <ListItemSecondaryAction>
                            <IconButton onClick={() => this.deleteBook(book)}><CloseIcon/></IconButton>
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

    graphql(CreateBookMutation, {name: "createBook"}),
    graphql(ReadBookQuery),
    graphql(UpdateBookMutation, {name: "updateBook"}),
    graphql(DeleteBookMutation, {name: "deleteBook"})

)(API2)

//enter function here