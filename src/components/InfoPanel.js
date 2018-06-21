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
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
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
  },
});

class InfoPanel extends Component {
	state = {
	  query: '',
	  type: 'all'
	}

	createList () {
		const { map, markers, handleClick } = this.props;
		const { type, query } = this.state;

		let showingContacts
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingContacts = markers.filter((marker) => match.test(marker.title))
    } else {
      showingContacts = markers
    }

		if (query && type!== 'all') {
			markers.map( marker => marker.setMap(null))
			return showingContacts.map(marker => {
				if (type === marker.type){
					marker.setAnimation(window.google.maps.Animation.BOUNCE)
					marker.setMap(map)
					return(
				 	<ListItem key={marker.title}  button onClick={e => handleClick(marker)}>
				  	<ListItemText primary={marker.title} secondary={marker.address} />
					</ListItem>
					);
				}
			})
		} else if (query) {
				markers.map( marker => marker.setMap(null))
				return showingContacts.map(marker => {
					marker.setAnimation(window.google.maps.Animation.BOUNCE)
					marker.setMap(map)
					return(
				 	<ListItem key={marker.title}  button onClick={e => handleClick(marker)}>
				  	<ListItemText primary={marker.title} secondary={marker.address} />
					</ListItem>
					);
				})
		} else if (type === 'all') {
				return markers.map(marker => {
					marker.setAnimation(window.google.maps.Animation.DROP)
					marker.setMap(map)
					return(
				 	<ListItem key={marker.title}  button onClick={e => handleClick(marker)}>
				  	<ListItemText primary={marker.title} secondary={marker.address} />
					</ListItem>
					);
				})
		}	else {
				map.setCenter({lat: 43.6547878, lng: -79.3967198});
				map.panBy(0, 0);
				markers.map( marker => marker.setMap(null))
				return markers.map(marker => {
					if (type === marker.type){
						marker.setAnimation(window.google.maps.Animation.DROP)
						marker.setMap(map)
						return(
					 	<ListItem key={marker.title}  button onClick={e => handleClick(marker)}>
					  	<ListItemText primary={marker.title} secondary={marker.address} />
						</ListItem>
						);
					}
				})
		}
	}

	defaultList (newType) {
		this.setState({ type:newType });
		this.setState({ query:'' })
		this.props.map.setCenter({lat: 43.6547878, lng: -79.3967198});
		this.props.map.panBy(0, 0);
	}


	filterList = (query) => {
		this.setState({ query })
	}

	handleButton = (newType) => {
    this.setState({ type:newType });
    this.createList();
  };

	render() {
		const { classes, markers, handleClick } = this.props;
		const { query } = this.state;
    return (
	    <div className="panel">
		    <TextField
		    id="search"
		    label="Search a location"
		    margin="normal"
		    type="text"
		    placeholder=""
		    fullWidth
		    value={ query }
		    aria-labelledby="location filter"
		    onChange={(event) => this.filterList(event.target.value)}
		    />
		    <div id="buttons" className={classes.root2}>
		      <Button variant="fab" value="food" color="primary" aria-label="add" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
		        <AddIcon />
		      </Button>
		      <Button variant="fab" value="fun" color="secondary" aria-label="edit" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
		        <Icon>edit_icon</Icon>
		      </Button>
		      <Button variant="fab" value="all" aria-label="delete" className={classes.button} onClick={e => this.defaultList(e.currentTarget.value)}>
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