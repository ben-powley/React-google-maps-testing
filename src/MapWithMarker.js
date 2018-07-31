import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";

const MapWithMarker = withScriptjs(
    withGoogleMap(props => {
        return (
            <GoogleMap
                defaultZoom={14}
                center={
                    props.markerPosition.lat !== 0
                        ? props.markerPosition
                        : { lat: 52.05369, lng: 1.138636 }
                }
                defaultOptions={{ disableDefaultUI: true }}
            >
                {props.showMarker && (
                    <MarkerWithLabel
                        position={props.markerPosition}
                        labelAnchor={
                            /* eslint-disable no-undef */ new google.maps.Point(
                                30,
                                0
                            )
                        }
                    >
                        <div className="marker-label">{props.labelText}</div>
                    </MarkerWithLabel>
                )}
            </GoogleMap>
        );
    })
);

class Map extends React.Component {
    state = {
        showInputContainer: true,
        showMarker: false,
        markerPosition: { lat: 0, lng: 0 },
        raceNumberInput: "",
        raceNumber: ""
    };

    constructor(props) {
        super(props);

        this.onRaceNumberChange = this.onRaceNumberChange.bind(this);
        this.onRaceNumberSubmit = this.onRaceNumberSubmit.bind(this);
    }

    onRaceNumberChange(event) {
        this.setState({
            raceNumberInput: event.target.value
        });
    }

    onRaceNumberSubmit() {
        var self = this;

        navigator.geolocation.getCurrentPosition(function(position) {
            self.setState({
                raceNumber: self.state.raceNumberInput,
                raceNumberInput: "",
                showMarker: true,
                showInputContainer: false,
                markerPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
        });

        navigator.geolocation.watchPosition(function(position) {
            console.log("Updated location", position);
            self.setState({
                markerPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
        });
    }

    render() {
        return (
            <div className="Map">
                {this.state.showInputContainer && (
                    <div className="input-container">
                        <input
                            className="race-number-input"
                            onChange={this.onRaceNumberChange}
                            value={this.state.raceNumberInput}
                            placeholder="Race number..."
                        />
                        <button
                            className="submit-race-number"
                            onClick={this.onRaceNumberSubmit}
                        >
                            Submit
                        </button>
                    </div>
                )}

                <MapWithMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDNHkTC4ERHSMKrJkKFvGi4vdPXFkROQz8"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    showMarker={this.state.showMarker}
                    labelText={this.state.raceNumber}
                    markerPosition={this.state.markerPosition}
                />
            </div>
        );
    }
}

export default Map;
