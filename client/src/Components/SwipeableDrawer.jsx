import React,{useState,useContext} from "react"
import {BrowserRouter, Link} from "react-router-dom"
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';false

import ProfileTray from "./ProfileTray"
import {userContext} from "./App"
import {credentialContext} from "./App"
function SwipeableDrawerCustom(props){
    const classes = makeStyles();
    const [state, setState] = React.useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
      menu:false
    });
    const globalUser = useContext(userContext) //passed usernameFromAuth from App.jsx
    const toggleDrawer = (anchor, open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setState({ ...state, [anchor]: open });
    };
  
    function assignRoute(string){ //used in .map() to assign path attr values to <Link> wrappers
        if(string=="Dashboard"){
            return "/"
        } else if(string=="Scheduler"){
            return "/scheduler"
        } else if(string=="Settings"){
            return "/settings"
        } 
    }
    const list = (anchor) => (

      <div
        className={clsx(classes.list, {
          [classes.fullList]: anchor === 'top' || anchor === 'bottom' || anchor === 'menu',
        })}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
      <div className="mclaren">
      {anchor != globalUser &&
        <List >
          {["Dashboard", "Scheduler", ].map((text, index) => (
            <Link
            to={assignRoute(text)} 
            style={{textDecoration:"none",
            color:"inherit"}}
            >
            <ListItem button key={text} >
              
              <ListItemText primary={text} />
            </ListItem>
            </Link>
          ))}
        </List>
      }
      
        </div> 
        {anchor != globalUser &&
        <div>
        <Divider />
        <List>
          {[useContext(userContext),"Settings","Logout"].map((text, index) => (
            <Link
            to={assignRoute(text)} 
            style={{textDecoration:"none",
            color:"inherit"}}
            >
            <ListItem button key={text}>
              
              <ListItemText primary={text} />
            </ListItem>
            </Link>
          ))}
        </List>
        
        </div>
        }
        {anchor == useContext(userContext) &&
        <div>
      
        <ProfileTray
          username={globalUser.username}
          email={credentialContext.email}
        />
        
        </div>
        }
    
      
      </div>
      
    );
  
    return (
      <div>
        {[useContext(userContext), 'menu'].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button style={{color:"#e09200", textShadow: "0 1px 2px black"}} className="white" onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              {list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    );
  }

export default SwipeableDrawerCustom