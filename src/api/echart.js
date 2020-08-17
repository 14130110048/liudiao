import echarts from 'echarts';

export function formNum(_data) {
    let XData = [];
    let name = [];
    let YData = new Array();
    for (let i = 0; i < _data.length; i++) {
        XData.push(_data[i].displayDate);
        for (let j = 0; j < _data[i].stattisticsResult.length; j++) {
            if (i == 0) {
                name.push(_data[0].stattisticsResult[j].itemName);
                // YData[j].push(_data[0].stattisticsResult[j].display)
                YData[j] = [_data[i].stattisticsResult[j].display];
            } else {
                YData[j].push(_data[i].stattisticsResult[j].display)
            }
        }
    }
    let _series = [];
    let _color1 = ["rgba(186,226,249,0.6)", "rgba(233,173,96,0.5)", "rgba(141,225,86,0.6)", "rgba(126,124,243,0.6)", "rgba(246,132,135,0.6)", "rgba(179,223,248,0.6)", "rgba(225,225,8,0.6)", "rgba(239,113,84,0.6)"];
    let _color2 = ["#ffd56e", "#ffd56e", "#ffd56e", "#ffd56e", "#ffd56e", "#ffd56e", "#ffd56e", "#ffd56e"];
    for (let k = 0; k < name.length; k++) {
        let series = {
            name: name[k],
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: _color1[k]
                }
            },
            areaStyle: {
                normal: {
                    color: _color1[k]
                }
            },
            data: YData[k],
        }
        _series.push(series)
    }

    var option = {
        legend: {
            // data: ['aa', 'bb'],
            align: 'right',
            x: 'right'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: XData,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#6ba1bb',
                    fontSize: 12,
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#0a2b52',
                    width: 0.5, //这里是为了突出显示加上的
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                onZero: false,
                show: false,
                lineStyle: {
                    color: '#0a2b52',
                    width: 1, //这里是为了突出显示加上的
                }
            },

            axisLabel: {
                show: true,
                textStyle: {
                    color: '#6ba1bb' //字体颜色
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }

            },
        }],
        series: _series
    };
    return option;
}

export function formTime(_data) {
    let XData = [];
    let _name = [];
    let YData = new Array();
    for (let i = 0; i < _data.length; i++) {
        XData.push(_data[i].displayDate);
        for (let j = 0; j < _data[i].results.length; j++) {
            if (i == 0) {
                _name.push(_data[0].results[j].formName);
                // YData[j].push(_data[0].stattisticsResult[j].display)
                YData[j] = [_data[i].results[j].avgTime];
            } else {
                YData[j].push(_data[i].results[j].avgTime)
            }
        }
    }
    let _series = [];
    let _color = ["#7ea4f3", "#5be6ff", "#8de156"];
    for (let k = 0; k < _name.length; k++) {
        let series = {
            name: _name[k],
            type: 'bar',
            data: YData[k],
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
                normal: {
                    color: _color[k],
                    opacity: 1,
                }
            }
        };
        _series.push(series);
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            align: 'right',
            right: 10,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 35
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: XData,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#063374",
                    width: 1,
                    type: "solid"
                }
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#00c7ff",
                }
            },
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "dashed"
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }

            },
        }],
        series: _series
    };
    return option;
}

export function sendStatic(data1,data2){
let XData=["送检","未送检"];
var option = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        // orient: 'vertical',
        left: 'right',
        data:XData,
        right:20
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: [
                {value: data1, name: XData[0]},
                {value: data2, name: XData[1]}
            ],
            label:{
                formatter: '{b}: {c}'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
            }
        }
    ]
};
return option;
}