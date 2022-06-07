import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {echart} from '@/components/echartStyle'
import * as echarts from 'echarts'; 
class EchartComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 1 };

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.status !== nextProps.status) {
      return true;
    }
    return false;
  }

  componentDidMount() {
  }

  downloadPic = e => {
    console.log(this.echarts_react)
    let echarts_instance = this.echarts_react.getEchartsInstance();
    let picInfo = echarts_instance.getDataURL({
      type: 'png',
      backgroundColor: '#fff'
    });
    const elink = document.createElement('a');
    elink.download = "";
    elink.style.display = 'none';
    elink.href = picInfo;
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink)
  }


  getOption(data) {
    console.log(data)
    let { echartSetting } = this.props
 
    if(echartSetting.type ==='bar') {
      return echart[echartSetting.type](data,echartSetting)
    } else {
      let series=[]
      echartSetting.typelist.map((item,index)=>{
        series.push({
            name: item,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: echartSetting[item].startColor
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: echartSetting[item].startColor
                  },
                  {
                    offset: 1,
                    color: echartSetting[item].endColor
                  }
                ])
            },
            data: data[item]
        }) 
      })
      return echart[echartSetting.type](data,series,echartSetting)
    }
  
  }

  onChartClick(param, echarts) {
    console.log(param)
  }

  render() {
    let onEvents = {
      'click': this.onChartClick.bind(this)
    }
    let { data, echartSetting } = this.props;

    return (
      <ReactEcharts
        ref={e => { this.echarts_react = e; }}
        option={this.getOption(data)}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{ width: '100%', height: echartSetting.height + 'px' }}
      />
    );

  }
}

export default EchartComp;