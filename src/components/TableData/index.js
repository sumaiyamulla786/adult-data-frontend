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