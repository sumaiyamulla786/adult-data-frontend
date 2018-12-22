import React, { Component } from 'react';
import './App.css';
import PieChart from '../../components/Pie'
import { Bar } from 'react-chartjs-2'
import Table from '../../components/Table'
import NavigationButtons from '../../components/NavigationButtons'
import FilterControls from '../../components/FilterControls'

class App extends Component {
  state = {
    genderData: {},
    relationData: {},
    persons: [],
    nextPage: 2,
    previousPage: null,
    totalPages: -1,
    filters: {},
    fetchCountFailed: false,
    fetchPersonsFailed: false,
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
      .catch(() => {
        const fetchCountFailed = true
        this.setState({ fetchCountFailed })
      })

    this.fetchPersons(`http://localhost:5000/persons?page=1`)
    this.cachePage('NEXT_PAGE', 2)
  }

  fetchPersons = url => {
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(response => response.json())
      .then(this.updateState)
      .catch(() => {
        const fetchPersonsFailed = true
        this.setState({ fetchPersonsFailed })
      })
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
              {!this.state.fetchCountFailed && <PieChart data={this.state.genderData} />}
              {this.state.fetchCountFailed && <h3 className="error">Something went wrong with fetching chart data,please refresh and try again</h3>}
            </div>
          </div>
          <div className="row graph">
            <div className="col">
              {!this.state.fetchCountFailed && <Bar data={this.state.relationData} />}
            </div>
          </div>
          {
            !this.state.fetchPersonsFailed &&
            <NavigationButtons
              nextPage={this.state.nextPage}
              previousPage={this.state.previousPage}
              onNextPage={this.onNextPage}
              onPreviousPage={this.onPreviousPage}
            />
          }
          {
            !this.state.fetchPersonsFailed &&
            <FilterControls
              nextPage={this.state.nextPage}
              totalPages={this.state.totalPages}
              onChangeFilter={this.onChangeFilter}
            />
          }
        </div>
        <div className="container-fluid">
          <div className="row graph">
            <Table
              personsLoading={this.state.personsLoading}
              persons={this.state.persons}
              fetchPersonsFailed={this.state.fetchPersonsFailed}
            />
          </div>
        </div>
        <div className="container">
          {
            !this.state.fetchPersonsFailed &&
            <NavigationButtons
              nextPage={this.state.nextPage}
              previousPage={this.state.previousPage}
              onNextPage={this.onNextPage}
              onPreviousPage={this.onPreviousPage}
            />
          }
        </div>
      </div>
    );
  }
}

export default App;
