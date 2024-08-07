// import React, { useState, useEffect, useRef } from "react";
// import { Row, Col, Button, Avatar, Dropdown, Table, Menu, Tag } from 'antd';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import ChartWidget from 'components/shared-components/ChartWidget';
// import PieChart from 'components/shared-components/PieChart';
// import Card from 'components/shared-components/Card';
// import Flex from 'components/shared-components/Flex';
// import { 
//   calculateAnnualStatistics, 
//   energyemissions, 
// } from './DefaultDashboardData';
// import ApexChart from 'react-apexcharts';
// import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
// import { SPACER } from 'constants/ThemeConstant'
// import { 
//   FileExcelOutlined, 
//   PrinterOutlined, 
//   EllipsisOutlined, 
//   ReloadOutlined 
// } from '@ant-design/icons';
// import { useSelector } from 'react-redux';

// import { getLast5YearsData, getTotalEmissions, getTotalMitigations } from './util';
// import fetchMitigationMeasures from './suggessionService';
// import {fetchAIResponse} from './aiService';
// import ReactMarkdown from 'react-markdown';
// import { Input, Spin, Select } from 'antd'; 
// import { useDataContext } from '../../../../context/DataContext';

// const { Option } = Select;

// const MembersChart = (props) => {
//   const { title, ...chartProps } = props;

//   return (
//     <div>
//       {title && <h4 className="mb-0">{title}</h4>}
//       <ApexChart {...chartProps} />
//     </div>
//   );
// };

// const extractSectors = (data) => {
//   if (data.length === 0) return [];
//   const firstEntry = data[0];
//   return Object.keys(firstEntry).filter(key => key !== 'Year');
// };

// const memberChartOption = {
//   ...apexLineChartDefaultOption,
//   ...{
//     chart: {
//       type: 'area',
//       sparkline: {
//         enabled: true,
//       }
//     },
//     colors: [COLOR_2],
//   }
// }

// const latestTransactionOption = [
//   {
//     key: 'Refresh',
//     label: (
//       <Flex alignItems="center" gap={SPACER[2]}>
//         <ReloadOutlined />
//         <span className="ml-2">Refresh</span>
//       </Flex>
//     ),
//   },
//   {
//     key: 'Print',
//     label: (
//       <Flex alignItems="center" gap={SPACER[2]}>
//         <PrinterOutlined />
//         <span className="ml-2">Print</span>
//       </Flex>
//     ),
//   },
//   {
//     key: 'Export',
//     label: (
//       <Flex alignItems="center" gap={SPACER[2]}>
//         <FileExcelOutlined />
//         <span className="ml-2">Export</span>
//       </Flex>
//     ),
//   },
// ]

// const CardDropdown = ({items}) => {

//   return (
//     <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
//       <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
//         <EllipsisOutlined />
//       </a>
//     </Dropdown>
//   )
// }


// const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

// export const DefaultDashboard = () => {

//   const [chartData, setChartData] = useState({ series: [], categories: [] });
//   const [annualStatisticData, setAnnualStatisticData] = useState([]);
//   const { direction } = useSelector(state => state.theme)
//   const { uploadedData, } = useDataContext();
//   const [yearRange, setYearRange] = useState([]);
//   const yearOptions = chartData.categories;
  
//   useEffect(() => {
//     if (uploadedData) {
//       const { data } = uploadedData;
//       const categories = data.map(row => row.Year).filter(year => year);  // Filter out any empty or invalid years
      
//       console.log('Categories:', categories); 
  
//       if (categories.length > 0) {
//         const firstYear = categories[0];
//         const lastYear = categories[categories.length - 1];
  
//         // Set yearRange with validation
//         setYearRange([firstYear || '1990', lastYear || '2022']);
        
//         const series = [
//           {
//             name: 'Energy Sector / MtCO2e',
//             data: data.map(row => row.EnergySector),
//           },
//           {
//             name: 'Mitigation Emissions',
//             data: data.map(row => row.MitigationEmissions),
//           }
//         ];

//         setChartData({ series, categories });
//       } else {
//         setYearRange(['Default Start Year', 'Default End Year']);
//       }
//     }
//   }, [uploadedData]);

//   // Update statistics when chartData changes
//   useEffect(() => {
//     if (chartData.categories.length > 0) {
//       const latestIndex = chartData.categories.length - 1;
//       const statistics = calculateAnnualStatistics(chartData, latestIndex);
//       setAnnualStatisticData(statistics);
//     }
//   }, [chartData]);

