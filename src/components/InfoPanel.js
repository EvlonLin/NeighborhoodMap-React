import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
// import FoodIcon from '@material-ui/icons/Food';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    height: 450,
    top:10
  },
  root2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    margin: theme.spacing.unit * 2,
    '&:active': {
    	backgroundColor: '#3FBF3F',
    },
  },
});




class InfoPanel extends Component {
	state = {
	  value: '',
	  type: "all"

	}

	createList () {
		const { map, markers, handleClick } = this.props;
		const { type } = this.state;
		if (type === "all") {
			return markers.map(loc => {
				loc.setAnimation(window.google.maps.Animation.DROP)
				loc.setMap(map)
				return(
			 	<ListItem key={loc.title}  button onClick={e => handleClick(loc)}>
			  	<ListItemText primary={loc.title} secondary={loc.address} />
				</ListItem>
				);
			})
		} else {
				markers.map( mar => mar.setMap(null))
				return markers.map(loc => {
					if (type === loc.type){
						loc.setAnimation(window.google.maps.Animation.DROP)
						loc.setMap(map)
						return(
					 	<ListItem key={loc.title}  button onClick={e => handleClick(loc)}>
					  	<ListItemText primary={loc.title} secondary={loc.address} />
						</ListItem>
						);
					}
				})
			}
	}

	handleButton = (newType) => {
    this.setState({ type:newType });
    this.createList();
  };

	render() {
		const { classes, markers, handleClick } = this.props;
    return (
	    <div className="panel">
		    <TextField
		    id="search"
		    label="Enter a location"
		    margin="normal"
		    type="text"
		    placeholder=""
		    fullWidth={true}
		    />
		    <div id="buttons" className={classes.root2}>
		      <Button variant="fab" value="food" color="primary" aria-label="add" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
		        <AddIcon />
		      </Button>
		      <Button variant="fab" value="fun" color="secondary" aria-label="edit" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
		        <Icon>edit_icon</Icon>
		      </Button>
		      <Button variant="fab" value="all" aria-label="delete" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
		        <DeleteIcon />
		      </Button>
		    </div>
		    <div className={classes.root}>
		      <List>
						{this.createList()}
		      </List>
    		</div>
	    </div>
    );
	}
}
InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoPanel);
// if (typeof google === 'object' && typeof google.maps === 'object')
// baefecde7ea358ba833d351ab220ed01 zomato
// J34XRZ3VMGC0DRUHC2ZAMVJ5RWU1G01JDDPEZ4PVB3L1KSH3 client id foursquare
// VRV0SUVBLZGKHSMEVDUYHNG5MQFRXLX04DRMR3MPTYH4RK3Z client secret