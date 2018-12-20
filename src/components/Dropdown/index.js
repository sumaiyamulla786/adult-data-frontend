import React from 'react'

const Dropdown = ({ filterName, filterValues, onChangeFilter }) => {
    return (
        <div>
            <form className="form-group">
                <label className="form-control">{filterName}</label>
                <select className="custom-select form-control" onChange={(event) => onChangeFilter(({
                    [filterName]: event.target.value
                }))}>
                    <option>All</option>
                    {filterValues.map((value, index) => (
                        <option value={value} key={index}>{value}</option>
                    ))}
                </select>
            </form>
        </div>
    )
}

export default Dropdown