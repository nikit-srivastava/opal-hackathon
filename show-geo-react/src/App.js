import React, {Component} from 'react';
import {render} from 'react-dom';
import './App.css';
import MapComp from "./map/map-comp";
import hourglass_img from './data/hourglass.gif';
export default class App extends Component {

    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            show_hourglass : false
        };
    }

    clickFn() {
        // refresh the cache
    }

    refreshCache = () => {
        this.setState({ show_hourglass: true });
        console.log('refresh cache called');
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            this.refreshData();
            this.setState({ show_hourglass: false });
        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://localhost:8080/refresh-cache')
        // send the request
        xhr.send();
    }

    refreshData = () =>
        this.setState({refreshData: !this.state.refreshData})
    render() {
        return (
            <div className={"wrapper"}>
                <div className={"map-container"}>
                    <div className={"map-box"}>
                        <div id={"map-div"}><MapComp ref={this.child} refresh={this.state.refreshData}/></div>
                    </div>
                </div>
                <div className={"button-container"}>
                    <div className={"button-box"}>
                        <button type={"button"} onClick={this.refreshCache}>Refresh Cache</button>
                        {this.state.show_hourglass
                            ? <img src={hourglass_img} className={'hourglass'}/>
                            : <br/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export function renderToDOM(container) {
    render(<App />, container);
}
