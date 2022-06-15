import React, { useRef } from 'react';
import ReactDom from 'react-dom';
import banner from '../../static/image/banner.png';
import camera from '../../static/image/camera.png';
import '../../static/css/common.css';
import styl from './index.scss';
import EchartComp from '../../components/echartComp';
import { home } from '@/http/index'
import { dateTimeFormat } from '@/utils/common'
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      left: 0,
      width: 0,
      menuAcInd1: 0,
      menu1: ['Dashboard', 'NFT Price-performance'],
      menuAcInd2: 0,
      menu2: ['GM', 'GS'],
      timeRange: null,
      dateRangeList: ['1D', '7D', '1M', '3M', 'ALL'],
      net_inflow_status: null,
      inflow_sol_status: null,
      inflow_gst_status: null,
      inflow_gmt_status: null,
      googlesearch_status: null,
      holders_status: null,
      telestepn_status: null,
      net_inflow_setting: { type: 'bar', barWidth: 100, height: 330 },
      inflow_setting: { type: 'bar', barWidth: 38, height: 230 },
      holders_setting: { type: 'multi', height: 420, doSize: '20px', typelist: [{ name: 'GMT', type: 'line', startColor: '#81FCCD', endColor: 'rgba(96, 255, 132, 0)', areaStyle: true }, { name: 'GST', type: 'line', startColor: '#58CFFF', endColor: 'rgba(88, 207, 255, 0)', areaStyle: true }] },
      traffic_setting: { type: 'multi', barWidth: 38, height: 400, doSize: '10px', typelist: [{ name: 'IP', type: 'bar', startColor: '#58CFFF' }, { name: 'PV', type: 'bar', startColor: '#84FCCC' }, { name: 'USERS', type: 'line', startColor: '#F8C05E' }] },
      googlesearch_setting: { type: 'bar', barWidth: 38, height: 230 },
      social_media_setting: { type: 'multi', height: 420, doSize: '20px', typelist: [{ name: 'Twitter', type: 'line', startColor: '#58CFFF', endColor: 'rgba(88, 207, 255, 0)' }, { name: 'Discord', type: 'line', startColor: '#81FCCD', endColor: 'rgba(96, 255, 132, 0)' }, { name: 'Telegram', type: 'line', startColor: '#F8C05E', endColor: 'rgba(96, 255, 132, 0)' }] },
      net_inflow_wid: 100,
      inflow_item_wid: 38,
      allStepnFlowData: null,
      stepnPriceMarketcapData: null,
      net_flow_json: {
        inflow_sol: { ind: 0, min: null, max: null, series: [], xAxis: [], realDate: [] },
        inflow_gst: { ind: 2, min: null, max: null, series: [], xAxis: [], realDate: [] },
        inflow_gmt: { ind: 4, min: null, max: null, series: [], xAxis: [], realDate: [] },
        inflow_net: { min: null, series: [], xAxis: [], realDate: [] }
      },
      traffic_json: {
        IP: [],
        PV: [],
        USERS: [],
        xAxis: [],
        realDate: []
      },
      googlesearch_json: { min: null, series: [], xAxis: [], realDate: [] },
      social_media_json: {
        Twitter: [],
        Discord: [],
        Telegram: [],
        xAxis: [],
        realDate: []
      },
      inflowList: [{ title: 'Inflow Of SOL', type: 'inflow_sol' }, { title: 'Inflow Of GST', type: 'inflow_gst' }, { title: 'Inflow Of GMT', type: 'inflow_gmt' }],
      marketcap: {
        SOL: {}, // 后面加入yyyy-mm-dd_hh-mm为key的价格
        GST: {},
        GMT: {},
      },
      defaultIndex: 4,
      holders_json: {
        GST: [],
        GMT: [],
        xAxis: [],
        realDate: []
      },
      Price: '',
      MarketCap: '',
      Holders: '',
      Price_rate: '',
      MarketCap_rate: '',
      Holders_rate: '',
      Price_rate_GST: '',
      MarketCap_rate_GST: '',
      Price_GST: '',
      MarketCap_GST: '',
      GM_Holders: '',
      GS_Holders: '',
      Twitter_value:'', 
      Twitter_rate:'',
      Discord_value:'',
      Discord_rate:'',
      Telegram_value:'',
      Telegram_rate:'',
      PV_rate:'',
      IP_rate:''
    }
    this.net_inflow_ref = React.createRef()
    this.inflow_sol_ref = React.createRef()
    this.inflow_gst_ref = React.createRef()
    this.inflow_gmt_ref = React.createRef()
    this.holders_ref = React.createRef()
    this.traffic_ref = React.createRef()
    this.googlesearch_ref = React.createRef()
  }

  componentDidMount() {
    let { defaultIndex } = this.state;
    let days = this.getDays(defaultIndex)
    let dateRange = this.getTime(days)
    this.netFlowShow(dateRange, defaultIndex);
    this.stepnHolders(dateRange, defaultIndex);
    this.stepn(dateRange, defaultIndex);
    this.socialMedia(dateRange, defaultIndex)
    this.setState({ width: this.refs["menu0"].clientWidth });
  }

  async socialMedia(dateRange, defaultIndex) {
    let { social_media_json } = this.state
    Object.keys(social_media_json).forEach(item => {
      social_media_json[item] = []
    })
    this.telestepn(dateRange, defaultIndex)
    this.getTwitter(dateRange, defaultIndex)
  }


  async telestepn(dateRange, defaultIndex) {
    let { social_media_json } = this.state;
    let res = await home.telestepn()
    if (!(res && res.data)) return
    let arr = res.data;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let dateItem = item[3];
      let itemTime = new Date(dateItem);
      if (dateRange.endTime && +itemTime > dateRange.endTime) break;
      if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
        social_media_json.Telegram.push(item[1])
      }
    }
    let Telegram_value = arr[arr.length-1][1],
        Telegram_rate = ((Telegram_value-arr[arr.length-2][1])/arr[arr.length-2][1])*100;
        Telegram_rate = Math.round(Telegram_rate*100)/100;
    this.setState({ social_media_json, telestepn_status: defaultIndex,Telegram_value,Telegram_rate })
  }

  async getTwitter(dateRange, defaultIndex) {
    let { social_media_json } = this.state;
    let res = await home.getTwitter()
    if (!(res && res.data)) return
    let arr = []
    Object.keys(res.data).forEach(item => {
      arr = [...arr, { date: item, value: res.data[item] }]
    })

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let dateItem = item['date'].replace(/(\d{4})-*(\d{2})-*(\d{2})/, '$1-$2-$3 23:59:59');
      let itemTime = new Date(+new Date(dateItem));
      if (dateRange.endTime && +itemTime > dateRange.endTime) break;
      if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
        social_media_json.Twitter.push(item['value'])
        social_media_json.xAxis.push(item['date'])
        social_media_json.realDate.push(item['date'])
      }
    }
    let Twitter_value = arr[arr.length-1]['value'],
    Twitter_rate =(Twitter_value - arr[arr.length-2]['value'])/arr[arr.length-2]['value']*100;
    Twitter_rate = Math.round(Twitter_rate*100)/100
    this.setState({ social_media_json, social_media_status: defaultIndex,Twitter_rate, Twitter_value})
  }

  async stepn(dateRange, defaultIndex) {
    let { traffic_json } = this.state
    let res = await home.stepn()
    if (res && res.data) {
      for (let i in traffic_json) {
        traffic_json[i] = []
      }
      for (let i = 0; i < res.data.length; i++) {
        let item = res.data[i];
        let dateItem = item[0].replace(/(\d{4})-*(\d{2})-*(\d{2})/, '$1-$2-$3 23:59:59');
        let itemTime = new Date(+new Date(dateItem));
        if (dateRange.endTime && +itemTime > dateRange.endTime) break;
        if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
          traffic_json.IP.push(item[1])
          traffic_json.PV.push(item[2])
          traffic_json.USERS.push(item[3])
          traffic_json.realDate.push(dateItem)
          traffic_json.xAxis.push(dateTimeFormat(dateItem)['month_day'])
        }
      }
    }
    let _data = res.data;
    let IP = _data[_data.length-1][1],
    PV = _data[_data.length-1][2],
    PV_rate = (PV-_data[_data.length-2][2])/_data[_data.length-2][2]*100,
    IP_rate = (IP-_data[_data.length-2][1])/_data[_data.length-2][1]*100;
    PV = Math.round(PV*100)/100;
    PV_rate = Math.round(PV_rate*100)/100;
    IP_rate = Math.round(IP_rate*100)/100;
    this.setState({ traffic_status: defaultIndex, traffic_json,IP,PV, PV_rate,IP_rate })
  }

  async netFlowShow(dateRange, defaultIndex) {
    let netFlowJson = await this.stepnFlow(dateRange);
    await this.netFlow(dateRange, netFlowJson, defaultIndex)
  }
  checkIsOverDate(latestData) {
    return +new Date() - (+new Date(latestData) - 8 * 60 * 60 * 1000) >= 59 * 60 * 1000
  }

  async stepnHolders(dateRange, index) {
    let { holders_json } = this.state;
    let res = await home.stepn_holders()
    for (let i in holders_json) {
      holders_json[i] = []
    }
    if (res && res.data) {
      let Holders = this.getDataForColumn('Holders', res.data)
      let _GM_Holders = (Holders['GM_Holders'][0] - Holders['GM_Holders'][1])/Holders['GM_Holders'][1]*100,
          _GS_Holders = (Holders['GS_Holders'][0] - Holders['GS_Holders'][1])/Holders['GS_Holders'][1]*100,
          GM_Holders = Number(Math.round(_GM_Holders*100)/100),
          GS_Holders = Number(Math.round(_GS_Holders*100)/100);
      for (let i = 0; i < res.data.length; i++) {
        let item = res.data[i];
        let itemTime = new Date(+new Date(item[4]) - 8 * 60 * 60 * 1000);
        if (dateRange.endTime && +itemTime > dateRange.endTime) break;
        if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
          holders_json.GST.push(item[0])
          holders_json.GMT.push(item[2])
          let _dateTimeFormat = dateTimeFormat(itemTime)
          holders_json.xAxis.push(_dateTimeFormat['minute_second'])
          holders_json.realDate.push(_dateTimeFormat['full'])
        }
      }
      this.setState({ holders_json, holders_status: index,GM_Holders,GS_Holders, Holders_GM_value:Holders['GM_Holders'][0], Holders_GS_value:Holders['GS_Holders'][0]})
    }

  }
  async getStepnFlowData() {
    let { allStepnFlowData } = this.state
    if (!allStepnFlowData || this.checkIsOverDate(allStepnFlowData[allStepnFlowData.length - 1][6])) {
      let res = await home.stepnFlow()
      this.setState({ allStepnFlowData: res.data })
      return res.data
    } else {
      return allStepnFlowData
    }

  }

  async stepnFlow(dateRange, type, timeIndex, isReturn) {
    let { net_flow_json, defaultIndex } = this.state;
    let res = await this.getStepnFlowData();
    if (!res) return;
    let inflow_sol_ind = net_flow_json.inflow_sol.ind,
      inflow_gst_ind = net_flow_json.inflow_gst.ind,
      inflow_gmt_ind = net_flow_json.inflow_gmt.ind;

    let dateList = []
    let realDateList = []
    let ind;
    if (!type || isReturn) {
      Object.keys(net_flow_json).map(e => {
        net_flow_json[e]['series'] = []
      })
    } else {
      net_flow_json[type]['series'] = []
      ind = net_flow_json[type]['ind']
    }

    for (let i = 0; i < res.length; i++) {
      let item = res[i];
      let itemTime = new Date(+new Date(item[6]) - 8 * 60 * 60 * 1000);
      if (dateRange.endTime && +itemTime > dateRange.endTime) break;
      if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
        if (!type || isReturn) {
          net_flow_json.inflow_sol['series'].push(Number(item[inflow_sol_ind]))
          net_flow_json.inflow_gst['series'].push(Number(item[inflow_gst_ind]))
          net_flow_json.inflow_gmt['series'].push(Number(item[inflow_gmt_ind]))
          this.getCompData(net_flow_json, 'inflow_sol', Number(item[inflow_sol_ind]))
          this.getCompData(net_flow_json, 'inflow_gst', Number(item[inflow_gst_ind]))
          this.getCompData(net_flow_json, 'inflow_gmt', Number(item[inflow_gmt_ind]))
        } else {
          net_flow_json[type]['series'].push(Number(item[ind]))
          this.getCompData(net_flow_json, type, Number(item[ind]))
        }
        let _dateTimeFormat = dateTimeFormat(itemTime)
        dateList = [...dateList, _dateTimeFormat['month_day']];
        realDateList = [...realDateList, _dateTimeFormat['full']]
      }
    }
    if (!type || isReturn) {
      Object.keys(net_flow_json).map(e => {
        net_flow_json[e]['realDate'] = realDateList
        net_flow_json[e]['xAxis'] = dateList
        if (!isReturn) {
          net_flow_json[e]['min'] = this.numFormat(net_flow_json[e]['min'], 'min')
          net_flow_json[e]['max'] = this.numFormat(net_flow_json[e]['max'], 'max')
          this.setState({ [e + '_status']: defaultIndex })
        }
      })
    } else {
      net_flow_json[type]['realDate'] = realDateList
      net_flow_json[type]['xAxis'] = dateList
      net_flow_json[type]['min'] = this.numFormat(net_flow_json[type]['min'], 'min')
      net_flow_json[type]['max'] = this.numFormat(net_flow_json[type]['max'], 'max')
      this.setState({ [type + '_status']: timeIndex })
    }
    if (!isReturn) {
      this.setState({ net_flow_json })
    }
    return net_flow_json
  }

  getDataForColumn(column, data) {
    let k = 0
    let returnData = { Price: [], MarketCap: [], GM_Holders: [], GS_Holders: [] }, yesterDayTime;
    for (let i = data.length - 1; i > 0; i--) {
      if (['GMT', 'GST'].includes(column) && data[i][0] === column) {
        if (k === 0) {
          returnData['Price'].push(data[i][1]);
          returnData['MarketCap'].push(data[i][1]);
          yesterDayTime = dateTimeFormat(new Date(+new Date(data[i][5]) - 24 * 60 * 60 * 1000))['full'].replace(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:)\d{2}/,'$1');
          yesterDayTime = new RegExp(yesterDayTime) 
          k++
        } else if (yesterDayTime.test(data[i][5])) {
          returnData['Price'].push(data[i][1]);
          returnData['MarketCap'].push(data[i][1]);
          break;
        }
      } else if (['Holders'].includes(column)) {
        if (k === 0) {
          returnData['GM_Holders'].push(data[i][2]);
          returnData['GS_Holders'].push(data[i][0]);
          k++      
        } else if (k===1) {
          returnData['GM_Holders'].push(data[i][2]);
          returnData['GS_Holders'].push(data[i][0]);
          break;
        }
      }
    }
    return returnData
  }

  async netFlow(dateRange, net_flow_json, timeIndex) {
    let { allStepnFlowData, stepnPriceMarketcapData } = this.state
    let isOverDate = this.checkIsOverDate(allStepnFlowData[allStepnFlowData.length - 1][6])
    let res, Price_rate, MarketCap_rate, Price, MarketCap, Price_rate_GST, MarketCap_rate_GST, Price_GST, MarketCap_GST,returnData,returnData_GST;
    if (!stepnPriceMarketcapData || isOverDate) {
      res = await home.stepnPriceMarketcap()
      if (res && res.data.length) {
        returnData = this.getDataForColumn('GMT', res.data),
        Price_rate = (returnData['Price'][0] - returnData['Price'][1]) / returnData['Price'][1] * 100,
        MarketCap_rate = (returnData['MarketCap'][0] - returnData['MarketCap'][1]) / returnData['MarketCap'][1] * 100,
        Price = returnData['Price'][0],
        MarketCap = returnData['MarketCap'][0];

        returnData_GST = this.getDataForColumn('GST', res.data),
        Price_rate_GST = (returnData_GST['Price'][0] - returnData_GST['Price'][1]) / returnData_GST['Price'][1] * 100,
        Price_GST = returnData_GST['Price'][0],
        MarketCap_rate_GST = (returnData_GST['MarketCap'][0] - returnData_GST['MarketCap'][1]) / returnData_GST['MarketCap'][1] * 100,
        MarketCap_GST = returnData_GST['MarketCap'][0];

        Price_rate = Number(Math.round(Price_rate*100)/100),
        MarketCap_rate = Number(Math.round(MarketCap_rate*100)/100);

        Price = Number(Math.round(Price*100)/100),
        MarketCap = Number(Math.round(MarketCap*100)/100);

        Price_rate_GST = Number(Math.round(Price_rate_GST*100)/100),
        Price_GST = Number(Math.round(Price_GST*100)/100);

        MarketCap_rate_GST = Number(Math.round(MarketCap_rate_GST*100)/100),
        MarketCap_GST = Number(Math.round(MarketCap_GST*100)/100);
      }
      this.setState({ stepnPriceMarketcapData: res, Price_rate, MarketCap_rate, Price, MarketCap, Price_rate_GST, MarketCap_rate_GST, Price_GST, MarketCap_GST })
    } else {
      res = stepnPriceMarketcapData
    }

    let { marketcap } = this.state
    for (let j in marketcap) {
      marketcap[j] = {}
    }

    for (let i = 0; i < res.data.length; i++) {
      let item = res.data[i];
      let itemTime = new Date(+new Date(item[5]));
      if (dateRange.endTime && +itemTime > dateRange.endTime) break;
      if (!dateRange.startTime || (dateRange.startTime && +itemTime > dateRange.startTime)) {
        let time = item[5].match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):\d{2}/)
        let key = time[1] + "_" + time[2] + "_" + (time[3] - time[3] % 5)
        if (!marketcap[item[0]][key]) {
          marketcap[item[0]][key] = item[1]
        }
      }
    }

    net_flow_json['inflow_net']['realDate'] = net_flow_json['inflow_sol']['realDate']
    net_flow_json['inflow_net']['xAxis'] = net_flow_json['inflow_sol']['xAxis']
    let realDate = net_flow_json['inflow_net']['realDate']
    let min, max;

    for (let i in realDate) {
      let realDateTime = realDate[i]
      let time = realDateTime.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):\d{2}/)
      let key = time[1] + "_" + time[2] + "_" + (time[3] - time[3] % 5)
      let val = 0;
      for (let j in marketcap) {
        if (marketcap[j][key]) {
          val += marketcap[j][key] * net_flow_json["inflow_" + j.toLowerCase()]['series'][i]
        } else {
          let minute = time[3] - time[3] % 5
          let key_pre = time[1] + "_" + time[2] + "_"
          if (minute + 5 <= 55 && marketcap[j][key_pre + (minute + 5)]) {
            key = key_pre + (minute + 5)
          } else if (minute - 5 >= 0 && marketcap[j][key + (minute - 5)]) {
            key = key_pre + (minute - 5)
          } else {
            continue;
          }
          val += marketcap[j][key] * net_flow_json["inflow_" + j.toLowerCase()]['series'][i]
        }
      }
      max === undefined ? (max = val) : (val > max ? max = val : null)
      min === undefined ? (min = val) : (val < min ? min = val : null)
      net_flow_json['inflow_net'].series.push(val)
    }
    net_flow_json['inflow_net']['min'] = this.numFormat(min, 'min')
    net_flow_json['inflow_net']['max'] = this.numFormat(max, 'max')
    this.setState({ net_inflow_status: timeIndex, net_flow_json })
  }

  numFormat(data, type) {
    let length = parseInt(data).toString().length
    if (type === 'min') {
      return Math.floor(data / (Math.pow(10, length - 1))) * (Math.pow(10, length - 1))
    } else {
      return Math.ceil(data / (Math.pow(10, length - 2))) * (Math.pow(10, length - 2))
    }
  }

  getTime(days) {
    return {
      endTime: days ? new Date().getTime() : null,
      startTime: days ? new Date().getTime() - days * 24 * 60 * 60 * 1000 : null
    };
  }

  getCompData(obj, dataType, compData) {
    obj[dataType]['min'] === null ? obj[dataType]['min'] = compData : compData < obj[dataType]['min'] ? obj[dataType]['min'] = compData : null
    obj[dataType]['max'] === null ? obj[dataType]['max'] = compData : compData > obj[dataType]['max'] ? obj[dataType]['max'] = compData : null
  }



  handleClick = (e, index, type) => {
    if (type === 'menu1') {
      let currMenu = this.refs["menu" + index];
      this.setState({ left: currMenu.offsetLeft, width: currMenu.clientWidth, menuAcInd1: index })
    } else if (type === 'menu2') {
      this.setState({ menuAcInd2: index })
    }

  }

  checkClick() {

    this.setState({ data: [1200, 1000, 2200, 800, 700, -1100, 130], timeRange: '1D' })
  }

  getDays(timeIndex) {
    let { dateRangeList } = this.state;
    let days = dateRangeList[timeIndex].match(/^(\d)+D/i)
    if (days && days[1]) {
      days = days[1]
    } else {
      days = dateRangeList[timeIndex].match(/^(\d)+M/i)
      if (days && days[1]) {
        days = days[1] * 30
      } else {
        days = dateRangeList[timeIndex].match(/ALL/i)
        days ? days = null : null
      }
    }
    return days
  }
  async changeDateRange(timeIndex, type) {
    let days = this.getDays(timeIndex)
    let dateRange = this.getTime(days)
    if (type === 'net_inflow') {
      let netFlowJson = await this.stepnFlow(dateRange, type, timeIndex, true);
      await this.netFlow(dateRange, netFlowJson, timeIndex)
    } else if (['inflow_sol', 'inflow_gst', 'inflow_gmt'].includes(type)) {
      this.stepnFlow(dateRange, type, timeIndex);
    } else if (type === 'holders') {
      this.stepnHolders(dateRange, timeIndex)
    } else if (type === 'traffic') {
      this.stepn(dateRange, timeIndex)
    } else if (type === 'socialMedia') {
      this.socialMedia(dateRange, timeIndex)
    }

  }

  showPop(){

  }

  download = (type) => {
    this[type + "_ref"].current.downloadPic();
  }

  render() {
    let { net_flow_json, holders_json,
      left, width, menu1, menuAcInd1, menuAcInd2, menu2, timeRange, data, dateRangeList,
      net_inflow_status, holders_status, social_media_status,
      net_inflow_setting, inflow_setting, holders_setting,
      traffic_status, googlesearch_status,
      traffic_json, googlesearch_json, social_media_json,
      traffic_setting, googlesearch_setting, social_media_setting,
      inflowList,
      Price, Price_rate,
      MarketCap, MarketCap_rate,
      Holders_GM_value, Holders_GS_value,
      Price_GST, Price_rate_GST,
      MarketCap_GST, MarketCap_rate_GST,
      GM_Holders, GS_Holders,
      Twitter_value,Twitter_rate,Discord_value,Discord_rate,Telegram_value,Telegram_rate,
      IP,IP_rate,PV,PV_rate,
      marketcap
    } = this.state;
    let ss = { type: 'test', height: 420, doSize: '20px', typelist: [{ name: 'Twitter', type: 'line', startColor: '#58CFFF', endColor: 'rgba(88, 207, 255, 0)', areaStyle: true }, { name: 'Discord', type: 'line', startColor: '#81FCCD', endColor: 'rgba(96, 255, 132, 0)', areaStyle: true }, { name: 'Telegram', type: 'line', startColor: '#F8C05E', endColor: 'rgba(96, 255, 132, 0)', areaStyle: true }] }
    return (
      <div className={styl.home}>
        <div className={styl.cont}>
          <div className={styl.banner}><img src={banner} alt="" /></div>
          <div className={styl.mainCont}>
            <ul className={styl.menu} ref="menu" >
              {menu1.map((item, index) => {
                return <li
                  key={index}
                  ref={"menu" + index}
                  className={menuAcInd1 === index ? styl.active : ""}
                  onClick={e => this.handleClick(e, index, 'menu1')}>
                  {item}
                </li>
              })}
              <div className={styl.line} style={{ left, width }} />
            </ul>
            <div className={styl.flexSpaceBetween}>
              <div className={styl.databox}>
                <div className={styl.dataTitle}>
                  {menu2.map((item, index) => {
                    return <div className={menuAcInd2 === index ? styl.menuActive2 : null} key={index} onClick={e => this.handleClick(e, index, 'menu2')} >{item}</div>
                  })}
                </div>
                {menuAcInd2 === 0 ? <ul className={styl.databoxCont}>
                  <li><div>Price</div><div>${Price}</div><div>+{Price_rate}%</div></li>
                  <li><div>Market Cap</div><div>${MarketCap}</div><div>+{MarketCap_rate}%</div></li>
                  <li><div>Holders</div><div>${Holders_GM_value}</div><div>+{GM_Holders}%</div></li>
                </ul> :
                  <ul className={styl.databoxCont} >
                    <li><div>Price</div><div>${Price_GST}</div><div>+{Price_rate_GST}%</div></li>
                    <li><div>Market Cap</div><div>${MarketCap_GST}</div><div>+{MarketCap_rate_GST}%</div></li>
                    <li><div>Holders</div><div>${Holders_GS_value}</div><div>+{GS_Holders}%</div></li>
                  </ul>}
              </div>

              <div className={styl.databox}>
                <div className={styl.dataTitle}>
                  Social Media Followers
                </div>
                <ul className={styl.databoxCont}>
                  <li><div>Twitter</div><div>${Twitter_value}</div><div>+{Twitter_rate}%</div></li>
                  <li><div>Discord</div><div>${Discord_value}</div><div>+{Discord_rate}%</div></li>
                  <li><div>Telegram</div><div>${Telegram_value}</div><div>+{Telegram_rate}%</div></li>
                </ul>
              </div>
              <div className={styl.databox}>
                <div className={styl.dataTitle}>
                  Users
                </div>
                <ul className={styl.databoxCont}>
                  <li><div>IP</div><div>${IP}</div><div>+{IP_rate}%</div></li>
                  <li><div>PV</div><div>${PV}</div><div>+{PV_rate}%</div></li>
                  <li><div>Users</div><div>5,457</div><div>+6.21%</div></li>
                </ul>

              </div>
            </div>

            <div className={styl.net_inflow}>
              <div className={styl.sectionCont}>
                <div className={styl.topSetting}>
                  <div onClick={e => this.download("net_inflow")} className={styl.sectionTitle}>Net Inflow<img src={camera} /></div>
                  <ul className={styl.dateRange}>
                    {dateRangeList.map((item, index) => {
                      return <li key={index} onClick={e => this.changeDateRange(index, 'net_inflow')} className={net_inflow_status === index ? styl.dateRangeAc : ''}>{item}</li>
                    })}
                  </ul>
                </div>
                <EchartComp ref={this.net_inflow_ref} status={net_inflow_status} data={net_flow_json.inflow_net} echartSetting={net_inflow_setting} ></EchartComp>
              </div>
            </div>

            <div className={styl.inflow_all}>
              {inflowList.map((item, index) => {
                return <div key={index} className={styl.inflow_item}>
                  <div className={styl.sectionCont}>
                    <div className={styl.topSetting}>
                      <div className={styl.sectionTitle} onClick={e=>this.showPop()}>{item.title}<img src={camera} onClick={e => this.download(item.type)} /></div>

                      <ul className={styl.dateRange}>
                        {dateRangeList.map((dateItem, dateIndex) => {
                          return <li key={dateIndex} onClick={e => this.changeDateRange(dateIndex, item.type)} className={this.state[item.type + '_status'] === dateIndex ? styl.dateRangeAc : ''}>{dateItem}</li>
                        })}

                      </ul>
                    </div>
                    <EchartComp ref={this[item.type + '_ref']} status={this.state[item.type + '_status']} data={net_flow_json[item.type]} echartSetting={inflow_setting} ></EchartComp>
                  </div>
                </div>
              })}
            </div>
            <div className={styl.net_inflow}>
              <div className={styl.sectionCont}>
                <div className={styl.topSetting}>
                  <div onClick={e => this.download("holders")} className={styl.sectionTitle}>Holders<img src={camera} /></div>
                  <ul className={styl.dateRange}>
                    {dateRangeList.map((item, index) => {
                      return <li key={index} onClick={e => this.changeDateRange(index, 'holders')} className={holders_status === index ? styl.dateRangeAc : ''}>{item}</li>
                    })}

                  </ul>
                </div>
                <EchartComp ref={this.holders_ref} status={holders_status} data={holders_json} echartSetting={holders_setting} ></EchartComp>
              </div>
            </div>

            <div className={styl.doublemodule}>
              <div className={styl.net_inflow}>
                <div className={styl.sectionCont}>
                  <div className={styl.topSetting}>
                    <div onClick={e => this.download("holders")} className={styl.sectionTitle}>Traffic<img src={camera} /></div>
                    <ul className={styl.dateRange}>
                      {dateRangeList.map((item, index) => {
                        return <li key={index} onClick={e => this.changeDateRange(index, 'traffic')} className={traffic_status === index ? styl.dateRangeAc : ''}>{item}</li>
                      })}
                    </ul>
                  </div>
                  <EchartComp ref={this.traffic_ref} status={traffic_status} data={traffic_json} echartSetting={traffic_setting} ></EchartComp>
                </div>
              </div>
              <div className={styl.net_inflow}>
                <div className={styl.sectionCont}>
                  <div className={styl.topSetting}>
                    <div onClick={e => this.download("holders")} className={styl.sectionTitle}>Google Search<img src={camera} /></div>
                    <ul className={styl.dateRange}>
                      {dateRangeList.map((item, index) => {
                        return <li key={index} onClick={e => this.changeDateRange(index, 'googleSearch')} className={googlesearch_status === index ? styl.dateRangeAc : ''}>{item}</li>
                      })}
                    </ul>
                  </div>
                  <EchartComp ref={this.googlesearch_ref} status={googlesearch_status} data={googlesearch_json} echartSetting={googlesearch_setting}></EchartComp>
                </div>
              </div>
            </div>

            <div className={styl.net_inflow}>
              <div className={styl.sectionCont}>
                <div className={styl.topSetting}>
                  <div onClick={e => this.download("socialMedia")} className={styl.sectionTitle}>Social Media<img src={camera} /></div>
                  <ul className={styl.dateRange}>
                    {dateRangeList.map((item, index) => {
                      return <li key={index} onClick={e => this.changeDateRange(index, 'socialMedia')} className={social_media_status === index ? styl.dateRangeAc : ''}>{item}</li>
                    })}
                  </ul>
                </div>
                <EchartComp ref={this.social_media_ref} status={social_media_status} data={social_media_json} echartSetting={social_media_setting} ></EchartComp>
              </div>
            </div>

          </div>
        </div>
        <div>
          <div>Inflow Of Token</div>
          <div className={styl.inflow_item}>
                  <div className={styl.sectionCont}>
                    <div className={styl.topSetting}>
                      {Object.keys(marketcap).map((item,index)=>{
                        return <div key={index} className={styl.sectionTitle} onClick={e=>this.showPop()}>{item}<img src={camera} onClick={e => this.download(item.type)} /></div>
                      })}
                      <ul className={styl.dateRange}>
                        {dateRangeList.map((item, dateIndex) => {
                          return <li key={dateIndex} onClick={e => this.changeDateRange(dateIndex, item.type)} className={this.state[item.type + '_status'] === dateIndex ? styl.dateRangeAc : ''}>
                            {item}</li>
                        })}
                      </ul>
                    </div>
                    {/* <EchartComp ref={this[item.type + '_ref']} status={this.state[item.type + '_status']} data={net_flow_json[item.type]} echartSetting={inflow_setting} ></EchartComp> */}
                  </div>
            </div>
        </div>
      </div>
    );
  }
}

ReactDom.render(<Main />, document.getElementById('root'));
