import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { echart } from '@/components/echartStyle'
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
    
    let { echartSetting } = this.props
    if (echartSetting.type === 'bar') {
      return echart[echartSetting.type](data, echartSetting)
    } else if (echartSetting.type === 'multi') {
      let series = []
      echartSetting.typelist.map((item, index) => {
        console.log(data[item.name],item.name,data.xAxis)
        let series_json = {
          name: item.name,
          type: item.type,
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: item.startColor
          },
          data: data[item.name]
        }
        item.areaStyle ? (series_json['areaStyle'] = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: item.startColor
            },
            {
              offset: 1,
              color: item.endColor
            }
          ])
        }) : null
        series.push(series_json)
      })
      return echart[echartSetting.type](data, series, echartSetting)
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
        style={{ height: echartSetting.height + 'px' }}
      />
    );

  }
}

export default EchartComp;