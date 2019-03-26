import React from "react"
import TextField from "@material-ui/core/TextField"


export default class FormChange extends React.Component {
    state = {
        text: "",
        display: "none"
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
                style={{display: this.state.display}}
                onChange={this.handleChange}
                label="Change Task"
                margin="normal"
                value={text}
                
            
            />
        )
    }
}