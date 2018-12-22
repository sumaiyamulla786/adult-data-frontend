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