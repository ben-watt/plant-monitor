import React from 'react';
import './App.css';
import firebase from './Firebase.js';
import Chart from 'chart.js';
import Page from './Page';
import Header from './Header';
import History from './History';
import PageContainer from './PageContainer';
import { formatDistance, getHours } from 'date-fns'

const parseReading = (reading) =>  ({
  date: new Date(reading.epoch_time * 1000),
  humidity: reading.humidity.toFixed(0),
  temperature: reading.temperature.toFixed(0),
  voltage: reading.voltage.toString() ?? "Unknown"
})

const toggleClass = (element, className) => {
  if(!element.classList.contains(className)) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      lastReading: {
        date: new Date(),
        humidity: "--",
        temperature: "--"
      }
    }
  }

  componentDidMount() {
    var db = firebase.database();
    var data = db.ref("greenhouse/data").limitToLast(1);

    data.on('child_added', function(d) {
      var reading = d.val();
      this.setState({ lastReading : parseReading(reading)})
    }.bind(this));
  }

  drawChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            data: [10, 20, 30, 40, 50, 60]
          }],
          labels: ['January', 'February', 'March', 'April', 'May', 'June']
        }
    });
  }

  getTemperature() {
    var date = new Date();
    var hours = getHours(date);
    if(hours > 19 || hours < 5) {
      return <Header 
        leftColour="#0D38D1"
        rightColour="#701872"
        value={this.state.lastReading.temperature} 
        suffex={"°C"}
        date={formatDistance(this.state.lastReading.date, new Date())} 
        image={"./camping-tent.svg"}
        bottom />
    } else {
      return <Header 
        leftColour="#D1190D"
        rightColour="#F6C821"
        value={this.state.lastReading.temperature} 
        suffex={"°C"}
        date={formatDistance(this.state.lastReading.date, new Date())} 
        image={"./beach.svg"}
        bottom />
    }
  }
  
  render() {
    return (
      <div id="app">
        <PageContainer>
            <Page>
              {this.getTemperature()}
              <History />
            </Page>
            <Page>
              <Header 
                leftColour="#1FD7FF"
                rightColour="#EBECED"
                value={this.state.lastReading.humidity}
                suffex={"%"}
                date={formatDistance(this.state.lastReading.date, new Date())} 
                image={"./water.svg"} />
              <History />
            </Page>
        </PageContainer>
      </div>
    );
  }
}

export default App;
