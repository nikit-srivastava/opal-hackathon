import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';

import icon_image from '../data/location-icon-atlas.png';
import image_json from '../data/location-icon-mapping.json';

import IconClusterLayer from './icon-cluster-layer';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoibmlraXQ5MSIsImEiOiJjamt2MG5jd2Qwa2o5M3FtcnhoNDQ2YjRoIn0.oMdD9S92FwUk2SBVZMiT9A'; // eslint-disable-line

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json'; // eslint-disable-line
 // const DATA_URL =
  //'http://localhost:8080/fetch-data';

const MAP_VIEW = new MapView({repeat: true});
const INITIAL_VIEW_STATE = {
  longitude: -35,
  latitude: 36.7,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};
/* eslint-disable react/no-deprecated */
export default class MapComp extends Component {
	
	componentDidMount() {
        const self = this;
        this.getData(self);
    }
	
  constructor(props) {
    super(props);
    this.startRender();
  }
  
  startRender() {
	this.state = {
      x: 0,
      y: 0,
      hoveredObject: null,
      expandedObjects: null,
	  dummyData: []
    };
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
  }
	  
  
  getData(self) {
    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest()

    // get a callback when the server responds
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      const newData = JSON.parse(xhr.responseText);
      console.log('new data arrived: ', newData);
	  self.setState({ dummyData: newData })
    })
    // open the request with the verb and the url
    xhr.open('GET', 'http://localhost:8080/fetch-data')
    // send the request
    xhr.send()
  }

  _onHover(info) {
    if (this.state.expandedObjects) {
      return;
    }

    const {x, y, object} = info;
    this.setState({x, y, hoveredObject: object});
  }

  _onClick(info) {
    const {showCluster = true} = this.props;
    const {x, y, objects, object} = info;

    if (object && showCluster) {
      this.setState({x, y, expandedObjects: objects || [object]});
    } else {
      this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({expandedObjects: null, hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects} = this.state;

    if (expandedObjects) {
      return (
        <div className="tooltip interactive" style={{left: x, top: y}}>
          {expandedObjects.map(({name, year, mass, class: meteorClass}) => {
            return (
              <div key={name}>
                <h5>{name}</h5>
                <div>Year: {year || 'unknown'}</div>
                <div>Class: {meteorClass}</div>
                <div>Mass: {mass}g</div>
              </div>
            );
          })}
        </div>
      );
    }

    if (!hoveredObject) {
      return null;
    }

    return hoveredObject.cluster ? (
      <div className="tooltip" style={{left: x, top: y}}>
        <h5>{hoveredObject.point_count} records</h5>
      </div>
    ) : (
      <div className="tooltip" style={{left: x, top: y}}>
        <h5>{hoveredObject.datasetUri.length} Dataset(s) at this location.
        </h5>
      </div>
    );
  }

  _renderLayers() {
    const {
      data = this.state.dummyData,
      iconMapping = image_json,
      iconAtlas = icon_image,
      showCluster = true
    } = this.props;

    const layerProps = {
      data,
      pickable: true,
      getPosition: d => d.coordinates,
      iconAtlas,
      iconMapping,
      onHover: this._onHover
    };

    const layer = showCluster
      ? new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 60})
      : new IconLayer({
          ...layerProps,
          id: 'icon',
          getIcon: d => 'marker',
          sizeUnits: 'meters',
          sizeScale: 2000,
          sizeMinPixels: 6
        });

    return [layer];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;
	const ht = 90;
	const wd = 85;
    return (
      <DeckGL
	  style={{height: ht+'vh'}}
        layers={this._renderLayers()}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onViewStateChange={this._closePopup}
        onClick={this._onClick}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />

        {this._renderhoveredItems}
		
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<MapComp/>, container);
}
