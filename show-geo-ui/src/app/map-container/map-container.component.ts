import { Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

declare var deck;

declare function HexagonLayer(a): void;
declare function IconLayer(a): void;
@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {
  public showHourGlass = false;
  public dummyData: any;
  public intervalId: any;
  constructor(private restservice: RestService) {
  }

  ngOnInit(): void {
    this.restservice.getNPRequest('/fetch-data').subscribe(resp => this.setData(resp));

  }

  setData(data: any) {
    this.dummyData = data;
    this.intervalId = setInterval(x => {
      this.renderGraph();
    }, 400);
  }

  renderGraph() {
    clearInterval(this.intervalId);
    const deckobj = new deck.DeckGL({
      container: 'map-container',
      mapboxApiAccessToken: 'pk.eyJ1IjoibmlraXQ5MSIsImEiOiJjamt2MG5jd2Qwa2o5M3FtcnhoNDQ2YjRoIn0.oMdD9S92FwUk2SBVZMiT9A',
      mapStyle: 'mapbox://styles/mapbox/dark-v9',
      longitude: this.dummyData[0].coordinates[0],
      latitude: this.dummyData[0].coordinates[1],
      zoom: 4,
      bearing: 0,
      pitch: 0,
      minZoom: 3,
      maxZoom: 100,
      maxPitch: 0,
      layers: [
      /*  new HexagonLayer({
          id: 'hexagon-layer',
          data: this.dummyData,
          pickable: true,
          extruded: true,
          radius: 1000,
          elevationScale: 100,
          getPosition: d => d.coordinates,
          // onHover: ({object}) => setTooltip(`${object.centroid.join(', ')}\nCount: ${object.points.length}`)
          onHover: this.updateTooltip
        }),*/
        new IconLayer({
          id: 'icon-layer',
          data: this.dummyData,
          pickable: true,
          iconAtlas: '/assets/icon-atlas.png',
          iconMapping: {
            marker: {
              x: 0,
              y: 0,
              width: 500,
              height: 500,
              anchorY: 250,
              mask: true
            }
          },
          sizeScale: 100,
          getPosition: d => d.coordinates,
          getIcon: d => 'marker',
          getColor: d => [255, 80, 80],
          onHover: this.showUri,
          onClick: this.openNewTab
          // onHover: ({object}) => setTooltip(`${object.name}\n${object.address}`)
        })
      ]
    });
  }

  refreshCache() {
    this.showHourGlass = true;
    this.restservice.getNPRequest('/refresh-cache').subscribe(resp => this.refreshMapView(resp));
  }

  refreshMapView(response: string) {
    if (response){
      this.dummyData = response;
      this.renderGraph();
    }
    // Future work: Show something went wrong here
    this.showHourGlass = false;
  }

  openNewTab({x, y, object}) {
    window.open(object.datasetUri, '_blank');
  }

  showUri({x, y, object}) {
    const tooltip = document.getElementById('gstt');
    y = y - 50;
    x = x - 50;
    if (object) {
      tooltip.style.top = `${y}px`;
      tooltip.style.left = `${x}px`;
      tooltip.innerHTML = object.datasetUri + '<br>';
    } else {
      tooltip.innerHTML = '';
    }
  }
  getColor(x){
    console.log(x);
  }

  updateTooltip({x, y, object}) {
    const tooltip = document.getElementById('gstt');
    y = y - 15;
    x = x - 10;
    if (object) {
      tooltip.style.top = `${y}px`;
      tooltip.style.left = `${x}px`;
      tooltip.innerHTML = object.points.length + ' Entry(s) <br>';
    } else {
      tooltip.innerHTML = '';
    }
  }

}