//   const handleChartClick = (event, chartContext, config) => {
//     const yearIndex = config.dataPointIndex;
//     const statistics = calculateAnnualStatistics(chartData, yearIndex);
//     setAnnualStatisticData(statistics);
//   };

//   const handleStartYearChange = (value) => {
//     setYearRange([value, yearRange[1]]);
//   }

//   const handleEndYearChange = (value) => {
//     setYearRange([yearRange[0], value]);
//   };

//   const filteredChartData = {
//     series: chartData.series.map(series => ({
//       ...series,
//       data: series.data.slice(
//         chartData.categories.indexOf(yearRange[0]),
//         chartData.categories.indexOf(yearRange[1]) + 1
//       )
//     })),
//     categories: chartData.categories.slice(
//       chartData.categories.indexOf(yearRange[0]),
//       chartData.categories.indexOf(yearRange[1]) + 1
//     ),
//   };

//   const SECTORS = extractSectors(energyemissions);
//   const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
//   const [value, setValue] = useState(0);

//   useEffect(() => {
//     const updateData = () => {
//       const lastYear = energyemissions[energyemissions.length - 1];
//       setValue(lastYear[selectedSector]);
//       // setCurrentYearData(lastYear);
//     };

//     updateData();
    
//     // const intervalId = setInterval(() => {
//     //   const currentIndex = SECTORS.indexOf(selectedSector);
//     //   const nextIndex = (currentIndex + 1) % SECTORS.length;
//     //   setSelectedSector(SECTORS[nextIndex]);
//     // }, 10000);

//     // return () => clearInterval(intervalId);
//   }, [selectedSector, SECTORS]);

//   const handleSectorChange = (event) => {
//     setSelectedSector(event.target.value);
//   };

//   const chartSeries = [{
//     name: selectedSector,
//     data: energyemissions.map(item => item[selectedSector])
//   }];

//   // AI SUGESSION
//   const [mitigationMeasures, setMitigationMeasures] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAndSetMitigationMeasures = async () => {
//       // Extract the last 5 years of data
//       const last5YearsData = getLast5YearsData(energyemissions, SECTORS);
//       const totalEmissions = getTotalEmissions(last5YearsData);
//       const totalMitigations = getTotalMitigations(last5YearsData);

//       try {
//         const measures = await fetchMitigationMeasures(last5YearsData, totalEmissions, totalMitigations);
//         setMitigationMeasures(measures);
//       } catch (error) {
//       } finally {
//         setLoading(false);
//       }
//     };


//     fetchAndSetMitigationMeasures();
//   }, []);

//   //AI CHAT
//   const [userPrompt, setUserPrompt] = useState('');
//   const [response, setResponse] = useState('');
//   const [chatloading, setChatLoading] = useState(false);

//   const handleInputChange = (e) => {
//     setUserPrompt(e.target.value);
//   };

//   const handleSubmit = async () => {
//     setChatLoading(true);

