import React, { Component } from 'react';
import './App.css';
import PieChart from '../../components/Pie'
import { Bar } from 'react-chartjs-2'
import Table from '../../components/Table'
import NavigationButtons from '../../components/NavigationButtons'
import FilterControls from '../../components/FilterControls'
import STORAGE_KEYS from '../../helper/storage.constants'
import { apiUrl } from '../../config'

class App extends Component {
  state = {
    genderData: {},
    relationData: {},
    persons: [],
    nextPage: -1,
    previousPage: -1,
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
    sessionStorage.setItem(STORAGE_KEYS.NEXT_PAGE, JSON.stringify(currentPage))
    const cachedPreviousPage = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.PREVIOUS_PAGE))
    if (cachedPreviousPage) {
      this.updateState(cachedPreviousPage)
      setTimeout(() => {
        if (this.state.previousPage !== -1) {
          this.cachePage(STORAGE_KEYS.PREVIOUS_PAGE, this.state.previousPage)
        }
      }, 100)
    } else {
      this.fetchPersons(`${apiUrl}/persons?page=${page}`)
      if (page > 1) {
        this.cachePage(STORAGE_KEYS.PREVIOUS_PAGE, (page - 1))
      }
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
    sessionStorage.setItem(STORAGE_KEYS.PREVIOUS_PAGE, JSON.stringify(currentPage))
    const cachedNextPage = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.NEXT_PAGE))
    if (cachedNextPage) {
      this.updateState(cachedNextPage)
      setTimeout(() => {
        if (this.state.nextPage !== -1) {
          this.cachePage(STORAGE_KEYS.NEXT_PAGE, this.state.nextPage)
        }
      }, 10)
    } else {
      this.fetchPersons(`${apiUrl}/persons?page=${page}`)
      if (page < this.state.totalPages) {
        this.cachePage(STORAGE_KEYS.NEXT_PAGE, (page + 1))
      }
    }
  }

  onChangeFilter = filter => {
    sessionStorage.removeItem(STORAGE_KEYS.NEXT_PAGE)
    sessionStorage.removeItem(STORAGE_KEYS.PREVIOUS_PAGE)
    const filters = { ...this.state.filters, ...filter }
    this.setState({ filters })
    setTimeout(() => {
      this.fetchPersons(`${apiUrl}/persons?page=1`)
      this.cachePage(STORAGE_KEYS.NEXT_PAGE, 2)
    }, 100)
  }

  componentDidMount() {
    fetch(`${apiUrl}/getCount`)
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

    this.fetchPersons(`${apiUrl}/persons?page=1`)
    this.cachePage(STORAGE_KEYS.NEXT_PAGE, 2)
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
    const url = `${apiUrl}/persons?page=${page}`
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(response => response.json())
      .then(result => {
        if (result.data && result.data.length) {
          if (pageType === STORAGE_KEYS.NEXT_PAGE) {
            sessionStorage.setItem(STORAGE_KEYS.NEXT_PAGE, JSON.stringify(result))
          } else {
            sessionStorage.setItem(STORAGE_KEYS.PREVIOUS_PAGE, JSON.stringify(result))
          }
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
              totalPages={this.state.totalPages}
            />
          }
          {
            !this.state.fetchPersonsFailed &&
            <FilterControls
              onChangeFilter={this.onChangeFilter}
              personsLoading={this.state.personsLoading}
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
            !this.state.personsLoading &&
            this.state.persons.length &&
            <NavigationButtons
              nextPage={this.state.nextPage}
              previousPage={this.state.previousPage}
              onNextPage={this.onNextPage}
              onPreviousPage={this.onPreviousPage}
              totalPages={this.state.totalPages}
            />
          }
        </div>
      </div>
    );
  }
}

export default App;
