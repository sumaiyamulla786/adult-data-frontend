import React from 'react'
import Dropdown from '../Dropdown'

const FilterControls = ({ nextPage, totalPages, onChangeFilter }) => (
    <div className="row graph">
        <div className="col">
            <h4>
                Page No: {nextPage === -1 ? totalPages : nextPage - 1}
            </h4>
        </div>
        <div className="col">
            <Dropdown filterName={"Sex"} filterValues={["Male", "Female"]} onChangeFilter={onChangeFilter} />
        </div>
        <div className="col">
            <Dropdown filterName={"Race"} filterValues={["White", "Asian-Pac-Islander", "Amer-Indian-Eskimo", "Other", "Black"]} onChangeFilter={onChangeFilter} />
        </div>
        <div className="col">
            <Dropdown filterName={"Relationship"} filterValues={['Wife', 'Own-child', 'Husband', 'Not-in-family', 'Other-relative', 'Unmarried']} onChangeFilter={onChangeFilter} />
        </div>
    </div>
)

export default FilterControls