import React from "react"
const APIKEY = "e8a7976d"

export default class MovieAPI extends React.Component {
    constructor() {
        super()
        this.state = {
            items: [],
            APICall: "",
            isLoaded: true
        }
    }
    componentDidMount() {

        fetch("http://www.omdbapi.com/?apikey="+APIKEY+"&t=dumbo")
        .then(res => res.json())
        .then(
          (result) => {
            console.log("result")
            console.log(result)
            this.setState({
              items: result
            });
          },
          (error) => {
            console.log("error")
              console.log(error)
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
 
    }

    handleChange = event => {
        var newText = event.target.value
        this.setState({
            APICall: newText
        })
    }
    newAPICall = request => {
        this.setState({isLoaded: false})
        request.preventDefault()
        fetch("http://www.omdbapi.com/?apikey="+APIKEY+"&t="+this.state.APICall)
        .then(res => res.json())
        .then(
          (result) => {
            console.log("result")
            console.log(result)
            this.setState({
              items: result,
              isLoaded: true
            });
          },
          (error) => {
            console.log("error")
              console.log(error)
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
    render() {
        const {Title, Released, Poster, Rated, Director, Genre, Runtime, imdbRating} = this.state.items
        return (
            
            <div style={{display: this.props.movieDisplay}} >
                <div style={{margin: "auto", width: 400}}>
                    <div style={{textAlign: "left", display: this.state.isLoaded ? "block" : "none"}}>
                        Movies<br/>
                        Title: {Title}<br/>
                        Release Date: {Released}<br/>
                        Rated: {Rated}<br/>
                        Director(s): {Director}<br/>
                        Genre: {Genre}<br/>
                        Runtime: {Runtime}<br/>
                        Ratings<br/>
                         IMDB rating: {imdbRating} / 10<br/>
                        <img style={{width: 200, height: 300, textAlign:"center"}}src={Poster} alt={Title}/><br/>
                        <form onSubmit={this.newAPICall}>
                            <input 
                                type="text"
                                name="newAPICall"
                                value={this.state.newAPICall}
                                onChange={this.handleChange}/>
                            <button>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}