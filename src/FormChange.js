import React from "react"
import TextField from "@material-ui/core/TextField"


export default class FormChange extends React.Component {
    state = {
        text: ""
    }
    
    handleChange = e => {
        const newText = e.target.value
        this.props.updateFormInformation(newText)
        this.setState({
            text: newText
        })
    }
    render() {
        const {text} = this.state
        return (
            <TextField  
                onChange={this.handleChange}
                label="Change Task"
                margin="normal"
                value={text}
                
            
            />
        )
    }
}