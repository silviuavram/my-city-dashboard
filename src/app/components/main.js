import React, { Component } from 'react';
import { Places } from './place/places';
import { Form } from './form/form';
import Map from './map/map';
import './main.scss'
import Client from '../services/google-client/googleClient'
import { PlaceDetails } from './place/placeDetails';

export class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			places: [],
			center: undefined,
			nextPageToken: undefined,
			activeIndex: -1
		};

		this.initialCenter = {
			lat: 50.0480923,
			lng: 14.457385599999997
		};

		this.onActiveIndexChanged = this.onActiveIndexChanged.bind(this);
	}

	sendQuery(searchParams) {
		Client.getPlaces({
			location: this.state.center || this.initialCenter,
			radius: 400,
			keyword: searchParams.keyword,
			language: searchParams.language,
			opennow: searchParams.opennow,
			type: searchParams.type
		}).then(result => {
			this.setState({ places: result.results, nextPageToken: result.next_page_token });
		});
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(location => {
			this.setState({
				center: {
					lat: location.coords.latitude,
					lng: location.coords.longitude
				}
			})
		});
	}

	onActiveIndexChanged(newIndex) {
		this.setState({
			activeIndex: newIndex
		});
	}

	render() {
		return (
			<main>
				<div id="map">
					<Map places={this.state.places}
						center={this.state.center}
						initialCenter={this.initialCenter}
						activeIndex={this.state.activeIndex}
						onActiveIndexChanged={this.onActiveIndexChanged} />
				</div>
				<Form sendQuery={searchParams => this.sendQuery(searchParams)} />
				{this.state.activeIndex === -1 ? <Places places={this.state.places} /> : <PlaceDetails place={this.state.places[this.state.activeIndex]} />}
			</main>
		);
	}
}