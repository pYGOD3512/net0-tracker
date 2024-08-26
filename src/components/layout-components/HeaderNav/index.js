/** @jsxImportSource @emotion/react */
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TEMPLATE } from 'constants/ThemeConstant';
import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Logo from '../Logo';
import NavNotification from '../NavNotification';
import NavProfile from '../NavProfile';
import NavLanguage from '../NavLanguage';
import NavPanel from '../NavPanel';
import NavSearch from '../NavSearch';
import SearchInput from '../NavSearch/SearchInput';
import Header from './Header';
import HeaderWrapper from './HeaderWrapper';
import Nav from './Nav';
import NavEdge from './NavEdge';
import NavItem from '../NavItem';
import { toggleCollapsedNav, onMobileNavToggle } from 'store/slices/themeSlice';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils';

import { Button, Modal, Select, Upload, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse'; 
import * as XLSX from 'xlsx'; 
import { useDataContext } from '../../../context/DataContext';

const { Option } = Select;

export const HeaderNav = props => {

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Notification Title',
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
    };

    const { setUploadedData, setSelectedColumns } = useDataContext();
    const [fileData, setFileData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({ yearColumn: '', mitigationColumn: '', energyColumn: '' });
    const [additionalSelects, setAdditionalSelects] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleFileUpload = (file) => {
        const fileType = file.type;
        if (fileType.includes('csv')) {
            parseCSV(file);
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            parseExcel(file);
        }
        return false; 
    };

    const parseCSV = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                const data = result.data;
                const columns = Object.keys(data[0]);
                setColumns(columns);
                setFileData(data);
                setShowModal(true);
            },
        });
    };

    const parseExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const columns = Object.keys(jsonData[0]);
            setColumns(columns);
            setFileData(jsonData);
            setShowModal(true);
        };
        reader.readAsArrayBuffer(file);
    };

	const handleColumnSelection = () => {
		const { yearColumn, mitigationColumn, energyColumn } = selectedOptions;
	
		if (yearColumn && mitigationColumn && energyColumn && fileData) {
			// Process the data
			const processedData = fileData.map((row, index, arr) => {
				
				if (Object.values(row).every(value => value === undefined || value === null || value === '')) {
					return null;
				}
			
				let additionalData = {};
				additionalSelects.forEach((select) => {
					if (row[select]) {
						additionalData[select] = row[select];
					}
				});
			
				// Handle missing data for column
				const year = row[yearColumn] !== undefined && row[yearColumn] !== null ? row[yearColumn] : null;
				
				// Function to interpolate missing values
				const interpolateValue = (columnName) => {
					if (row[columnName] !== undefined && row[columnName] !== null && row[columnName] !== '') {
						return parseFloat(row[columnName].replace(/,/g, '')); 
					}
			
					// Find previous and next valid indices
					let previousIndex = index - 1;
					let nextIndex = index + 1;
			
					while (previousIndex >= 0 && (arr[previousIndex][columnName] === undefined || arr[previousIndex][columnName] === null || arr[previousIndex][columnName] === '')) {
						previousIndex--;
					}
			
					while (nextIndex < arr.length && (arr[nextIndex][columnName] === undefined || arr[nextIndex][columnName] === null || arr[nextIndex][columnName] === '')) {
						nextIndex++;
					}
			
					if (previousIndex < 0 && nextIndex >= arr.length) {
						return 'Unknown';
					}
			
					if (previousIndex < 0) {
						return parseFloat(arr[nextIndex][columnName].replace(/,/g, ''));
					}
			
					if (nextIndex >= arr.length) {
						return parseFloat(arr[previousIndex][columnName].replace(/,/g, ''));
					}
			
					// Perform linear interpolation
					const previousValue = parseFloat(arr[previousIndex][columnName].replace(/,/g, ''));
					const nextValue = parseFloat(arr[nextIndex][columnName].replace(/,/g, ''));
					const ratio = (index - previousIndex) / (nextIndex - previousIndex);
					return previousValue + ratio * (nextValue - previousValue);
				};
			
				// Apply interpolation for the required columns
				const interpolatedMitigation = interpolateValue(mitigationColumn);
				const interpolatedEnergy = interpolateValue(energyColumn);
			
				return {
					Year: year,
					MitigationEmissions: interpolatedMitigation,
					EnergySector: interpolatedEnergy,
					...additionalData,
				};
			}).filter(row => row !== null); 
			
	
			setUploadedData({
				columns: { yearColumn, mitigationColumn, energyColumn, additional: additionalSelects },
				data: processedData,
			});
	
			setSelectedColumns({
				yearColumn,
				energyColumn,
				mitigationColumn,
				additionalColumns: additionalSelects,
			});
	
			// Reset selections and close modal
			setAdditionalSelects([]);
			setShowModal(false);
		} else {
			notification.error({
				message: 'Selection Error',
				description: 'Please ensure all columns are selected and data is available.',
			});
		}
	};

    const handleAddSelect = () => {
        setAdditionalSelects((prev) => [...prev, null]);
    };

    const handleRemoveSelect = (index) => {
        setAdditionalSelects((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAdditionalSelectChange = (value, index) => {
        setAdditionalSelects((prev) => {
            const newSelects = [...prev];
            newSelects[index] = value;
            return newSelects;
        });
    };

    const { isMobile } = props;

    const [searchActive, setSearchActive] = useState(false);

    const dispatch = useDispatch();

    const navCollapsed = useSelector(state => state.theme.navCollapsed);
    const mobileNav = useSelector(state => state.theme.mobileNav);
    const navType = useSelector(state => state.theme.navType);
    const headerNavColor = useSelector(state => state.theme.headerNavColor);
    const currentTheme = useSelector(state => state.theme.currentTheme);
    const direction = useSelector(state => state.theme.direction);

    const onSearchActive = () => {
        setSearchActive(true);
    };

    const onSearchClose = () => {
        setSearchActive(false);
    };

    const onToggle = () => {
        if (!isMobile) {
            dispatch(toggleCollapsedNav(!navCollapsed));
        } else {
            dispatch(onMobileNavToggle(!mobileNav));
        }
    };

    const isNavTop = navType === NAV_TYPE_TOP;
    const isDarkTheme = currentTheme === 'dark';

    const navMode = useMemo(() => {
        if (!headerNavColor) {
            return utils.getColorContrast(isDarkTheme ? '#000000' : '#ffffff');
        }
        return utils.getColorContrast(headerNavColor);
    }, [isDarkTheme, headerNavColor]);

    const navBgColor = isDarkTheme ? TEMPLATE.HEADER_BG_DEFAULT_COLOR_DARK : TEMPLATE.HEADER_BG_DEFAULT_COLOR_LIGHT;

    const getNavWidth = () => {
        if (isNavTop || isMobile) {
            return '0px';
        }
        if (navCollapsed) {
            return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
        } else {
            return `${SIDE_NAV_WIDTH}px`;
        }
    };

    useEffect(() => {
        if (!isMobile) {
            onSearchClose();
        }
    }, [isMobile]);

    return (
        <>
            <Header isDarkTheme={isDarkTheme} headerNavColor={headerNavColor || navBgColor}>
                <HeaderWrapper isNavTop={isNavTop}>
                    <Logo logoType={navMode} />
                    <Nav navWidth={getNavWidth()}>
                        <NavEdge left>
                            {isNavTop && !isMobile ? null : (
                                <NavItem onClick={onToggle} mode={navMode}>
                                    <div className="d-flex align-items-center">
                                        {navCollapsed || isMobile ? <MenuUnfoldOutlined className="nav-icon" /> : <MenuFoldOutlined className="nav-icon" />}
                                    </div>
                                </NavItem>
                            )}
                            <div>
                                <Upload 
                                    showUploadList={false} 
                                    customRequest={({ file }) => handleFileUpload(file)}
                                    accept=".csv,.xlsx,.xls"
                                >
                                    <Button 
                                        type="default" 
                                        size="medium" 
                                        icon={<UploadOutlined />} 
                                    >
                                        Upload File
                                    </Button>
                                </Upload>
                            </div>
                        </NavEdge>
                        <NavEdge right>
                            <NavNotification mode={navMode} />
                            <NavLanguage mode={navMode} />
                            <NavPanel direction={direction} mode={navMode} />
                            {/* <NavProfile mode={navMode} /> */}
                        </NavEdge>
                        <NavSearch 
                            active={searchActive} 
                            close={onSearchClose} 
                            headerNavColor={headerNavColor}
                            currentTheme={currentTheme}
                            mode={navMode}
                        />
                    </Nav>
                </HeaderWrapper>
            </Header>
            <Modal
                title="Select Columns"
                visible={showModal}
                onOk={handleColumnSelection}
                onCancel={() => setShowModal(false)}
            >
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    placeholder="Select the column for Years"
                    onChange={value => setSelectedOptions(prev => ({ ...prev, yearColumn: value }))}
                >
                    {columns.map(col => (
                        <Option key={col} value={col}>{col}</Option>
                    ))}
                </Select>
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    placeholder="Select the column for Total Emisisons (MtCO2e)"
                    onChange={value => setSelectedOptions(prev => ({ ...prev, energyColumn: value }))}
                >
                    {columns.map(col => (
                        <Option key={col} value={col}>{col}</Option>
                    ))}
                </Select>
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    placeholder="Select Total Mitigation Emissions column (MtCO2e)"
                    onChange={value => setSelectedOptions(prev => ({ ...prev, mitigationColumn: value }))}
                >
                    {columns.map(col => (
                        <Option key={col} value={col}>{col}</Option>
                    ))}
                </Select>
                <div style={{ marginBottom: '10px' }}>
                    <Button
                        type="dashed"
                        onClick={handleAddSelect}
                        block
                        icon={<PlusOutlined />}
                    >
                        Add more emission contributions
                    </Button>
                </div>
                {additionalSelects.map((select, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                        <Select
                            style={{ flex: 1 }}
                            placeholder="Select Energy column (GWh)"
                            value={select || undefined}
                            onChange={(value) => handleAdditionalSelectChange(value, index)}
                        >
                            {columns.map((col) => (
                                <Option key={col} value={col}>
                                    {col}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="link"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => handleRemoveSelect(index)}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                ))}
            </Modal>
            {contextHolder}
        </>
    );
};

export default HeaderNav;
