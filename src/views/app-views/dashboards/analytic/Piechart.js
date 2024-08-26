import React, { useState } from "react";
import Chart from "react-apexcharts";

import { Select } from 'antd';

// Ant Design Select
const { Option } = Select;


// Full dataset
const data = {
    "2019": {
      "Power sector": 80000,
      "Refinery": 310000,
      "Manufacturing of solid fuels": 1700000,
      "Oil rigs": 780000,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2020": {
      "Power sector": 80000,
      "Refinery": 350000,
      "Manufacturing of solid fuels": 1790000,
      "Oil rigs": 570000,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2021": {
      "Power sector": 90000,
      "Refinery": 430000,
      "Manufacturing of solid fuels": 3510000,
      "Oil rigs": 580000,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2022": {
      "Power sector": 180000,
      "Refinery": 90000,
      "Manufacturing of solid fuels": 410000,
      "Oil rigs": 3520000,
      "Manufacturing and construction": 600000,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2023": {
      "Power sector": 226000,
      "Refinery": 100000,
      "Manufacturing of solid fuels": 400000,
      "Oil rigs": 3520000,
      "Manufacturing and construction": 770000,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2024": {
      "Power sector": 155000,
      "Refinery": 65330,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 490000,
      "Manufacturing and construction": 2300000,
      "Transport": 760000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2025": {
      "Power sector": 16000,
      "Refinery": 72810,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 510000,
      "Manufacturing and construction": 2080000,
      "Transport": 1010000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2026": {
      "Power sector": 117000,
      "Refinery": 1420,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 670000,
      "Manufacturing and construction": 2770000,
      "Transport": 1110000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2027": {
      "Power sector": 1521000,
      "Refinery": 39870,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 580000,
      "Manufacturing and construction": 2810000,
      "Transport": 1330000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2028": {
      "Power sector": 1072000,
      "Refinery": 81490,
      "Manufacturing of solid fuels": 110000,
      "Oil rigs": 590000,
      "Manufacturing and construction": 2520000,
      "Transport": 1120000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2029": {
      "Power sector": 490000,
      "Refinery": 66920,
      "Manufacturing of solid fuels": 40000,
      "Oil rigs": 290000,
      "Manufacturing and construction": 2330000,
      "Transport": 870000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2030": {
      "Power sector": 820000,
      "Refinery": 60240,
      "Manufacturing of solid fuels": 40000,
      "Oil rigs": 330000,
      "Manufacturing and construction": 2390000,
      "Transport": 630000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2031": {
      "Power sector": 1310000,
      "Refinery": 107940,
      "Manufacturing of solid fuels": 40000,
      "Oil rigs": 340000,
      "Manufacturing and construction": 2430000,
      "Transport": 630000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2032": {
      "Power sector": 1140000,
      "Refinery": 183250,
      "Manufacturing of solid fuels": 40000,
      "Oil rigs": 700000,
      "Manufacturing and construction": 2190000,
      "Transport": 630000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2033": {
      "Power sector": 490000,
      "Refinery": 211410,
      "Manufacturing of solid fuels": 50000,
      "Oil rigs": 450000,
      "Manufacturing and construction": 2680000,
      "Transport": 790000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2034": {
      "Power sector": 750000,
      "Refinery": 211370,
      "Manufacturing of solid fuels": 80000,
      "Oil rigs": 540000,
      "Manufacturing and construction": 3150000,
      "Transport": 790000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2035": {
      "Power sector": 1610000,
      "Refinery": 103840,
      "Manufacturing of solid fuels": 80000,
      "Oil rigs": 710000,
      "Manufacturing and construction": 3080000,
      "Transport": 940000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2036": {
      "Power sector": 1870000,
      "Refinery": 214740,
      "Manufacturing of solid fuels": 90000,
      "Oil rigs": 810000,
      "Manufacturing and construction": 3540000,
      "Transport": 1210000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2037": {
      "Power sector": 1320000,
      "Refinery": 187480,
      "Manufacturing of solid fuels": 90000,
      "Oil rigs": 550000,
      "Manufacturing and construction": 3150000,
      "Transport": 580000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2038": {
      "Power sector": 1280000,
      "Refinery": 56960,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 330000,
      "Manufacturing and construction": 3780000,
      "Transport": 950000,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2039": {
      "Power sector": 1850000,
      "Refinery": 141870,
      "Manufacturing of solid fuels": 110000,
      "Oil rigs": 1060000,
      "Manufacturing and construction": 5940000,
      "Transport": 950000,
      "Other sectors": 0,
      "Oil and Gas companies": 1990000,
    },
    "2040": {
      "Power sector": 2080000,
      "Refinery": 175420,
      "Manufacturing of solid fuels": 110000,
      "Oil rigs": 150000,
      "Manufacturing and construction": 1250000,
      "Transport": 6010000,
      "Other sectors": 1030000,
      "Oil and Gas companies": 18120000,
    },
    "2041": {
      "Power sector": 2270000,
      "Refinery": 86110,
      "Manufacturing of solid fuels": 120000,
      "Oil rigs": 200000,
      "Manufacturing and construction": 1260000,
      "Transport": 7520000,
      "Other sectors": 1110000,
      "Oil and Gas companies": 1260000,
    },
    "2042": {
      "Power sector": 2610000,
      "Refinery": 130760,
      "Manufacturing of solid fuels": 130000,
      "Oil rigs": 170000,
      "Manufacturing and construction": 1240000,
      "Transport": 7270000,
      "Other sectors": 1080000,
      "Oil and Gas companies": 4730000,
    },
    "2043": {
      "Power sector": 2580000,
      "Refinery": 46820,
      "Manufacturing of solid fuels": 130000,
      "Oil rigs": 200000,
      "Manufacturing and construction": 1200000,
      "Transport": 6870000,
      "Other sectors": 1040000,
      "Oil and Gas companies": 6980000,
    },
    "2044": {
      "Power sector": 3110000,
      "Refinery": 49400,
      "Manufacturing of solid fuels": 130000,
      "Oil rigs": 190000,
      "Manufacturing and construction": 1240000,
      "Transport": 6800000,
      "Other sectors": 1110000,
      "Oil and Gas companies": 6420000,
    },
    "2045": {
      "Power sector": 3280000,
      "Refinery": 247600,
      "Manufacturing of solid fuels": 130000,
      "Oil rigs": 260000,
      "Manufacturing and construction": 1090000,
      "Transport": 6330000,
      "Other sectors": 1090000,
      "Oil and Gas companies": 8400000,
    },
    "2046": {
      "Power sector": 4040000,
      "Refinery": 15210,
      "Manufacturing of solid fuels": 90000,
      "Oil rigs": 770000,
      "Manufacturing and construction": 1020000,
      "Transport": 7460000,
      "Other sectors": 1270000,
      "Oil and Gas companies": 22650000,
    },
    "2047": {
      "Power sector": 4700000,
      "Refinery": 100160,
      "Manufacturing of solid fuels": 170000,
      "Oil rigs": 970000,
      "Manufacturing and construction": 1110000,
      "Transport": 8560000,
      "Other sectors": 1320000,
      "Oil and Gas companies": 9660000,
    },
    "2048": {
      "Power sector": 5270000,
      "Refinery": 76100,
      "Manufacturing of solid fuels": 100000,
      "Oil rigs": 1020000,
      "Manufacturing and construction": 1250000,
      "Transport": 9230000,
      "Other sectors": 1350000,
      "Oil and Gas companies": 8050000,
    },
    "2049": {
      "Power sector": 7150000,
      "Refinery": 0,
      "Manufacturing of solid fuels": 0,
      "Oil rigs": 0,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2050": {
      "Power sector": 7600000,
      "Refinery": 0,
      "Manufacturing of solid fuels": 0,
      "Oil rigs": 0,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
    "2051": {
      "Power sector": 9600000,
      "Refinery": 0,
      "Manufacturing of solid fuels": 0,
      "Oil rigs": 0,
      "Manufacturing and construction": 0,
      "Transport": 0,
      "Other sectors": 0,
      "Oil and Gas companies": 0,
    },
  };

const DonutChart = () => {
  const [selectedYear, setSelectedYear] = useState("2019");

  const handleChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const currentData = data[selectedYear];

  const chartData = {
    series: Object.values(currentData),
    options: {
      labels: Object.keys(currentData),
      chart: {
        type: 'donut',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%',
          },
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 10,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      }],
    },
  };

  return (
    <div>
      <h2>Emission Data by Sector</h2>
      <Select 
        defaultValue={selectedYear} 
        onChange={handleChange} 
        style={{ width: 100, marginBottom: 20 }}
      >
        {Object.keys(data).map(year => (
          <Option key={year} value={year}>
            {year}
          </Option>
        ))}
      </Select>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width="400"
      />
    </div>
  );
};

export default DonutChart;
