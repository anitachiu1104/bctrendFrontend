
export let echart = {
    bar: (data, echartSetting) => {
        return {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.8)',
                textStyle: {
                    color: "#fff" //设置文字颜色
                },
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, index) {
                    params = params[0];
                    return data.realDate[params.dataIndex] + '<br>' +
                        '' + params.data + '<br>'
                }
            },
            grid: {
                left: '0',
                right: '10',
                bottom: '50',
                top: '30',
                containLabel: true
            },
            color: ['#84FCCC'],
            xAxis: {
                type: 'category',
                data: data.xAxis

            },
            yAxis: {
                type: 'value',
            },
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                }
            ],
            series: [
                {
                    data: data.series,
                    type: 'bar'
                }
            ]
        }

    },
    multi: (data, series, echartSetting) => {
        return {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(11, 14, 21, 0.7)',
                textStyle: {
                    color: "#fff" //设置文字颜色
                },
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, index) {
                    let str = '<div><div style="margin-bottom:16px">' + data.realDate[params[0].dataIndex] + '</div>';
                    params.map(item => {
                        str += '<div style="display:flex;align-items:center;margin-bottom:14px"><div style="background:' + item.color + ';height: '+echartSetting.doSize+';width:'+echartSetting.doSize+';border-radius:50%;margin-right:10px"></div>' + item.seriesName + ' Holders：' + item.data + '</div>'
                    })
                    str += '</div>'
                    return str
                }
            },
            grid: {
                left: '0',
                right: '10',
                bottom: '50',
                top: '30',
                containLabel: true
            },
            dataZoom: [{
                show: true,
                start: 0,
                end: 100
            },{
                type: 'inside',
                start: 0,
                end: 100
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.xAxis
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            legend: {
                data: echartSetting.typelist.map(e=>{
                    return e.name
                })
            },
            series: series
        }
    }

}



