import React, { Component } from 'react';
import './App.css';
import PieChart from './components/Pie'
import { Bar } from 'react-chartjs-2'
import TableData from './components/TableData'

class App extends Component {
  state = {
    genderData: {},
    relationData: {},
    persons: [],
    nextPage: 2,
    previousPage: null,
    personsLoading: true
  }

  onPageChange = (page) => {
    this.setState({ personsLoading: true })
    fetch(`http://localhost:5000/persons?page=${page}`)
      .then(response => response.json())
      .then(result => {
        this.setState({ persons: result.data, personsLoading: false, totalPages: result.totalPages, nextPage: result.nextPage, previousPage: result.previousPage })
        console.log(this.state)
      })

  }

  componentDidMount() {
    fetch('http://localhost:5000/getCount')
      .then(response => response.json())
      .then(result => {
        const genderData = {
          labels: [
            'Male',
            'Female'
          ],
          datasets: [{
            data: [result.totalMales, result.totalFemales],
            backgroundColor: [
              '#FF6384',
              '#36A2EB'
            ]
          }]
        }
        const relationData = {
          labels: ['Wife', 'Own-child', 'Husband', 'Not-in-family', 'Other-relative', 'Unmarried'],
          datasets: [
            {
              label: 'Relationship Distribution',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: [result.totalWifes, result.totalOwnChilds, result.totalHusbands, result.totalNotInFamilys, result.totalOtherRelatives, result.totalUnmarrieds]
            }
          ]
        }
        this.setState({ genderData, relationData })
      })

    fetch(`http://localhost:5000/persons?page=1`)
      .then(response => response.json())
      .then(result => {
        this.setState({ persons: result.data, personsLoading: false, totalPages: result.totalPages, nextPage: result.nextPage, previousPage: result.previousPage })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="titleBar"><h1>Adult Data Visualizer</h1></div>
        <div className="container">
          <div className="row graph">
            <div className="col">
              <PieChart data={this.state.genderData} />
            </div>
          </div>
          <div className="row graph">
            <div className="col">
              <Bar data={this.state.relationData} />
            </div>
          </div>
          <div className="row graph">
            <div className="col">
              <button
                className="btn btn-primary"
                disabled={this.state.previousPage === -1}
                onClick={() => this.onPageChange(this.state.previousPage)}
              >Previous</button>
            </div>
            <div className="col">
              <button 
                className="btn btn-primary" 
                disabled={this.state.nextPage === -1}
                onClick={() => this.onPageChange(this.state.nextPage)}
              >Next</button>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row graph">
            <div className="col">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Age</th>
                    <th scope="col">Workclass</th>
                    <th scope="col">Fnlwgt</th>
                    <th scope="col">Education</th>
                    <th scope="col">Education Num</th>
                    <th scope="col">Marital Status</th>
                    <th scope="col">Occupation</th>
                    <th scope="col">Relationship</th>
                    <th scope="col">Race</th>
                    <th scope="col">Sex</th>
                    <th scope="col">Capital Gain</th>
                    <th scope="col">Capital Loss</th>
                    <th scope="col">Hours Per Week</th>
                    <th scope="col">Native Country</th>
                  </tr>
                </thead>
                <tbody>
                  {!this.state.personsLoading && this.state.persons.map(person => (<TableData person={person} key={person._id["$oid"]} />))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row graph">
            <div className="col">
              <button
                className="btn btn-primary"
                disabled={this.state.previousPage === -1}
                onClick={() => this.onPageChange(this.state.previousPage)}
              >Previous</button>
            </div>
            <div className="col">
              <button 
                className="btn btn-primary" 
                disabled={this.state.nextPage === -1}
                onClick={() => this.onPageChange(this.state.nextPage)}
              >Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
