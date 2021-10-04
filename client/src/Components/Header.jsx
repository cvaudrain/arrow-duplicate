import { getThemeProps } from "@material-ui/styles"
import React from "react"
import {BrowserRouter, Link} from "react-router-dom"

import SwipeableDrawerCustom from "./SwipeableDrawer"



function Header(props){
    
    

    return (
    <header className="mclaren">
    <SwipeableDrawerCustom
       drawerLogout={props.logout}
       drawerToCalendar={props.toCalendar}
       
    />
    
<p className="indigo">{props.headerText}</p>
 <h3 className="greeting">Hello, {props.userNameGreeting}.</h3>


{/* <Link to="/authenticate">
<button onClick={props.logout} className="logout-button align-r" >Logout</button>
</Link> */}
    </header>
    )
}

export default Header