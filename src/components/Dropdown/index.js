/**
 * @param filterName name of the filter, used as label for select
 * @param filterValues array of filter values used as options for select
 * @param onChangeFilter callback function called when there is change in filter
 * @param personsLoading status of the persons api call , if completed or not.Used for making the select disabled when request till fetch request is not completed
 * 
 * This is a functional componet which returns a selct field with label and options to be used as filter dropdown in FilterControls
 */
import React from 'react'

const Dropdown = ({ filterName, filterValues, onChangeFilter, personsLoading }) => {
    return (
        <div>
            <form className="form-group">
                <label className="form-control">{filterName}</label>
                <select 
                    className="custom-select form-control" 
                    disabled={personsLoading}
                    onChange={(event) => onChangeFilter(({
                    [filterName]: event.target.value
                }))}
                >
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