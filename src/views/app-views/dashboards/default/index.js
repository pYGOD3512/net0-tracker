import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown, Spin, Select, Input } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import PieChart from 'components/shared-components/PieChart';
import Card from 'components/shared-components/Card';
import Flex from 'components/shared-components/Flex';
import { 
  calculateAnnualStatistics, 
  energyemissions, 
  VisitorChartData, // Importing the hardcoded data
} from './DefaultDashboardData';
import ApexChart from 'react-apexcharts';
import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
import { SPACER } from 'constants/ThemeConstant'
import { 
  FileExcelOutlined, 
  PrinterOutlined, 
  EllipsisOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { getLast5YearsData, getTotalEmissions, getTotalMitigations } from './util';
import fetchMitigationMeasures from './suggessionService';
import {fetchAIResponse} from './aiService';
import ReactMarkdown from 'react-markdown';
import { useDataContext } from '../../../../context/DataContext';

const { Option } = Select;

const MembersChart = (props) => {
  const { title, ...chartProps } = props;

  return (
    <div>
      {title && <h4 className="mb-0">{title}</h4>}
      <ApexChart {...chartProps} />
    </div>
  );
};

const extractSectors = (data) => {
  if (data.length === 0) return [];
  const firstEntry = data[0];
  return Object.keys(firstEntry).filter(key => key !== 'Year');
};

const extractAllSectors = (data) => {
  if (data.length === 0) return [];
  // Collect all unique keys across all entries
  const allKeys = new Set();
  data.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== 'Year') allKeys.add(key);
    });
  });
  return Array.from(allKeys);
};

const memberChartOption = {
  ...apexLineChartDefaultOption,
  ...{
    chart: {
      type: 'area',
      sparkline: {
        enabled: true,
      }
    },
    colors: [COLOR_2],
  }
}

const latestTransactionOption = [
  {
    key: 'Refresh',
    label: (
      <Flex alignItems="center" gap={SPACER[2]}>
        <ReloadOutlined />
        <span className="ml-2">Refresh</span>
      </Flex>
    ),
  },
  {
    key: 'Print',
    label: (
      <Flex alignItems="center" gap={SPACER[2]}>
        <PrinterOutlined />
        <span className="ml-2">Print</span>
      </Flex>
    ),
  },
  {
    key: 'Export',
    label: (
      <Flex alignItems="center" gap={SPACER[2]}>
        <FileExcelOutlined />
        <span className="ml-2">Export</span>
      </Flex>
    ),
  },
]

const CardDropdown = ({items}) => {

  return (
    <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
      <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
        <EllipsisOutlined />
      </a>
    </Dropdown>
  )
}


const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

