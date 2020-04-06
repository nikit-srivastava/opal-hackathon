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

  public dummyData: any = [{coordinates: [13.348979, 52.488697], datasetUri: 'https://europeandataportal.eu/set/data/b35d2622-5b10-4305-9628-a0c3db2c64b4'},
    {coordinates: [13.3069, 52.458458], datasetUri: 'https://europeandataportal.eu/set/data/6ac74801-c87d-48a5-a33a-f63448ee9ffe'},
    {coordinates: [13.33436, 52.477844], datasetUri: 'https://europeandataportal.eu/set/data/519c91a2-9376-3e06-b182-c2f246cb7c79'},
    {coordinates: [13.394501, 52.5141], datasetUri: 'https://europeandataportal.eu/set/data/2521be73-84f3-441c-9134-abbad67f9e93'},
    {coordinates: [13.33094, 52.47988], datasetUri: 'https://europeandataportal.eu/set/data/d19ddd94-8b57-3498-a5e8-a79f663a0844'},
    {coordinates: [13.304919, 52.48408], datasetUri: 'https://europeandataportal.eu/set/data/ab8ac354-278f-48b4-a326-dce494ff37d3'},
    {coordinates: [13.24928, 52.49408], datasetUri: 'https://europeandataportal.eu/set/data/e59918d9-125e-48c6-be33-11c2f594e4de'},
    {coordinates: [13.355441, 52.47212], datasetUri: 'https://europeandataportal.eu/set/data/c5f4ffbf-98ff-3dc4-95e0-67a9dab205a3'},
    {coordinates: [13.34212, 52.472157], datasetUri: 'https://europeandataportal.eu/set/data/4933154a-3999-3ef5-873a-a47285372425'},
    {coordinates: [13.43002, 52.43512], datasetUri: 'https://europeandataportal.eu/set/data/c5f4ffbf-98ff-3dc4-95e0-67a9dab205a3'},
    {coordinates: [13.47244, 52.57672], datasetUri: 'https://europeandataportal.eu/set/data/e59918d9-125e-48c6-be33-11c2f594e4de'},
    {coordinates: [13.353, 52.508217], datasetUri: 'https://europeandataportal.eu/set/data/c5f4ffbf-98ff-3dc4-95e0-67a9dab205a3'},
    {coordinates: [13.4652195, 52.58852], datasetUri: 'https://europeandataportal.eu/set/data/ce8fcc31-825c-4eb0-abab-4a40ab084670'},
    {coordinates: [13.3550005, 52.472137], datasetUri: 'https://europeandataportal.eu/set/data/f5540871-c129-4fa7-8ad8-afb01a3101ea'},
    {coordinates: [13.33988, 52.49772], datasetUri: 'https://europeandataportal.eu/set/data/54d008dd-3b2c-3af5-b190-60ac4646ad32'},
    {coordinates: [13.3367, 52.498585], datasetUri: 'https://europeandataportal.eu/set/data/fa40df94-1a8d-3e5d-9488-ba6f612842f7'}];
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
      longitude: 13,
      latitude: 52,
      zoom: 7,
      bearing: 0,
      pitch: 100,
      minZoom: 3,
      maxZoom: 100,
      layers: [
        new HexagonLayer({
          id: 'hexagon-layer',
          data: this.dummyData,
          pickable: true,
          extruded: true,
          radius: 1000,
          elevationScale: 100,
          getPosition: d => d.coordinates,
          // onHover: ({object}) => setTooltip(`${object.centroid.join(', ')}\nCount: ${object.points.length}`)
          onHover: this.updateTooltip
        })
      ]
    });
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
