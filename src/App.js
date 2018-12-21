import React, { Component } from 'react';
import './App.css';
import PieChart from './components/Pie'
import { Bar } from 'react-chartjs-2'
import TableData from './components/TableData'
import Dropdown from './components/Dropdown'

class App extends Component {
  state = {
    genderData: {},
    relationData: {},
    persons: [],
    nextPage: 2,
    previousPage: null,
    totalPages: -1,
    filters: {},
    personsLoading: true
  }

  onPreviousPage = (page) => {
    const { persons, totalPages, nextPage, previousPage } = this.state
    const currentPage = {
      totalPages,
      nextPage,
      previousPage,
      data: persons
    }
    localStorage.setItem('NEXT_PAGE', JSON.stringify(currentPage))
    const cachedPreviousPage = JSON.parse(localStorage.getItem('PREVIOUS_PAGE'))
    if (cachedPreviousPage) {
      this.updateState(cachedPreviousPage)
      setTimeout(() => {
        if (this.state.previousPage !== -1) {
          this.cachePage('PREVIOUS_PAGE', this.state.previousPage)
        }
      }, 100)
    } else {
      this.setState({ personsLoading: true })
      this.fetchPersons(`http://localhost:5000/persons?page=${page}`)
    }
  }

  onNextPage = (page) => {
    const { persons, totalPages, nextPage, previousPage } = this.state
    const currentPage = {
      totalPages,
      nextPage,
      previousPage,
      data: persons
    }
    localStorage.setItem('PREVIOUS_PAGE', JSON.stringify(currentPage))
    const cachedNextPage = JSON.parse(localStorage.getItem('NEXT_PAGE'))
    if (cachedNextPage) {
      this.updateState(cachedNextPage)
      setTimeout(() => {
        if (this.state.nextPage !== -1) {
          this.cachePage('NEXT_PAGE', this.state.nextPage)
        }
      }, 100)
    } else {
      this.setState({ personsLoading: true })
      this.fetchPersons(`http://localhost:5000/persons?page=${page}`)
    }
  }

  onChangeFilter = filter => {
    localStorage.removeItem('NEXT_PAGE')
    localStorage.removeItem('PREVIOUS_PAGE')
    const filters = { ...this.state.filters, ...filter }
    this.setState({ filters })
    setTimeout(() => {
      this.fetchPersons('http://localhost:5000/persons?page=1')
      this.cachePage('NEXT_PAGE', 2)
    }, 100)
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

    this.fetchPersons(`http://localhost:5000/persons?page=1`)
    this.cachePage('NEXT_PAGE', 2)
  }

  fetchPersons = url => {
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(response => response.json())
      .then(this.updateState)
  }

  addFilters = url => {
    let newUrl = url
    Object.keys(this.state.filters)
      .forEach(key => {
        const value = this.state.filters[key]
        if (value !== 'All') {
          newUrl += `&${key.toLowerCase()}=${value}`
        }
      })
    return newUrl
  }

  updateState = result => {
    this.setState({ persons: result.data, personsLoading: false, totalPages: result.totalPages, nextPage: result.nextPage, previousPage: result.previousPage })
  }

  cachePage = (pageType, page) => {
    const url = `http://localhost:5000/persons?page=${page}`
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(response => response.json())
      .then(result => {
        if (pageType === 'NEXT_PAGE') {
          localStorage.setItem('NEXT_PAGE', JSON.stringify(result))
        } else {
          localStorage.setItem('PREVIOUS_PAGE', JSON.stringify(result))
        }
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
                onClick={() => this.onPreviousPage(this.state.previousPage)}
              >Previous</button>
            </div>
            <div className="col">
              <button
                className="btn btn-primary"
                disabled={this.state.nextPage === -1}
                onClick={() => this.onNextPage(this.state.nextPage)}
              >Next</button>
            </div>
          </div>
          <div className="row graph">
            <div className="col">
              <h4>
                Page No: {this.state.nextPage === -1 ? this.state.totalPages : this.state.nextPage - 1}
              </h4> 
            </div>
            <div className="col"> 
              <Dropdown filterName={"Sex"} filterValues={["Male", "Female"]} onChangeFilter={this.onChangeFilter} />
            </div>
            <div className="col"> 
              <Dropdown filterName={"Race"} filterValues={[ "White", "Asian-Pac-Islander", "Amer-Indian-Eskimo", "Other", "Black"]} onChangeFilter={this.onChangeFilter} />
            </div>
            <div className="col"> 
              <Dropdown filterName={"Relationship"} filterValues={['Wife', 'Own-child', 'Husband', 'Not-in-family', 'Other-relative', 'Unmarried']} onChangeFilter={this.onChangeFilter} />
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
                onClick={() => this.onPreviousPage(this.state.previousPage)}
              >Previous</button>
            </div>
            <div className="col">
              <button
                className="btn btn-primary"
                disabled={this.state.nextPage === -1}
                onClick={() => this.onNextPage(this.state.nextPage)}
              >Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
