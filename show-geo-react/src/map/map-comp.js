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

  const DATA_URL = 'http://localhost:8080/fetch-data';

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

  componentWillReceiveProps(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.getData(this);
    }
  }
	
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
      if(newData && newData.length >0){
        INITIAL_VIEW_STATE.longitude = newData[0].coordinates[0];
        INITIAL_VIEW_STATE.latitude = newData[0].coordinates[1];
      }

	  self.setState({ dummyData: newData })
    })
    // open the request with the verb and the url
    xhr.open('GET', DATA_URL)
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

  handleInfoBoxClick(eventDt){
    console.log('click detected on div: ',eventDt);
    eventDt.stopPropagation();
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects} = this.state;

    if (expandedObjects) {
      return (
        <div className="tooltip interactive" style={{left: x, top: y, positon: 'absolute'}}>
          {expandedObjects.length > 1
              ? <div>There are {hoveredObject?hoveredObject.point_count:'multiple'} coordinate pins at this location (Zoom in to expand) </div>
              : <a/>
          }
          {expandedObjects.map(({coordinates, datasetUri}) => {
            return (
              <div key={coordinates}>
                <h5>Longitude: { coordinates[0]}, Latitude: { coordinates[1]}</h5>
                <div> Available Datasets: {datasetUri.map((uri) => <div key={uri}><a href={uri} target="_blank">{uri}</a></div>) || 'unknown'}</div>
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
        <h5>{hoveredObject.point_count} Coordinates</h5>
      </div>
    ) : (
      <div className="tooltip" style={{left: x, top: y}}>
        <h5>{hoveredObject.datasetUri.length} Dataset(s) at this location
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
    return (
      <DeckGL
        layers={this._renderLayers()}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        //onViewStateChange={this._closePopup}
        onClick={this._onClick}
      ><StaticMap
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
