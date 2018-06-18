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


class InfoPanel extends Component {
	state = {
	  query: ''
	}

	render() {
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
	    </div>
    );
	}
}

export default InfoPanel;
// if (typeof google === 'object' && typeof google.maps === 'object')
// baefecde7ea358ba833d351ab220ed01 zomato
// J34XRZ3VMGC0DRUHC2ZAMVJ5RWU1G01JDDPEZ4PVB3L1KSH3 client id foursquare
// VRV0SUVBLZGKHSMEVDUYHNG5MQFRXLX04DRMR3MPTYH4RK3Z client secret