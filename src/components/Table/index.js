/**
 * @param personsLoading status of person api call, used to hide the table when the api call is not finished
 * @param persons array of adult data returned from backend to be displayed as table data
 * @param fetchPersonsFailed flag which represents that the persons api call is failed , used to display error message in case of failure
 * 
 * This component is wrapper for HTML table , this is used for generating the table headers as well as populating the adult data as table rows using the TableData component, it returns the complete table node with adult data
 */
import React from 'react'
import TableData from '../TableData'

const Table = ({ personsLoading, persons, fetchPersonsFailed }) => (
    <div className="col">
        {
            !fetchPersonsFailed &&
            !personsLoading &&
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
                    {!personsLoading && persons.map(person => (<TableData person={person} key={person._id["$oid"]} />))}
                </tbody>
            </table>
        }
        { personsLoading && !fetchPersonsFailed && <h4 className="loading">Loading...</h4> }
        { fetchPersonsFailed && <h3 className="error">Fetching Persons Data Failed, Please refresh and try again</h3> }
    </div>
)

export default Table