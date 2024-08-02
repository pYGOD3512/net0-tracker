import React, { useState, useEffect } from "react";
import { Row, Col, Button, Avatar, Dropdown, Table, Menu, Tag } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import GoalWidget from 'components/shared-components/GoalWidget';
import PieChart from 'components/shared-components/PieChart';
import Card from 'components/shared-components/Card';
import Flex from 'components/shared-components/Flex';
import { 
  VisitorChartData, 
  // AnnualStatisticData,
  calculateAnnualStatistics, 
  ActiveMembersData,
  energyemissions, 
  NewMembersData, 
  RecentTransactionData 
} from './DefaultDashboardData';
import ApexChart from 'react-apexcharts';
import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
import { SPACER } from 'constants/ThemeConstant'
import { 
  UserAddOutlined, 
  FileExcelOutlined, 
  PrinterOutlined, 
  PlusOutlined, 
  EllipsisOutlined, 
  StopOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import utils from 'utils';
import { useSelector } from 'react-redux';

import { getLast5YearsData, getTotalEmissions, getTotalMitigations } from './util';
import fetchMitigationMeasures from './service';
import fetchAIResponse from './service';
import ReactMarkdown from 'react-markdown';
import { Input, Spin } from 'antd'; 

const MembersChart = props => (
  <ApexChart {...props}/>
)
const extractSectors = (data) => {
  if (data.length === 0) return [];
  const firstEntry = data[0];
  return Object.keys(firstEntry).filter(key => key !== 'Year');
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

const newJoinMemberOptions = [
  {
    key: 'Add all',
    label: (
      <Flex alignItems="center" gap={SPACER[2]}>
        <PlusOutlined />
        <span className="ml-2">Add all</span>
      </Flex>
    ),
  },
  {
    key: 'Disable all',
    label: (
      <Flex alignItems="center" gap={SPACER[2]}>
        <StopOutlined />
        <span className="ml-2">Disable all</span>
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

const tableColumns = [
  {
    title: 'Example',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar size={30} className="font-size-sm" style={{backgroundColor: record.avatarColor}}>
          {utils.getNameInitial(text)}
        </Avatar>
        <span className="ml-2">{text}</span>
      </div>
    ),
  },
  {
    title: 'Example',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Example',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: () => <div className="text-right">Example</div>,
    key: 'status',
    render: (_, record) => (
      <div className="text-right">
        <Tag className="mr-0" color={record.status === 'Approved' ? 'cyan' : record.status === 'Pending' ? 'blue' : 'volcano'}>{record.status}</Tag>
      </div>
    ),
  },
];


const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

export const DefaultDashboard = () => {
  const [visitorChartData] = useState(VisitorChartData);
  // const [annualStatisticData] = useState(AnnualStatisticData);
  const [annualStatisticData, setAnnualStatisticData] = useState([]);
  const [activeMembersData] = useState(ActiveMembersData);
  const [newMembersData] = useState(NewMembersData)
  const [recentTransactionData] = useState(RecentTransactionData)
  const { direction } = useSelector(state => state.theme)

  useEffect(() => {
    const yearIndex = visitorChartData.series[0].data.length - 1;
    const statistics = calculateAnnualStatistics(visitorChartData, yearIndex);
    setAnnualStatisticData(statistics);
  }, [visitorChartData]);

  const handleChartClick = (event, chartContext, config) => {
    const yearIndex = config.dataPointIndex;
    const statistics = calculateAnnualStatistics(visitorChartData, yearIndex);
    setAnnualStatisticData(statistics);
  }

  const SECTORS = extractSectors(energyemissions);
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [currentYearData, setCurrentYearData] = useState({});
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState(0);
  const [statusPercentage, setStatusPercentage] = useState('');

  useEffect(() => {
    const updateData = () => {
      const lastYear = energyemissions[energyemissions.length - 1];
      setValue(lastYear[selectedSector]);
      setCurrentYearData(lastYear);
    };

    updateData();
    
    const intervalId = setInterval(() => {
      const currentIndex = SECTORS.indexOf(selectedSector);
      const nextIndex = (currentIndex + 1) % SECTORS.length;
      setSelectedSector(SECTORS[nextIndex]);
    }, 5000);

    return () => clearInterval(intervalId);
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

  useEffect(() => {
    const fetchAndSetMitigationMeasures = async () => {
      // Extract the last 5 years of data
      const last5YearsData = getLast5YearsData(energyemissions, SECTORS);
      const totalEmissions = getTotalEmissions(last5YearsData);
      const totalMitigations = getTotalMitigations(last5YearsData);

      const measures = await fetchMitigationMeasures(last5YearsData, totalEmissions, totalMitigations);
      setMitigationMeasures(measures);
      setLoading(false);
    };

    fetchAndSetMitigationMeasures();
  }, []);

  //AI CHAT
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [chatloading, setChatLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    const validTopics = ['energy', 'emissions', 'climate', 'carbon', 'thermal', 'mitigation'];

    // if (!validTopics.some(topic => userPrompt.toLowerCase().includes(topic))) {
    //   setResponse('Please ask something about energy emissions or climate change.');
    //   return;
    // }

    setChatLoading(true);

    try {
      const aiResponse = await fetchAIResponse(userPrompt, energyemissions);
      setResponse(aiResponse);
    } catch (error) {
      setResponse(error.message);
    } finally {
      setChatLoading(false);
    }
  };


  return (
    <>  
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={16}>
            {
              annualStatisticData.map((elm, i) => (
                <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
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
                <ChartWidget 
                  title="Emissions and Estimated Emissions Mitigation over time" 
                  series={visitorChartData.series} 
                  xAxis={visitorChartData.categories} 
                  height={'400px'}
                  direction={direction}
                  onClick={handleChartClick}
                />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          {/* <GoalWidget 
            title="Monthly Target" 
            value={87}
            subtitle="You need abit more effort to hit monthly target"
            extra={<Button type="primary">Learn More</Button>}
          /> */}
          <PieChart
            height={400}
            subtitle="Contribution of energy sources to electricity generation"  
          />
          {/* <StatisticWidget 
            title={
              <MembersChart 
                options={memberChartOption}
                series={activeMembersData}
                height={145}
              />
            }
            value='65.33'
            status={3.7}
            subtitle="Thermal/GWh"
          /> */}
          <div>
          {/* <select onChange={handleSectorChange} value={selectedSector}>
        {SECTORS.map(sector => (
          <option key={sector} value={sector}>{sector}</option>
        ))}
      </select> */}
      <StatisticWidget
        title={
          <MembersChart
            options={memberChartOption}
            series={chartSeries}
            height={200}
          />
        }
        value={value}
        // status={status}
        // status_percentage={statusPercentage}
        subtitle={selectedSector}
      />
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* <Col xs={24} sm={24} md={24} lg={7}>
          <Card title="Energy Generation" extra={<CardDropdown items={newJoinMemberOptions} />}>
            <div className="mt-3">
              {
                newMembersData.map((elm, i) => (
                  <div key={i} className={`d-flex align-items-center justify-content-between mb-4`}>
                    <AvatarStatus id={i} src={elm.img} name={elm.name} subTitle={elm.title} />
                    <div>
                    icon={<UserAddOutlined />}
                      <Button type="default" size="small">View Details</Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </Card>
        </Col> */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card title="Suggested Mitigation Measures" extra={<CardDropdown items={latestTransactionOption} />}>
            {/* <Table 
              className="no-border-last" 
              columns={tableColumns} 
              dataSource={recentTransactionData} 
              rowKey='id' 
              pagination={false}
            /> */}
            {loading ? (
          <Spin size="small" style={{ marginTop: 10 }} />
        ) : (
          <div className="markdown-response mt-4"><ReactMarkdown>{mitigationMeasures}</ReactMarkdown></div>
          
        )}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card title="Ask Our AI Assistant">
            <div className={`d-flex align-items-center justify-content-between mb-4 `}>
              <Input
                value={userPrompt}
                onChange={handleInputChange}
                placeholder="Enter your question about energy emissions..."
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
