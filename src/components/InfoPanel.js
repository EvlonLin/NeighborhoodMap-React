import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MediaQuery from 'react-responsive';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
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

const theme = createMuiTheme({
	palette: {
    primary: { main: grey[50] }
  },
});
const styles = theme => ({

  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    height: 425,
    top:10
  },
  root2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  list: {
  	padding: '12px 0 12px 20px',
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  menu: {
  	position:'absolute',
  	bottom: 630,
  	left: 320,
    '&:hover': {
      background: 'rgba(240, 240, 240, 0)',
    },
  },
  menuClose: {
		bottom: 325,
		left: 323,
  },
});

class InfoPanel extends Component {
	state = {
		width: window.innerWidth,
	  query: '',
	  type: 'all',
	  slideMenu: true,
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
					return this.ListItem(marker);
				}
			})
		} else if (query) {
				markers.map( marker => marker.setMap(null))
				return showingContacts.map(marker => {
					marker.setAnimation(window.google.maps.Animation.BOUNCE)
					marker.setMap(map)
					return this.ListItem(marker);
				})
		} else if (type === 'all') {
				return markers.map(marker => {
					marker.setAnimation(window.google.maps.Animation.DROP)
					marker.setMap(map)
					return this.ListItem(marker);
				})
		}	else {
				map.setCenter({lat: 43.6547878, lng: -79.3967198});
				map.setZoom(13);
				map.panBy(0, 0);
				markers.map( marker => marker.setMap(null))
				return markers.map(marker => {
					if (type === marker.type){
						marker.setAnimation(window.google.maps.Animation.DROP)
						marker.setMap(map)
						return this.ListItem(marker);
					}
				})
		}
	}

	defaultList (newType) {
		this.props.infowindow.close()
		this.setState({ type:newType });
		this.setState({ query:'' })
		this.props.map.setCenter({lat: 43.6547878, lng: -79.3967198});
		this.props.map.setZoom(13);
		this.props.map.panBy(0, 0);
	}

	ListItem (marker) {
		const { classes, handleClick } = this.props;
		return(
		<ListItem key={marker.title} disableGutters button className={classes.list} onClick={e => handleClick(marker)}>
			  <Avatar>
            {marker.type === "food" ? <Icon>restaurant</Icon> : <Icon>local_play</Icon> }
        </Avatar>
			<ListItemText primary={marker.title} secondary={marker.address} />
		</ListItem>
		);
	}

	filterList = (query) => {
		this.setState({ query })
	}

	handleButton = (newType) => {
		this.props.infowindow.close()
    this.setState({ type:newType });
    this.createList();
  }

  handleSlide = () => {
  	const currentState = this.state.slideMenu;
  	this.setState({ slideMenu: !currentState });
  }

	render() {
		const { classes, markers, handleClick } = this.props;
		const { query } = this.state;

    return (
	    <nav className={this.state.slideMenu? 'open' : null} id="sideMenu">
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
		    	<Tooltip title="Restaurants Filter" placement="top">
			      <Button variant="fab" value="food" color="primary" aria-label="add" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
			        <Icon>restaurant</Icon>
			      </Button>
		      </Tooltip>
		      <Tooltip title="FunPlaces Filter" placement="top">
			      <Button variant="fab" value="fun" color="secondary" aria-label="edit" className={classes.button} onClick={e => this.handleButton(e.currentTarget.value)}>
			        <Icon>local_play</Icon>
			      </Button>
		      </Tooltip>
		      <Tooltip title="Reset" placement="top">
			      <Button variant="fab" value="all" aria-label="delete" className={classes.button} onClick={e => this.defaultList(e.currentTarget.value)}>
			        <Icon style={{ fontSize: 30 }}>refresh</Icon>
			      </Button>
		      </Tooltip>
		    </div>
		    <div className={classes.root}>
		      <List>
						{this.createList()}
		      </List>
    		</div>
	      <p className="footer">
	        App Created by 
	      </p>
	      <img className="logo" src={require('../img/logo.png')} alt={'Logo for EvlonLin'}/>
	      <Tooltip title="Hide Menu" placement="top">
		      <IconButton 
		      aria-label="delete" 
		      className={classNames(classes.menu, {
            [classes.menuClose]: this.state.slideMenu === false,
          })} 
          onClick={this.handleSlide}
          >
		      	<MuiThemeProvider theme={theme}>
				    	<Icon style={{ fontSize: 48 }} color={this.state.slideMenu ? "action":"primary"}>
				    	{this.state.slideMenu ? "navigate_before":"navigate_next"}
				    	</Icon>
				    </MuiThemeProvider>
				  </IconButton>
			  </Tooltip>
	    </nav>
    );
	}

	 //  onResize = () => {
  //   if (handleWidth > )
  // }

}
InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoPanel);
// if (typeof google === 'object' && typeof google.maps === 'object')
// baefecde7ea358ba833d351ab220ed01 zomato
// J34XRZ3VMGC0DRUHC2ZAMVJ5RWU1G01JDDPEZ4PVB3L1KSH3 client id foursquareTPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW
// VRV0SUVBLZGKHSMEVDUYHNG5MQFRXLX04DRMR3MPTYH4RK3Z client secret 4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE