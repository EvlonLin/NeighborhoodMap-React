import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import escapeRegExp from 'escape-string-regexp'

// CSS styles for material-ui elements
const styles = theme => ({
  listContainer: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    height: 'calc(95% - 148px)',
    'max-height': '430px',
    top:'2%',
    margin: '0 0 8% 0',
  },
  list: {
		'padding-left':'calc(5px + 3%)'
  },
  listText: {
  	'white-space': 'nowrap',
  },
  buttonList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  menuButtonOff: {
  	position: 'fixed',
  	'z-index': '2',
  	top: '20px',
  	left: '20px',
  },
  menuButtonOn: {
  	background: 'linear-gradient(45deg, #26A422 100%, #2196f3 0%)',
  	position: 'fixed',
  	'z-index': '2',
  	top: '20px',
  	left: '20px',
  },
});

class InfoPanel extends Component {
	state = {
	  query: '',
	  type: 'all',
	  active: false,
	}
	//generating the list items
	createList () {
		const { map, markers, resizeMapZoom } = this.props;
		const { type, query } = this.state;
		let showingContacts
		//build up the search engin
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingContacts = markers.filter((marker) => match.test(marker.title))
    } else {
      showingContacts = markers
    }
    //filter the search result for search engin
		if (query && type!== 'all') {
			markers.map( marker => marker.setMap(null))
			return showingContacts.map(marker => {
				if (type === marker.type){
					marker.setAnimation(window.google.maps.Animation.BOUNCE)
					marker.setMap(map)
					return this.ListItem(marker);
				}
				return null
			})
		} 
		//filter the search result for filter buttons and search engin
		else if (query) {
				markers.map( marker => marker.setMap(null))
				return showingContacts.map(marker => {
					marker.setAnimation(window.google.maps.Animation.BOUNCE)
					marker.setMap(map)
					return this.ListItem(marker);
				})
		} 
		//setup initial list items
		else if (type === 'all') {
				return markers.map(marker => {
					marker.setAnimation(window.google.maps.Animation.DROP)
					marker.setMap(map)
					return this.ListItem(marker);
				})
		}	
		//filter list items for filter buttons
		else {
				map.setCenter({lat: 43.6547878, lng: -79.3967198});
				resizeMapZoom()
				markers.map( marker => marker.setMap(null))
				return markers.map(marker => {
					if (type === marker.type){
						marker.setAnimation(window.google.maps.Animation.DROP)
						marker.setMap(map)
						return this.ListItem(marker);
					}
					return null
				})
		}
	}

	//filter list items for reset buttons
	handleResetButton (newType) {
		const { map, resizeMapZoom } = this.props;
		this.props.infowindow.close()
		this.setState({ type:newType });
		this.setState({ query:'' })
		map.setCenter({lat: 43.6547878, lng: -79.3967198});
		resizeMapZoom()
	}

	//create list items with icon by filter
	ListItem (marker) {
		const { classes, handleClick } = this.props;
		return(
		<ListItem key={marker.title} disableGutters button className={classes.list} aria-label={marker.title} onClick={e => handleClick(marker)}>
			  <Avatar>
            {marker.type === "food" ? <Icon>restaurant</Icon> : <Icon>local_play</Icon> }
        </Avatar>
			<ListItemText primary={marker.title} secondary={marker.address} className={classes.listText}/>
		</ListItem>
		);
	}

	//set query to state
	filterList = (query) => {
		this.setState({ query })
	}

	//handle filter button onclick event
	handleButton = (newType) => {
		this.props.infowindow.close()
    this.setState({ type:newType });
    this.createList();
  }

  //handler for switch to hide or show the side menu
  handleSlide = () =>{
  	const currentState = this.state.active;
  	this.setState({ active: !currentState });
  }

	render() {
		const { classes } = this.props;
		const { query } = this.state;

    return (
    	<div>
    	  <Button 
    	  variant="fab" 
    	  id="menu" 
    	  color={this.state.active ? 'primary': null}
    	  className={classNames(classes.menuButtonOff, {
            [classes.menuButtonOn]: this.state.active === true,
          })} 
    	  onClick={this.handleSlide}
    	  aria-label="Show Side Menu"
    	  >
			    <Icon>menu</Icon>
			  </Button>
		    <nav className={this.state.active ? 'open': null}  id="sideMenu">
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
			    <div id="buttons" className={classes.buttonList}>
			    	<Tooltip title="Restaurants Filter" placement="top">
				      <Button variant="fab" value="food" color="primary" aria-label="Restaurants Filter Button" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
				        <Icon>restaurant</Icon>
				      </Button>
			      </Tooltip>
			      <Tooltip title="FunPlaces Filter" placement="top">
				      <Button variant="fab" value="fun" color="secondary" aria-label="FunPlaces Filter Button" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
				        <Icon>local_play</Icon>
				      </Button>
			      </Tooltip>
			      <Tooltip title="Reset" placement="top">
				      <Button variant="fab" value="all" aria-label="Reset Button" className={classes.button} onClick={e => this.handleResetButton(e.currentTarget.value)}>
				        <Icon style={{ fontSize: 30 }}>refresh</Icon>
				      </Button>
			      </Tooltip>
			    </div>
			    <div className={classes.listContainer}>
			      <List>
							{this.createList()}
			      </List>
	    		</div>
		    </nav>
		  </div>  
    );
	}
}
InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoPanel);
