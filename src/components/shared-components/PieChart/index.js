import React, { Component } from 'react'
import Chart from "react-apexcharts";
import { COLORS} from 'constants/ChartConstant';
import Card from 'components/shared-components/Card';
import { Select } from 'antd';
import { energyemissions } from '../../../views/app-views/dashboards/default/DefaultDashboardData';

const { Option } = Select;

class Pie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedYear: energyemissions[0]?.Year || 2000, // Default to the first year
			series: this.getSeriesData(energyemissions[0]),
			options: {
				colors: props.colors || COLORS,
				labels: props.labels || ['Power sector/GWh', 'Thermal/GWh', 'Renewable/GWh', 'Hydro/GWh'],
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

	handleYearChange = (year) => {
		const selectedData = energyemissions.find(item => item.Year === year);
		this.setState({
			selectedYear: year,
			series: this.getSeriesData(selectedData)
		});
	}

	getSeriesData = (data) => {
		return [
			data['Power sector/GWh'],
			data['Thermal/GWh'],
			data['Renewable/GWh'],
			data['Hydro/GWh']
		];
	}

	render() {
		const { height, subtitle } = this.props;
		const years = energyemissions.map(item => item.Year);

		return (
			<Card>
				{subtitle && <span className="font-size-sm font-weight-bold">{subtitle}</span>}
				<Chart
					options={this.state.options}
					series={this.state.series}
					height={height || 300}
					type="pie"
				/>
				<Select 
					defaultValue={this.state.selectedYear}
					onChange={this.handleYearChange}
					style={{ width: '30%', height: '1%' }}
				>
					{years.map(year => (
						<Option key={year} value={year}>{year}</Option>
					))}
				</Select>
			</Card>
		);
	}
}

export default Pie;