export const DefaultDashboard = () => {

  const [chartData, setChartData] = useState({ series: [], categories: [] });
  const [annualStatisticData, setAnnualStatisticData] = useState([]);
  const { direction } = useSelector(state => state.theme)
  const { uploadedData } = useDataContext();
  const [yearRange, setYearRange] = useState([]);
  const yearOptions = chartData.categories;
  
  useEffect(() => {
    // Check if uploadedData is available, otherwise use VisitorChartData
    const dataToUse = uploadedData ? uploadedData.data : VisitorChartData.series;
    const categoriesToUse = uploadedData ? uploadedData.data.map(row => row.Year).filter(year => year) : VisitorChartData.categories;

    const categories = categoriesToUse;
    console.log('Categories:', categories);

    if (categories.length > 0) {
      const firstYear = categories[0];
      const lastYear = categories[categories.length - 1];

      // Set yearRange with validation
      setYearRange([firstYear || '1990', lastYear || '2022']);
      
      const series = [
        {
          name: 'Energy Sector / MtCO2e',
          data: uploadedData ? dataToUse.map(row => row['EnergySector']) : dataToUse[0].data,
        },
        {
          name: 'Mitigation Emissions',
          data: uploadedData ? dataToUse.map(row => row['MitigationEmissions']) : dataToUse[1].data,
        }
      ];

      setChartData({ series, categories });
    } else {
      setYearRange(['Default Start Year', 'Default End Year']);
    }
  }, [uploadedData]);

  // Update statistics when chartData changes
  useEffect(() => {
    if (chartData.categories.length > 0) {
      const latestIndex = chartData.categories.length - 1;
      const statistics = calculateAnnualStatistics(chartData, latestIndex);
      setAnnualStatisticData(statistics);
    }
  }, [chartData]);

  const handleChartClick = (event, chartContext, config) => {
    const yearIndex = config.dataPointIndex;
    const statistics = calculateAnnualStatistics(chartData, yearIndex);
    setAnnualStatisticData(statistics);
  };

  const handleStartYearChange = (value) => {
    setYearRange([value, yearRange[1]]);
  }

  const handleEndYearChange = (value) => {
    setYearRange([yearRange[0], value]);
  };

  const filteredChartData = {
    series: chartData.series.map(series => ({
      ...series,
      data: series.data.slice(
        chartData.categories.indexOf(yearRange[0]),
        chartData.categories.indexOf(yearRange[1]) + 1
      )
    })),
    categories: chartData.categories.slice(
      chartData.categories.indexOf(yearRange[0]),
      chartData.categories.indexOf(yearRange[1]) + 1
    ),
  };

  const SECTORS = extractAllSectors(uploadedData ? uploadedData.data : energyemissions);
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const updateData = () => {
      const lastYear = uploadedData ? uploadedData.data[uploadedData.data.length -1] : energyemissions[energyemissions.length - 1];
      console.log(lastYear,'last year I dont know either number or text')
      setValue(lastYear[selectedSector]);
      console.log(lastYear[selectedSector],'This is the selected sector')
      // setCurrentYearData(lastYear);
    };

    updateData();
    
    // const intervalId = setInterval(() => {
    //   const currentIndex = SECTORS.indexOf(selectedSector);
    //   const nextIndex = (currentIndex + 1) % SECTORS.length;
    //   setSelectedSector(SECTORS[nextIndex]);
    // }, 10000);

    // return () => clearInterval(intervalId);
  }, [selectedSector, SECTORS]);

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };

  const chartSeries = [{
    name: selectedSector,
    data: energyemissions.map(item => item[selectedSector])
  }];

  // AI SUGESSION
  const [mitigationMeasures, setMitigationMeasures] = useState('');
  const [loading, setLoading] = useState(true);
  const dataToUse = uploadedData ? uploadedData.data : energyemissions;
  console.log(dataToUse,'This is the data to use');

  useEffect(() => {
    const fetchAndSetMitigationMeasures = async () => {
      setLoading(true);

      try {
        // Determine which data to use

        // Fetch mitigation measures
        const measures = await fetchMitigationMeasures(JSON.stringify(dataToUse.slice(-5)));
        setMitigationMeasures(measures);
      } catch (error) {
        console.error('Error fetching mitigation measures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetMitigationMeasures();
  }, [uploadedData, energyemissions]);

  //AI CHAT
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [chatloading, setChatLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    setChatLoading(true);

    try {
      const aiResponse = await fetchAIResponse(userPrompt, dataToUse);
      setResponse(aiResponse);
    } catch (error) {
      setResponse(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>  
      <Row gutter={16} id="DashboardContent">
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={16}>
            {
              annualStatisticData.map((elm, i) => (
                <Col xs={24} sm={24} md={12} lg={12} xl={8} key={i}>
                  <StatisticWidget 
                    title={elm.title} 
                    value={elm.value}
                    status={elm.status}
                    status_percentage = {elm.status_percentage}
                    subtitle={elm.subtitle}
                  />
                </Col>
              ))
            }
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div className={`d-flex align-items-center justify-content-end mb-2 `}>
                <Select
                  style={{ width: '10%', height: '2rem', marginRight: '10px' }}
                  value={yearRange[0]}
                  onChange={handleStartYearChange}
                >
                  {yearOptions.map(year => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
                <Select
                  style={{ width: '10%', height: '2rem' }}
                  value={yearRange[1]}
                  onChange={handleEndYearChange}
                >
                  {yearOptions.map(year => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
              </div>
              <ChartWidget 
                title="Emissions and Estimated Emissions Mitigation over time" 
                series={filteredChartData.series} 
                xAxis={filteredChartData.categories}
                height={'400px'}
                direction={direction}
                onClick={handleChartClick}
                extra={<CardDropdown items={latestTransactionOption} />}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
        <PieChart
          height={300} // Adjust this value to your desired height
          subtitle="Contribution of energy sources to electricity generation"
        />
          <div>
            {/* <select onChange={handleSectorChange} value={selectedSector}>
              {SECTORS.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select> */}
            <StatisticWidget
              title={
                <MembersChart
                  title='Individual Energy Supply'
                  options={memberChartOption}
                  series={chartSeries}
                  height={200}
                />
              }
              value={value}
              subtitle={selectedSector}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card title="AI Suggested Mitigation Measures" extra={<CardDropdown items={latestTransactionOption} />}>
            {loading ? (
              <div className={`d-flex align-items-center justify-content-start`}>
                <Spin size="small" />
                <p className={`ml-2`}>Analyzing and suggesting mitigation measures</p>
              </div>
            ) : (
              <div className="markdown-response mt-2"><ReactMarkdown>{mitigationMeasures}</ReactMarkdown></div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card title="Talk to our AI Assistant">
            <div className={`d-flex align-items-center justify-content-between mb-4 `}>
              <Input
                value={userPrompt}
                onChange={handleInputChange}
                placeholder="Hi! Ask me something"
                rows={1}
              />
              <Button type="default" size="small" onClick={handleSubmit}>Submit</Button>
            </div>
            {chatloading ? (
              <Spin size="small" style={{ marginTop: 10 }} />
            ) : (
              <div className="markdown-response" style={{ marginTop: 20 }}>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DefaultDashboard;
