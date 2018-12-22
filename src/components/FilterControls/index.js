/**
 * @param onChangeFilter this is a callback function to be called when there is a change in value of Dropdown component, passed as param to dropdown
 * @param personsLoading this is the status of persons api call, passed as a prop to Dropdown component
 * This functional component returns the Dropdowns which all of which represent a filter condition, used for providing the functionality of filtering based on certain criterion
 */
import React from 'react'
import Dropdown from '../Dropdown'

const FilterControls = ({ onChangeFilter, personsLoading }) => (
    <div className="row graph">
        <div className="col">
            <Dropdown
                filterName={"Sex"}
                filterValues={["Male", "Female"]}
                onChangeFilter={onChangeFilter}
                personsLoading={personsLoading}
            />
        </div>
        <div className="col">
            <Dropdown
                filterName={"Race"}
                filterValues={["White", "Asian-Pac-Islander", "Amer-Indian-Eskimo", "Other", "Black"]}
                onChangeFilter={onChangeFilter}
                personsLoading={personsLoading}
            />
        </div>
        <div className="col">
            <Dropdown 
                filterName={"Relationship"} 
                filterValues={['Wife', 'Own-child', 'Husband', 'Not-in-family', 'Other-relative', 'Unmarried']} 
                onChangeFilter={onChangeFilter} 
                personsLoading={personsLoading}
            />
        </div>
    </div>
)

export default FilterControls