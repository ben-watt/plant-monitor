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
  humidity: parseInt(reading.humidity.toFixed(0)),
  temperature: parseInt(reading.temperature.toFixed(0)),
  voltage: reading.voltage.toString() ?? "Unknown"
})

const toggleClass = (element, className) => {
  if(!element.classList.contains(className)) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

const highestValue = (value1, value2) => {
  return value1 > value2 ? value1 : value2;
}

const lowestValue = (value1, value2) => {
  return value1 < value2 ? value1 : value2;
}

class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      lastReading: {
        date: new Date(),
        humidity: "--",
        temperature: "--"
      },
      totalHighestTemperature: Number.MIN_SAFE_INTEGER,
      totalHighestHumidity: Number.MIN_SAFE_INTEGER,
      totalMinimumTemperature: Number.MAX_SAFE_INTEGER,
      totalMinimumHumidity: Number.MAX_SAFE_INTEGER,
      history: {}
    }
  }

  componentDidMount() {
    var db = firebase.database();
    var data = db.ref("greenhouse/data").limitToLast(1);

    data.on('child_added', function(d) {
      var reading = d.val();
      this.setState({ lastReading : parseReading(reading)})
    }.bind(this));

    var data = db.ref("greenhouse/data").limitToLast(100);

    data.on('child_added', function(d) {
      var reading = d.val();
      var parsedReading = parseReading(reading);
      var dateKey = parsedReading.date.toISOString().substring(0,10);

      this.setState(prevState => {
        if(prevState.history[dateKey] != null) {
          prevState.history[dateKey] = {
            maxTemperature: highestValue(parsedReading.temperature, prevState.history[dateKey].maxTemperature),
            minTemperature: lowestValue(parsedReading.temperature, prevState.history[dateKey].minTemperature),
            maxHumidity: highestValue(parsedReading.humidity, prevState.history[dateKey].maxHumidity),
            minHumidity: lowestValue(parsedReading.humidity, prevState.history[dateKey].minHumidity),
            readings: prevState.history[dateKey].readings.concat(parsedReading)
          }
        } else {
          prevState.history[dateKey] = {
            maxTemperature: parsedReading.temperature,
            minTemperature: parsedReading.temperature,
            maxHumidity: parsedReading.humidity,
            minHumidity: parsedReading.humidity,
            readings: [parsedReading]
          };
        }

        return {
          ...prevState,
          totalHighestTemperature: highestValue(prevState.totalHighestTemperature, parsedReading.temperature),
          totalHighestHumidity: highestValue(prevState.totalHighestHumidity, parsedReading.humidity),
          totalMinimumTemperature: lowestValue(prevState.totalMinimumTemperature, parsedReading.temperature),
          totalMinimumHumidity: lowestValue(prevState.totalMinimumHumidity, parsedReading.humidity),
          history: prevState.history
        }
      })
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

  getTemperatureHeader() {
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

  getTemperatureHistory() {
    let history = []
    for(var dateGroup in this.state.history) {
      let value = this.state.history[dateGroup];

      history.push(<History key={dateGroup.toString()} 
        min={value.minTemperature} max={value.maxTemperature} readings={value.readings} />)
    }

    return history;
  }

  normaliseDataZeroToOneHundred(value, min, max) {
    return 0 + ((value - max) * (100 - 0) / (max - min))
  }

  getHumidityHistory() {
    let history = []

    console.log(this.normaliseDataZeroToOneHundred(
      34, this.state.totalMinimumTemperature, this.state.totalHighestTemperature))

    for(var dateGroup in this.state.history) {
      let value = this.state.history[dateGroup];
      history.push(
        <History key={dateGroup.toString()} min={value.minHumidity} max={value.maxHumidity} 
          readings={value.readings} />)
    }



    return history;
  }
  
  render() {
    return (
      <div id="app">
        <PageContainer>
            <Page>
              { this.getTemperatureHeader() }
              <section id="history">
                { this.getTemperatureHistory() }
              </section>
            </Page>
            <Page>
              <Header 
                leftColour="#1FD7FF"
                rightColour="#EBECED"
                value={this.state.lastReading.humidity}
                suffex={"%"}
                date={formatDistance(this.state.lastReading.date, new Date())} 
                image={"./water.svg"} />
                <section id="history">
                  { this.getHumidityHistory() }
                </section>
            </Page>
        </PageContainer>
      </div>
    );
  }
}

export default App;
