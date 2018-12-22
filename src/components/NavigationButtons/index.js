/**
 * @param previousPage previous page of persons in the server
 * @param nextPage next page of persons in the server
 * @param onPreviousPage callback function to be called when previous button is clicked
 * @param onNextPage callback function to be called when previous button is clicked
 * 
 * This component contains the buttons for fetching the next and previous pages for adult data, as well as displays the number for currently displayed page
 */
import React from 'react'

const NavigationButtons = ({ previousPage, nextPage, onPreviousPage, onNextPage, totalPages }) => (
    <div className="row graph">
        <div className="col">
            <button
                className="btn btn-primary"
                disabled={previousPage === -1}
                onClick={() => onPreviousPage(previousPage)}
            >Previous</button>
        </div>
        <div className="col text-center">
            <h4>
                {totalPages === -1 ? '' : (nextPage === -1 ? totalPages : nextPage - 1)} / {totalPages}
            </h4>
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