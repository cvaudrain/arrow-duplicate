import React from "react"

function Footer(props){
    let currYear = new Date().getFullYear();
    return (
   
    <div className="footer centered glowText br-indigo glowtext">
        <p className="">{new Date().getFullYear()}</p>
        <p>Marzipan Digital</p>
        </div>
   
    )
}

export default Footer