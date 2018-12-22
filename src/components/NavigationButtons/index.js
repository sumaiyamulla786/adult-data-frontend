import React from 'react'

const NavigationButtons = ({ previousPage, nextPage, onPreviousPage, onNextPage }) => (
    <div className="row graph">
        <div className="col">
            <button
                className="btn btn-primary"
                disabled={previousPage === -1}
                onClick={() => onPreviousPage(previousPage)}
            >Previous</button>
        </div>
        <div className="col">
            <button
                className="btn btn-primary"
                disabled={nextPage === -1}
                onClick={() => onNextPage(nextPage)}
            >Next</button>
        </div>
    </div>
)

export default NavigationButtons