import React from "react"
import TextField from "@material-ui/core/TextField"


export default class Form extends React.Component {
    constructor() {
        super()
        this.state = {
            title: "",
            author: "",
            releaseDate: "",
            titleError: false,
            releaseDateError: false,
            authorError: false
        }
    }
    
    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleKeyDown = event => {
        if (event.key === "Enter") {
            var submitPayload = {
                title: this.state.title,
                author: this.state.author,
                releaseDate: this.state.releaseDate
            }
            if (submitPayload.title !== "" && submitPayload.releaseDate !== "" && submitPayload.author !== "") {
                
                this.props.submit(submitPayload)
                console.log(submitPayload)
                this.setState({
                    title: "",
                    releaseDate: "",
                    author: ""
                })

            }
            else {
                submitPayload.title === "" ? this.setState({titleError: true}) : this.setState({titleError: false})
                submitPayload.releaseDate === "" ? this.setState({releaseDateError: true}) : this.setState({releaseDateError: false})
                submitPayload.author === "" ? this.setState({authorError: true}) : this.setState({authorError: false})
            }
        }
    }

    render() {
        return (
            <div>
                <TextField 
                    error={this.state.titleError}
                    variant="outlined"
                    fullWidth 
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    label="Book Title"
                    margin="normal"
                    name="title"
                    value={this.state.title}
                />
                <TextField 
                    error={this.state.authorError}
                    variant="outlined"
                    fullWidth 
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    label="Author"
                    margin="normal"
                    name="author"
                    value={this.state.author}
                />
                <TextField 
                    error={this.state.releaseDateError}
                    variant="outlined"
                    fullWidth 
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    label="Year Written"
                    margin="normal"
                    name="releaseDate"
                    value={this.state.releaseDate}
                />
            </div>
        )
    }
}