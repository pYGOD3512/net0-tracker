import React, { Component } from 'react';
import Chart from "react-apexcharts";
import { COLORS } from 'constants/ChartConstant';
import Card from 'components/shared-components/Card';
import { Select } from 'antd';
import { energyemissions as defaultEnergyEmissions } from '../../../views/app-views/dashboards/default/DefaultDashboardData';
import { useDataContext } from '../../../context/DataContext'; // Import context

const { Option } = Select;

class Pie extends Component {
	constructor(props) {
		super(props);
		const initialData = props.uploadedData || defaultEnergyEmissions;
		// Filter out any years where all values except 'Year' are empty or zero
		const filteredData = this.filterValidData(initialData);
		const firstYearData = filteredData[0] || {}; // Use an empty object if no valid data is found
		const labels = this.getLabels(firstYearData);

		this.state = {
			selectedYear: firstYearData.Year, // Default to the first valid year in the data
			series: this.getSeriesData(firstYearData, labels),
			options: {
				colors: props.colors || COLORS,
				labels,
				plotOptions: {
					pie: {
						donut: {
							size: '50%', // Adjust the size of the donut hole
						},
					},
				},
				responsive: [{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}]
			}
		};
	}

	componentDidUpdate(prevProps) {
		// Only update if the uploadedData prop has changed
		if (prevProps.uploadedData !== this.props.uploadedData) {
			this.updateData(this.props.uploadedData || defaultEnergyEmissions);
		}
	}

	updateData = (data) => {
		if (!data || data.length === 0) {
			return; // Handle the case where no data is available
		}

		const filteredData = this.filterValidData(data);
		const firstYearData = filteredData[0] || {}; // Use an empty object if no valid data is found
		const labels = this.getLabels(firstYearData);

		this.setState({
			selectedYear: firstYearData.Year,
			series: this.getSeriesData(firstYearData, labels),
			options: {
				...this.state.options,
				labels,
			}
		});
	}

	handleYearChange = (year) => {
		const selectedData = (this.props.uploadedData || defaultEnergyEmissions).find(item => item.Year === year);
		if (selectedData) {
			const labels = this.getLabels(selectedData);
			this.setState({
				selectedYear: year,
				series: this.getSeriesData(selectedData, labels),
				options: {
					...this.state.options,
					labels,
				}
			});
		}
	}

	// Method to filter out years with empty data
	filterValidData = (data) => {
		return data.filter(item => {
			// Check if there is at least one non-zero and non-null value in the year's data
			return Object.keys(item).some(key => !['Year', 'MitigationEmissions', 'EnergySector'].includes(key) && parseFloat(item[key]) > 0);
		});
	}

	getLabels = (data) => {
		if (!data) return [];
		// Filter out 'Year', 'MitigationEmissions', and 'EnergySector' to get the labels
		return Object.keys(data).filter(key => !['Year', 'MitigationEmissions', 'EnergySector'].includes(key));
	}

	getSeriesData = (data, labels) => {
		if (!data) return [];
		// Map the labels to their corresponding values in the data
		return labels.map(label => parseFloat(data[label] || 0));
	}

	render() {
		const { height, subtitle } = this.props;
		const years = this.filterValidData(this.props.uploadedData || defaultEnergyEmissions).map(item => item.Year);
	
		return (
			<Card>
				{subtitle && <span className="font-size-sm font-weight-bold">{subtitle}</span>}
				<Chart
					options={this.state.options}
					series={this.state.series}
					height={height || '400px'} // Provide a fallback height
					type="donut"
				/>
				<Select
					value={this.state.selectedYear}
					onChange={this.handleYearChange}
					style={{ width: '25%', height: '2rem' }}
				>
					{years.map(year => (
						<Option key={year} value={year}>{year}</Option>
					))}
				</Select>
			</Card>
		);
	}

}

// Create a wrapper to use the context
const PieWithContext = (props) => {
	const { uploadedData } = useDataContext(); // Use context to get uploaded data

	// Transform the uploaded data into the format needed for the chart
	const transformedData = uploadedData?.data.map(row => ({
		Year: row.Year,
		...row, // Spread additional data which includes any additional columns
	})) || null;

	return <Pie {...props} uploadedData={transformedData} />;
}

export default PieWithContext;
