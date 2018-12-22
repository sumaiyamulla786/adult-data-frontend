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

  /**
   * @param url initial url to add filter query string to
   * 
   * This function takes a url and then scans the filter object in state , append each key whose value is not equal to 'All' as filter to the query string, then returns the updated url.
   */
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

  /**
   * @param result the object containing values to set the state with
   * 
   * This function updates the state values relating to the persons data and pagination
   */
  updatePersonState = result => {
    this.setState({ persons: result.data, personsLoading: false, totalPages: result.totalPages, nextPage: result.nextPage, previousPage: result.previousPage })
  }

  /**
   * @param response response from an api call
   * 
   * Handles scenarios where response contains error response codes other than 200
   */
  handleErrorResponse = response => {
    if (response.status !== 200) {
      throw new Error()
    } else {
      return response.json()
    }
  }

  /**
   * @param url url to fetch data from
   * 
   * This function fetches the fitered as well as normal persons data using the url and then updates the related state values in the component using the updatePersonState function
   */
  fetchPersons = url => {
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(this.handleErrorResponse)
      .then(this.updatePersonState)
      .catch(() => {
        const fetchPersonsFailed = true
        this.setState({ fetchPersonsFailed })
      })
  }

  /**
   * @param pageType type of page to cache next or previous
   * @param page number of the page to fetch and cache
   * 
   * This function fetches the next or previous page depending on params and then caches it to improve performance of the app as well as improve user experience
   */
  cachePage = (pageType, page) => {
    const url = `${apiUrl}/persons?page=${page}`
    const filterUrl = this.addFilters(url)
    fetch(filterUrl)
      .then(this.handleErrorResponse)
      .then(result => {
        if (result.data && result.data.length) {
          if (pageType === STORAGE_KEYS.NEXT_PAGE) {
            sessionStorage.setItem(STORAGE_KEYS.NEXT_PAGE, JSON.stringify(result))
          } else {
            sessionStorage.setItem(STORAGE_KEYS.PREVIOUS_PAGE, JSON.stringify(result))
          }
        }
      })
      .catch(() => { })
  }

  /**
   * @param page page number of previous page
   * 
   * This function caches the current page as next page , pulls out the previous page from cache or fetches and caches it if not present, then updates the state with previous page's data.This function is passed as callback to NavigationButtons component
   */
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
      this.updatePersonState(cachedPreviousPage)
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

  /**
  * @param page page number of previous page
  * 
  * This function caches the current page as previous page , pulls out the next page from cache or fetches and caches it if not present, then updates the state with next page's data.This function is passed as callback to NavigationButtons component
  */
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
      this.updatePersonState(cachedNextPage)
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

  /**
   * @param filter filter data selected by user in FilterControls component
   * 
   * This function invalidates the cached data, and updates the filter object in the state, it then refectches the person data using fetchPersons function and caches the nextPage with this filter using the cachePage function
   */
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

  /**
   * @param result resulting json from getCount api call
   * 
   * takes the response from getCount api and sets the genderData and relationData in state
   */
  setCountState = result => {
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
  }

  /**
   * fetching the intial data from api for populating the bar graph and pie chart , as well as to populate the persons table, as well as cache the next page using cachePage function
   */
  componentDidMount() {
    fetch(`${apiUrl}/getCount`)
      .then(this.handleErrorResponse)
      .then(this.setCountState)
      .catch(() => {
        const fetchCountFailed = true
        this.setState({ fetchCountFailed })
      })

    this.fetchPersons(`${apiUrl}/persons?page=1`)
    this.cachePage(STORAGE_KEYS.NEXT_PAGE, 2)
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
            this.state.persons.length !== 0 &&
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
