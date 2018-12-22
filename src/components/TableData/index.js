/**
 * @param person a single document from the adult data collection to be displayed as a table row
 * 
 * This component populates a table row with each key of person object as table data and returns it to the Table component
 */
import React from 'react'

const TableData = ({ person }) => {
    const personFields = ['age', 'workclass', 'fnlwgt', 'education', 'education_num', 'marital_status', 'occupation', 'relationship', 'race', 'sex', 'capital_gain', 'capital_loss', 'hours_per_week', 'native_country']
    return (
        <tr key={person._id["$oid"]}>
            { personFields.map((field, index) => (<td key={index}>{ person[field] }</td>)) }
        </tr>
    )
}

export default TableData