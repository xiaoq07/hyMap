/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-27 19:59:57
 * @Email: zhangyujie3344521@163.com
 * @File Path: H:\work\hyMap\test\container\Earth\mapmethod.js
 * @File Name: mapmethod.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class mapmethod extends Component {
    componentDidMount() {

        let mapObj = map.init(document.getElementById('map'));
        let options = {
            serverUrl: 'http://192.168.0.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国|山东省', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [2, 12], //滚轮缩放的边界
            label: {
                'normal': {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                },
                'emphasis': {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                }
            },
            itemStyle: {
                'normal': {
                    strokeWidth: 2, //边框宽度
                    strokeColor: 'green', //边框颜色
                    fillColor: 'rgba(255,255,255,0.2)'
                },
                'emphasis': {
                    strokeWidth: 1, //边框宽度
                    fillColor: 'rgba(255,255,255,0.5)'
                }
            }, //地图上每块区域的样式
            regions: [{
                name: '济南市',
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: '#2a333d'
                    },
                    'emphasis': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'blue'
                    }
                },
                label: {
                    'normal': {
                        show: true,
                        textStyle: {
                            color: 'red'
                        }
                    },
                    'emphasis': {
                        show: true,
                        textStyle: {
                            color: '#B5FF91',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }

                    }
                }
            }], //  name: '',特殊区域的样式
            selectedMode: '', //地图区域的选中模式 single mulit
            theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
                mapId: 'zhangyujie.a80cdc83',
                key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            }, //地图风格
            series: []
        };
        mapObj.setOption(options);

        document.getElementById('hide').addEventListener('click', () => {

            mapObj.hide();

        });
        //选中
        document.getElementById('show').addEventListener('click', () => {

            mapObj.show();

        });

        document.getElementById('hidebase').addEventListener('click', () => {

            mapObj.hideBaseMap();

        });
        //选中
        document.getElementById('showbase').addEventListener('click', () => {

            mapObj.showBaseMap();

        });

        document.getElementById('hidegeo').addEventListener('click', () => {

            mapObj.hideGeo();

        });
        //选中
        document.getElementById('showgeo').addEventListener('click', () => {

            mapObj.showGeo();

        });
        //重庆
        document.getElementById('fly').addEventListener('click', () => {

            mapObj.flyto(
                [116.98514, 36.66443], {
                    zoom: 10
                });

        });
        //选中
        document.getElementById('flychina').addEventListener('click', () => {

            mapObj.flyto(
                [117, 36.20], {
                    zoom: 5
                });

        });
        //选中
        document.getElementById('changecq').addEventListener('click', () => {

            mapObj.setGeo({
                map: '中国|重庆市',
                center: [107.98613, 29.653439],
                zoom: 8,
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#111', //边框颜色
                        fillColor: '#323c48'
                    }
                }
            });


        });
        //选中
        document.getElementById('changesd').addEventListener('click', () => {

            mapObj.setGeo({
                map: '中国|山东省',
                center: [117, 36.20],
                zoom: 7
            });

        });

        Array.from(document.getElementsByClassName('theme')).forEach(function(element) {

            element.addEventListener('click', () => {

                mapObj.setTheme(element.id);

            });

        });
        document.getElementById('return').addEventListener('click', () => {

            mapObj.geoGoBack();

        });
        mapObj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });

        mapObj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);

        });



    }
    render() {

        return (<div>
                    <input id='hide' type='button' value='隐藏地图'/>
                    <input id='show' type='button' value='显示地图' />
                    <input id='hidebase' type='button' value='隐藏底图'/>
                    <input id='showbase' type='button' value='显示底图' />
                    <input id='hidegeo' type='button' value='隐藏边界'/>
                    <input id='showgeo' type='button' value='显示边界' />
                    <input id='fly' type='button' value='飞到济南'/>
                    <input id='flychina' type='button' value='返回全国' />
                    <input id='changecq' type='button' value='修改区域（重庆）'/>
                    <input id='changesd' type='button' value='修改区域（山东）'/>
                    <input id='return' type='button' value='返回'/>
                    <div>
                    <input className='theme' id='dark' type='button' value='黑色-dark'/>
                    <input className='theme' id='white' type='button' value='白色-white'/>
                    <input className='theme' id='blue' type='button' value='蓝色-blue'/>
                    </div>
                    <div id = 'map' ></div>
            </div>);

    }
}
export default mapmethod;