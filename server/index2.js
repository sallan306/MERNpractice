const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MERNtest2', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const Book = mongoose.model("Book", {
  title: String,
  author: String,
  releaseDate: String,
  isRead: Boolean
})

const typeDefs =
 `
  type Query {
    books: [Book]
  }
  type Book {
    id: ID!
    title: String!
    author: String
    releaseDate: String
    isRead: Boolean
  }
  type Mutation {
    createBook(title: String!, author: String, releaseDate: String, isRead: Boolean) : Book
    updateBook(id: ID!, author: String, releaseDate: String, isRead: Boolean) : String
    deleteBook(id: ID!) : String
    deleteAllBooks : String
  }
`
//hello takes an argument(name is name of argument: string is data type) 
//: return data type, ! means mandatory

const resolvers = {
  Query: {
    books: () => Book.find()
  },
  Mutation: {
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
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once("open", function() {
    
  server.start(() => console.log('Server is running on localhost:4000'))

})