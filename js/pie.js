export default class PieChart {
    constructor() {
        var chartDom = document.getElementById('forliftChart');
        var myChart = echarts.init(chartDom, 'dark');
        var option = {
            backgroundColor: '',
            grid: {
                top: '5%',
                containLabel: true
            },
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                { value: 335, name: 'Empty' },
                { value: 310, name: 'Occupied' },
                { value: 274, name: 'Long-term' },
                { value: 235, name: 'Short-term' },
                ].sort(function (a, b) {
                return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    fontSize: 8,
                    fontFamily: 'Michroma'
                },
                labelLine: {
                smooth: 0.2,
                length: 10,
                length2: 20
                },
                itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                return Math.random() * 200;
                }
            }
            ]
        };

        option && myChart.setOption(option);
    }
}