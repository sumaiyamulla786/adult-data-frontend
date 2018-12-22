/**
 * @param data properties based on which the pie chart is constructed
 * 
 * This is a wrapper for chartjs doughnut component so that it can be labelled as PieChart
 */
import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const PieChart = ({ data }) => (
    <Doughnut 
        data={data}
    />
)

export default PieChart