//     try {
//       const aiResponse = await fetchAIResponse(userPrompt, energyemissions);
//       setResponse(aiResponse);
//     } catch (error) {
//       setResponse(error.message);
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   return (
//     <>  
//       <Row gutter={16} id="DashboardContent">
//         <Col xs={24} sm={24} md={24} lg={18}>
//           <Row gutter={16}>
//             {
//               annualStatisticData.map((elm, i) => (
//                 <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
//                   <StatisticWidget 
//                     title={elm.title} 
//                     value={elm.value}
//                     status={elm.status}
//                     status_percentage = {elm.status_percentage}
//                     subtitle={elm.subtitle}
//                   />
//                 </Col>
//               ))
//             }
//           </Row>
//           <Row gutter={16}>
//             <Col span={24}>
//             <div className={`d-flex align-items-center justify-content-end mb-2 `}>
//             <Select
//               style={{ width: '10%', height: '2rem', marginRight: '10px' }}
//               value={yearRange[0]}
//               onChange={handleStartYearChange}
//             >
//               {yearOptions.map(year => (
//                 <Option key={year} value={year}>
//                   {year}
//                 </Option>
//               ))}
//             </Select>
//             <Select
//               style={{ width: '10%', height: '2rem' }}
//               value={yearRange[1]}
//               onChange={handleEndYearChange}
//             >
//               {yearOptions.map(year => (
//                 <Option key={year} value={year}>
//                   {year}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//                 <ChartWidget 
//                   title="Emissions and Estimated Emissions Mitigation over time" 
//                   series={filteredChartData.series} 
//                   xAxis={filteredChartData.categories}
//                   height={'400px'}
//                   direction={direction}
//                   onClick={handleChartClick}
//                   extra={<CardDropdown items={latestTransactionOption} />}/>
//             </Col>
//           </Row>
//         </Col>
//         <Col xs={24} sm={24} md={24} lg={6}>
//           <PieChart
//             height={300}
//             subtitle="Contribution of energy sources to electricity generation"  
//           />
//           <div>
//           {/* <select onChange={handleSectorChange} value={selectedSector}>
//         {SECTORS.map(sector => (
//           <option key={sector} value={sector}>{sector}</option>
//         ))}
//       </select> */}
//       <StatisticWidget
//         title={
//           <MembersChart
//             title='Individual Energy Supply'
//             options={memberChartOption}
//             series={chartSeries}
//             height={200}
//           />
//         }
//         value={value}
//         subtitle={selectedSector}
//       />
//           </div>
//         </Col>
//       </Row>
//       <Row gutter={16}>
//         <Col xs={24} sm={24} md={24} lg={18}>
//           <Card title="AI Suggested Mitigation Measures" extra={<CardDropdown items={latestTransactionOption} />}>
//             {loading ? (
//               <div className={`d-flex align-items-center justify-content-start`}>
//                 <Spin size="small" />
//                 <p className={`ml-2`}>Analyzing and suggesting mitigation measures</p>
//               </div>
//         ) : (
//           <div className="markdown-response mt-2"><ReactMarkdown>{mitigationMeasures}</ReactMarkdown></div>
          
//         )}
//           </Card>
//         </Col>
//         <Col xs={24} sm={24} md={24} lg={6}>
//           <Card title="Talk to our AI Assistant">
//             <div className={`d-flex align-items-center justify-content-between mb-4 `}>
//               <Input
//                 value={userPrompt}
//                 onChange={handleInputChange}
//                 placeholder="Hi! Ask me something"
//                 rows={1}
//               />
//               <Button type="default" size="small" onClick={handleSubmit}>Submit</Button>
//             </div>
//             {chatloading ? (
//               <Spin size="small" style={{ marginTop: 10 }} />
//             ) : (
//               <div className="markdown-response" style={{ marginTop: 20 }}>
//                 <ReactMarkdown>{response}</ReactMarkdown>
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </>
//   )
// }

// export default DefaultDashboard;



// {Year: 2000, Power sector/GWh: 7224, Renewable/GWh: 6610}
// 1
// : 
// {Year: 2001, Power sector/GWh: 7859, Renewable/GWh: 6609}
// 2
// : 
// {Year: 2002, Power sector/GWh: 7273, Renewable/GWh: 5036}
// 3
// : 
// {Year: 2003, Power sector/GWh: 5881, Renewable/GWh: 3885}
// 4
// : 
// {Year: 2004, Power sector/GWh: 6038, Renewable/GWh: 5280}
// 5
// : 
// {Year: 2005, Power sector/GWh: 6788, Renewable/GWh: 5629}
// 6
// : 
// {Year: 2006, Power sector/GWh: 8430, Renewable/GWh: 5619}
// 7
// : 
// {Year: 2007, Power sector/GWh: 6978, Renewable/GWh: 3727}
// 8
// : 
// {Year: 2008, Power sector/GWh: 8325, Renewable/GWh: 6196}
// 9
// : 
// {Year: 2009, Power sector/GWh: 8958, Renewable/GWh: 6877}


// {Year: '1990', MitigationEmissions: '', EnergySector: ''}
// 1
// : 
// {Year: '1991', MitigationEmissions: '', EnergySector: ''}
// 2
// : 
// {Year: '1992', MitigationEmissions: '', EnergySector: ''}
// 3
// : 
// {Year: '1993', MitigationEmissions: '205484.96', EnergySector: '10414.4'}
// 4
// : 
// {Year: '1994', MitigationEmissions: '205485.52', EnergySector: '101265.72'}
// 5
// : 
// {Year: '1995', MitigationEmissions: '315475.06', EnergySector: '128971.48'}
// 6
// : 
// {Year: '1996', MitigationEmissions: '335187.24', EnergySector: '116705.56'}
// 7
// : 
// {Year: '1997', MitigationEmissions: '329488.6', EnergySector: '214143.56'}
// 8
// : 
// {Year: '1998', MitigationEmissions: '305489.72', EnergySector: '322937.68'}