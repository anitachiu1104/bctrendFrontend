
export let echart = {
    bar: (data, echartSetting) => {
        console.log("bar", data)
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
                right: '0',
                bottom: '0',
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
                max: data.max,
                min: data.min
            },
            dataZoom: [{
                type: 'slider',
                // 数据窗口范围的起始百分比
                start: 0,
                // 数据窗口范围的结束百分比
                end: 600/data.xAxis.length,
                zoomLock: true
            }],
            series: [
                {
                    data: data.series,
                    type: 'bar',
                    barWidth: echartSetting.barWidth
                }
            ]
        }

    },
    line: (data,series,echartSetting) => {
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
                    let params_0 = params[0],
                        params_1 = params[1];
                    return '<div style="width: 217px"><div style="margin-bottom:16px">'+data.realDate[params_0.dataIndex] + '</div>' +
                        '<div style="display:flex;align-items:center;margin-bottom:14px" >'+'<div style="background:'+params_0.color+';height: 20px;width:20px;border-radius:50%;margin-right:10px"></div>'+params_0.seriesName  + ' Holders：' + params_0.data + '</div>' +
                        '<div style="display:flex;align-items:center;margin-bottom:14px" >'+'<div style="background:'+params_1.color+';height: 20px;width:20px;border-radius:50%;margin-right:10px"></div>'+params_1.seriesName  + ' Holders：' + params_1.data + '</div>' +
                        '</div>'
                }
            },
            grid: {
                left: '0',
                right: '0',
                bottom: '0',
                top: '30',
                containLabel: true
            },
            dataZoom: [{
                type: 'slider',
                show: data.xAxis.length<15?false:true,
                // 数据窗口范围的起始百分比
                start: 0,
                // 数据窗口范围的结束百分比
                end: data.xAxis.length<15?0:50,
                zoomLock: true
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
                data: ['GMT', 'GST']
            },
            series: series
        }
    }

}



