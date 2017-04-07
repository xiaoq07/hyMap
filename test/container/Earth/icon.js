'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class icon extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //mapName  格式：undefined|(string|string|string) 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
            //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。
            drillDown: true, //是否开启区域点击下钻功能。
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [3, 20], //滚轮缩放的边界
            itemStyle: '', //地图上每块区域的样式
            selectedMode: '', //地图区域的选中模式
            theme: 'dark', //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };
        const series = [];
        fetch('../test/data/car_2012.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                obj.geoCoord = [obj.lon, obj.lat];

            });

            options.series.push({
                id: 3,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                type: 'point',
                symbol: 'icon:test/data/jingli-1.png',
                symbolSize: [25, 25],
                symbolStyle: {
                    'normal': {
                        symbolSize: [70, 15],
                        fillColor: 'rgb(140,0,140)',
                        strokeWitdh: 1,
                        strokeColor: 'rbg(140,0,140)'
                    },
                    'emphasis': {
                        strokeWitdh: 2,
                        symbolSize: [30, 45]
                    }
                },
                label: {
                    'normal': {
                        show: false,
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }
                    }
                },
                showPopup: false //显示气泡框
            });
            obj.setOption(options);


            obj.setTooltip({
                show: false,
                trigger: ['item'], // item、map  ['item', 'geo']
                triggeron: 'click', //'click', // click, mouseover, mousemove, dblclick , ['click'],
                enterable: true, //true 鼠标是否可进入浮出泡泡框中
                style: {
                    'border-color': '#cc0',
                    'border-radius': '5',
                    'border-width': '2',
                    'border-style': 'solid',
                    'width': '80',
                    'height': '30'
                },
                formatter: function(param) { //div内的内容

                    return param.dataIndex + ': ' + param.value;

                },
                position: function() { //相对于当前事件点的位置

                    return [0, 0];
                    // return [20, 10];

                }
            });

        });

        obj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });

        obj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);


        });
        obj.on('click', function(data) {

            console.log('getdata:', data);

        });

        obj.on('unClick', function(data) {

            console.log('getundata:', data);


        });

        //选中
        document.getElementById('select').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'click',
                id: 1
            });

        });
        //取消选中
        document.getElementById('unselect').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'unClick',
                id: 1
            });

        });

        //筛选
        document.getElementById('filter').addEventListener('click', () => {

            //获取value=4468的feature
            //
            console.log(obj.map.getLayers());
            const feature = obj.getFeaturesByProperty('value', 4468);
            console.log(feature);
            const xy = feature[0].properties.geoCoord;
            //对feature触发click
            obj.dispatchAction({
                type: 'click',
                id: feature[0].properties.id
            });

            console.log(obj.getPixelFromCoords(xy));

        });


        document.getElementById('remove').addEventListener('click', () => {

            obj.removeLayer(5);
            // obj.removeSeries(); //清空所有
            // obj.removeSeries('id');//清空单个
            // obj.removeSeries(['id','id1']);//清空多个

        });

        document.getElementById('add').addEventListener('click', () => {

            obj.addLayer({
                id: 5,
                series: series
            });

        });

        document.getElementById('showlayer').addEventListener('click', () => {

            obj.showLayer(5);

        });
        document.getElementById('hidelayer').addEventListener('click', () => {

            obj.hideLayer(5);

        });
        document.getElementById('return').addEventListener('click', () => {

            obj.geoGoBack();

        });

    }

    render() {

        return (<div>
            <input id='select' type='button' value='选中'/>
            <input id='unselect' type='button' value='取消选中' />
              <input id='filter' type='button' value='筛选' />
            <input id='remove' type='button' value='移除数据' />
            <input id='add' type='button' value='增加数据'/>
            <input id='showlayer' type='button' value='显示数据' />
            <input id='hidelayer' type='button' value='隐藏数据'/>
             <input id='return' type='button' value='返回'/>
            <div id = 'map' /> 
            </div>);

    }
}
export default icon;