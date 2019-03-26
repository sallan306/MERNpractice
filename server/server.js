const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MERNtest', { useNewUrlParser: true });

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean
});

const Book = mongoose.model("Book", {
  title: String,
  author: String,
  releaseDate: String,
  isRead: Boolean
})

const typeDefs =
 `
  type Query {
    todos: [Todo]
    books: [Book]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Book {
    id: ID!
    title: String!
    author: String
    releaseDate: String
    isRead: Boolean
  }
  type Mutation {
    createTodo(text: String!) : Todo
    changeTodoName(id: ID!, text: String) : Boolean
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean

    createBook(title: String!, author: String, releaseDate: String, isRead: Boolean) : Book
    updateBook(id: ID!, author: String, releaseDate: String, isRead: Boolean) : String
    deleteBook(id: ID!) : String
    deleteAllBooks : String
  }

`
const resolvers = {
  Query: {
    todos: () => Todo.find(),
    books: () => Book.find()
  },
  Mutation: {
    createTodo: async (_, {text}) => {
      const todo = new Todo({ text, complete: false});
      await todo.save();
      return todo
    },
    updateTodo: async (_, {id, complete}) => {
      await Todo.findByIdAndUpdate(id, {complete})
      return true;
    },
    removeTodo: async (_, {id}) => {
      await Todo.findByIdAndRemove(id)
      return true;
    },
    changeTodoName: async (_,{id, text}) => {
      await Todo.findByIdAndUpdate(id, {text})
      return true;
    },


    createBook: async (_, {title, author, releaseDate, isRead}) => {
      author ? author : author = "none listed"
      releaseDate ? releaseDate : releaseDate = ""
      isRead === true ? isRead : isRead = false
      const book = new Book({title,author,releaseDate,isRead})
      await book.save();
      return book
    },
    updateBook: async (_, {id, author, releaseDate, isRead}) => {

      var updatePayload = {}
      author !== (null || undefined) ? updatePayload.author = author : null
      releaseDate !== (null || undefined) ? updatePayload.releaseDate = releaseDate : null
      isRead !== (null || undefined) ? updatePayload.isRead = isRead : null

      await Book.findByIdAndUpdate(id, updatePayload)
      return "updated book "

    },
    deleteBook: async (_, {id}) => {
      await Book.findByIdAndDelete(id)
      return  "Deleted"
    },
    deleteAllBooks: async (_,{}) => {
      await Book.deleteMany()
      return "Deleted all books"
    }
  
  }
}
 
const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once("open", function() {
    
    server.start(() => console.log('Server is running on localhost:4000'))

})
