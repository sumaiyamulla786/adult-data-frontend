import React from 'react'
import TableData from '../TableData'

const Table = ({ personsLoading, persons, fetchPersonsFailed }) => (
    <div className="col">
        {
            !fetchPersonsFailed &&
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
        { fetchPersonsFailed && <h3 className="error">Fetching Persons Data Failed, Please refresh and try again</h3> }
    </div>
)

export default Table