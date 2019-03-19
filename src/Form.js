import React from "react"
import TextField from "@material-ui/core/TextField"


export default class Form extends React.Component {
    constructor() {
        super()
        this.state = {
            text: ""
        }
    }
    
    handleChange = (e) => {
        const newText = e.target.value
        this.setState({
            text: newText
        })
    }

    handleKeyDown = e => {
        console.log(e.key)
        if (e.key === "Enter") {
            this.props.submit(this.state.text)
            console.log("yep")
            this.setState({
                text: ""
            })
        }
    }

    render() {
        const {text} = this.state
        return (
            <TextField 
                fullWidth 
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                label="todo..."
                margin="normal"
                value={text}
                
            
            />
        )
    }
}