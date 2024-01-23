import { useState } from "react"

export default function Square(props){
    
    return(
        <button className="cell" onClick={props.updateOnclick}>
            {props.viewValue}
        </button>
    )
}
