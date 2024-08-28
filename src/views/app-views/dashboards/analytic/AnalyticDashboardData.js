import { COLORS } from 'constants/ChartConstant';

export const regionData = [
	{
		color: '#3e82f7',
		name: 'United States of America',
		value: '37.61%'
  	},
  	{
		color: '#04d182',
		name: 'Brazil',
		value: '16.79%'
  	},
 	 {
		color: '#ffc542',
		name: 'India',
		value: '12.42%'
 	},
  	{
		color: '#fa8c16',
		name: 'China',
		value: '9.85%'
	},
	{
		color: '#ff6b72',
		name: 'Malaysia',
		value: '7.68%'
	},
	{
		color: '#a461d8',
		name: 'Thailand',
		value: '5.11%'
	}
]

export const pagesViewData = [
	{
    title: 'Home',
    url:'/app/home/',
    amount: 7616
  },
  {
    title: 'Resources',
    url:'/app/resources/',
    amount: 6923
  },
  {
    title: 'Integrations',
    url: '/integrations/paypal/',
    amount: 5228
  },
  {
    title: 'Partners',
    url: '/partners/our-partners/',
    amount: 3512
  },
  {
    title: 'Developers',
    url: 'developers/docs/',
    amount: 1707
  }
]

export const sessionColor = [COLORS[3], COLORS[0], COLORS[1]]
export const sessionData = [3561, 1443, 2462]
export const sessionLabels = ["Dasktops", "Tablets", "Mobiles"]
const jointSessionData = () => {
	let arr = []
	for (let i = 0; i < sessionData.length; i++) {
		const data = sessionData[i];
		const label = sessionLabels[i];
		const color = sessionColor[i]
		arr = [...arr, {
			data: data,
			label: label,
			color: color
		}]
	}
	return arr
}
export const conbinedSessionData = jointSessionData()

export const socialMediaReferralData = [
	{
		title: 'Facebook',
		data:  [{
			data: [12, 14, 2, 47, 42, 15, 47]
		}],
		percentage: 30.1,
		amount: 322
	},
	{
		title: 'Twitter',
		data:  [{
			data: [9, 32, 12, 42, 25, 33]
		}],
		percentage: 21.6,
		amount: 217
	},
	{
		title: 'Youtube',
		data:  [{
			data: [10, 9, 29, 19, 22, 9, 12]
		}],
		percentage: -7.1,
		amount: 188
	},
	{
		title: 'Linkedin',
		data:  [{
			data: [25, 66, 41, 89, 63, 25, 44]
		}],
		percentage: 11.9,
		amount: 207
		},
	{
		title: 'Dribbble',
		data:  [{
			data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
		}],
		percentage: -28.5,
		amount: 86
	}
]

export const uniqueVisitorsDataDay = {
	series: [
		{
		  name: "Contribution of Thermal Power Plants",
		  data: [614,1250,2237,1996,758,1159,2811,3251,2129,2081,3171,3639,3953,4635,4572,5644,7435,8424,10195,10894,12815,14417,14818,]
		},
		{
		  name: "Contribution of Renewables",
		  data: [6610,6609, 5036, 3885,5280, 5629,5619,3727,6196,6877,6995,7561,8071,8236,8391,5847,5588,5644,6050,7304,7350,7643,]
  
  
		}
	  ],
	  categories: [
		2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
		2016, 2017, 2018, 2019, 2020, 2021, 2022,
	  ]
}
export const uniqueVisitorsDataDay2 = {
	series: [
		{
		  name: "Actual emissions",
		  data: [180000,226000,155000,16000,117000,1521000,1072000,490000,820000,1310000,1140000,490000,750000,1610000,1870000,1320000,1280000,1850000,2080000,2270000,2610000,2580000,3110000,3280000,4040000,4700000,5270000,7150000,7600000,9600000,
			]
		},
		{
		  name: "Total Thermal supply emissions",
		  data: [null, null, null, null, null, null, null, 5765081.433 ,5155504,4259110.416,3358887.776,3903192.612,4392579.81,4828281.75,4013798.831,5161578.206,5509966.362,5930968.149,6401758.725,6904750.822,7247747.573,7315078.74,6331858.611,5745183.591,6746761.633,7489112.31,8803328.438,11250858.37,11629049.04,15012228.37,
			]
  
  
		}
	  ],
	  categories: [
		1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
		2016, 2017, 2018, 2019, 2020, 2021, 2022,
	  ]
}
export const uniqueVisitorsDataDay3 = {
	series: [
		{
		  name: "Thermal Emissions due to DFO & LCO",
		  data: [184140.4 ,231265.72,158971.48,16705.56,104143.56,322937.68,1264356.52,1105701.96,496263.28,1098808,2127943,1712375.76,530338.64,1045085.88,2754534.12,2848287.72,1916225.24,2936988.84,4984202.36,2112126.64,1998987.486,2838394.49,4732948.675,1716733.234,1607923.816,2892806.194,3700716.347,3534615.744,5190068.911,6162927.907,
			
			]
		},
		{
		  name: "Actual Thermal Emissions",
		  data: [184140.4 ,231265.72,158971.48,16705.56,104143.56,322937.68,1264356.52,1105701.96,496263.28,1095149.4,2123078,1712375.76,530338.64,1045085.88,2754534.12,2848287.72,1912457.04,2639474.84,4275410.56,1782550.04,1755602.35,2268842.437,3572230.783,1358223.589,1250452.965,2142192.893,2733882.262,2615031.961,3826487.874,4549550.14,
			
			]
  
  
		}
	  ],
	  categories: [
		1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
		2016, 2017, 2018, 2019, 2020, 2021, 2022,
	  ]
}

export const uniqueVisitorsDataWeek = {
	series: [
	  {
			name: "Session Duration",
			data: [45, 52, 38, 24, 33, 26, 21]
	  },
	  {
			name: "Page Views",
			data: [35, 41, 62, 42, 13, 18, 29]
	  }
	],
	categories:[
	  '01 Jan', 
	  '02 Jan', 
	  '03 Jan', 
	  '04 Jan', 
	  '05 Jan', 
	  '06 Jan', 
	  '07 Jan'
	]
}

export const uniqueVisitorsDataMonth = {
	series: [
	  {
			name: "Session Duration",
			data: [35, 41, 62, 42, 13, 18, 29, 25, 31, 15]
	  },
	  {
			name: "Page Views",
			data: [45, 52, 38, 24, 33, 26, 21, 15, 20, 16]
	  }
	],
	categories:[
		'03 Jan', 
		'06 Jan', 
		'09 Jan', 
		'12 Jan', 
		'15 Jan',
		'18 Jan',
		'21 Jan',
		'24 Jan',
		'27 Jan',
		'30 Jan'
	]
}
