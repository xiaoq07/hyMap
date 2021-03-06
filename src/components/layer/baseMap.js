/*
 * @Author: wxq
 * @Date:   2017-04-20 17:03:05
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-28 15:00:49
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\baseMap.js
 * @File Name: baseMap.js
 * @Descript: 
 */
'use strict';
import base from '../layer/base';
const ol = require('ol');

export default class baseMap extends base {
    /**
     * 初始化
     * @private
     * @param  {Object}  options 参数{url:gis后台服务地址}
     * @extends  base
     */
    constructor(options) {

        super(options);

        /**
         * 主题
         * @type {String}
         */
        this.theme = options && options.theme || 'dark';
        /**
         * 服务地址
         * @type {string}
         */
        this.url = options && options.serverUrl || '';

        /**
         * 底图
         * @type {layer}
         */
        this.layer = this.init();

    }

    /**
     * 初始化layer
     * @return {Object}  layer 地图
     */
    init() {

        this.layerArray = new ol.Collection();
        this.layerGroup = new ol.layer.Group({
            layers: this.layerArray
        });
        this.map.addLayer(this.layerGroup);
        return this.layerGroup;


    }


    getLayer() {

        return this.layerGroup;

    }

    createTile(source, label = '地图', opacity) {

        return new ol.layer.Tile({
            title: label,
            baseLayer: true,
            displayInLayerSwitcher: false,
            source: source,
            opacity: opacity
        });

    }

    initSource(theme) {

        let layers = [];

        if (Array.isArray(theme)) {

            theme.forEach(themeObj => {

                let layer = this._initSource(themeObj);

                layers = layers.concat(layer);

            });

        } else {

            layers = this._initSource(theme);

        }

        return layers;

    }

    /**
     * 初始化数据源
     * @param  {string|object}  theme 主题类型
     * @return {source}        source 数据源
     */
    _initSource(theme) {

        let layers = [];
        let source = undefined;
        let opacity = 1;

        // source = new ol.source.OSM({
        //     logo: false
        // });
        // layers.push(this.createTile(source, '', 0.5));
        if (typeof theme == 'object') {

            opacity = theme.opacity;
            if (theme.type == 'tile') {

                let url = theme.url;
                source = new ol.source.XYZ({
                    wrapX: false,
                    // tileSize: 512,
                    tilePixelRatio: 2,
                    tileGrid: ol.tilegrid.createXYZ({}),
                    tileUrlFunction: (tileCoord) => {

                        let z = 'L' + (this.zeroPad(tileCoord[0], 2, 10));
                        let x = 'C' + this.zeroPad(tileCoord[1], 8, 16);
                        let y = 'R' + this.zeroPad(-tileCoord[2] - 1, 8, 16);
                        return url + '/' + z + '/' + y + '/' + x + '.png';

                    }
                });

            } else if (theme.type == 'arcgis') {

                let url = theme.url;
                source = new ol.source.TileArcGISRest({
                    ratio: 1,
                    params: {},
                    url: url
                });


            } else if (theme.type == 'mapbox') {

                let url = 'https://b.tiles.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key;
                source = new ol.source.XYZ({
                    url: url
                });

            } else if (theme.type == 'satellite') {

                let url = theme.url + '/{z}/{x}/{y}.jpg';
                source = new ol.source.XYZ({
                    url: url
                });

            } else if (theme.type == "pgis") {

                var startResolution = ol.extent.getWidth(ol.proj.get('EPSG:3857').getExtent()) / 256;
                var resolutions = new Array(20);
                for (var i = 0, ii = resolutions.length; i < ii; ++i) {
                    resolutions[i] = startResolution / Math.pow(2, i);
                }
                // var projectionExtent = projection.getExtent();
                var projectionExtent = ol.proj.transformExtent([-180, -85, 122.23632, 67.22], "EPSG:4326", "EPSG:3857")
                // var projectionExtent = ol.proj.transformExtent([117.20507, 30.84179, 122.23632, 34.55273], "EPSG:4326", "EPSG:3857")

                var tilegrid = new ol.tilegrid.TileGrid({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    extent: projectionExtent,//projectionExtent,
                    tileSize: [256, 256]
                });
                //http://10.32.203.96/PGIS_S_TileMapServer/Maps/SLTDT/EzMap?Service=getImage&
                //  Type=RGB&ZoomOffset=0&Col=850&Row=164&Zoom=10&V=1.0.0
                let url = "http://localhost:8080/mm"
                source = new ol.source.TileImage({
                    // url: url,
                    tileGrid: tilegrid,
                    tileUrlFunction: (xyz) => {

                        return url + "/" + xyz[0] + "/" + xyz[1] + "/" + (-xyz[2] - 1) + ".png";
                    }
                });
            }

            if (theme.debug) {

                let l = new ol.layer.Tile({
                    source: new ol.source.TileDebug({
                        projection: 'EPSG:3857',
                        tileGrid: source.getTileGrid()
                    })
                });

                this.map.addLayer(l);

            }

            const layer = this.createTile(source, opacity);
            layers.push(layer);

        } else if (theme == 'white') {

            source = new ol.source.OSM({
                logo: false,
            });
            const layer = this.createTile(source, 0.1);
            layers.push(layer);

        } else if (theme == 'dark') {

            source = new ol.source.TileWMS({
                url: this.url + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group_dark'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            });
            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'blue') {

        } else if (theme == 'sougou') {

            let r = [128e3, 64e3, 32e3, 16e3, 8000.000000000001, 4000.0000000000005, 2000.0000000000002, 1000.0000000000001, 500.00000000000006, 250.00000000000003, 125.00000000000001, 62.50000000000001, 31.250000000000004, 15.625, 7.812500000000001, 3.9062500000000004, 1.9531250000000002, .9765625000000001, .48828125000000006];

            let url = 'http://p{digit}.go2map.com/seamless1/0/174/{tile}.png?v=2016820';
            source = new ol.source.XYZ({
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.TileGrid({
                    resolutions: r,
                    origin: [0, 0]
                }),
                wrapX: false,
                tileUrlFunction: (e, r) => {

                    let t = url;
                    let a = e[1],
                        n = e[2],
                        i = e[0],
                        l = t,
                        s = 728 - i;
                    710 == s && (s = 792);
                    let c = s.toString() + '/',
                        u = Math.floor(Math.abs(a / 200));
                    a < 0 && (c += 'M'), c += u.toString(), c += '/';

                    let p = Math.floor(Math.abs(n / 200));
                    n < 0 && (c += 'M'),
                        c += p.toString(),
                        c += '/',
                    a < 0 && (c += 'M'),
                        c += Math.abs(a).toString(),
                        c += '_',
                    n < 0 && (c += 'M'),
                        c += Math.abs(n).toString(),
                        l = l.replace('{digit}', (a + n & 2).toString()),
                        l = l.replace('{tile}', c);

                    return l;

                }
            });

            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'tianditu') {

            source = new ol.source.XYZ({
                url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
            });
            // let tian_di_tu_satellite_layer = new ol.layer.Tile({
            //     baseLayer: true,
            //     title: '卫星',
            //     visible: false,
            //     displayInLayerSwitcher: false,
            //     source: new ol.source.XYZ({
            //         url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
            //     })
            // });

            // this.map.addLayer(tian_di_tu_satellite_layer);
            let laberSource = new ol.source.XYZ({
                url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
            });

            const layer = this.createTile(source);
            layers.push(layer);
            const labelLayer = this.createTile(laberSource, '标注');
            layers.push(labelLayer);


        } else if (theme == 'tianditu_sat') {

            source = new ol.source.XYZ({
                url: 'http: //t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'

            });

            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'gaode') {

            source = new ol.source.XYZ({
                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            });
            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'gaode_sat') {

            source = new ol.source.XYZ({
                url: ' http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
            });

            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'baidu') {

            let resolutions = [];
            let maxZoom = 18;

            // 计算百度使用的分辨率
            for (let i = 0; i <= maxZoom; i++) {

                resolutions[i] = Math.pow(2, maxZoom - i);

            }
            let tilegrid = new ol.tilegrid.TileGrid({
                origin: [0, 0], // 设置原点坐标
                resolutions: resolutions // 设置分辨率
            });
            source = new ol.source.TileImage({
                projection: 'EPSG:3857',
                tileGrid: tilegrid,
                tileUrlFunction: function (tileCoord, pixelRatio, proj) {

                    let z = tileCoord[0];
                    let x = tileCoord[1];
                    let y = tileCoord[2];

                    // 百度瓦片服务url将负数使用M前缀来标识
                    if (x < 0) {

                        x = 'M' + (-x);

                    }
                    if (y < 0) {

                        y = 'M' + (-y);

                    }

                    return 'http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=' + x + '&y=' + y + '&z=' + z + '&styles=pl&scaler=1&p=1';

                }
            });

            const layer = this.createTile(source);
            layers.push(layer);

        } else if (theme == 'google') {

            source = new ol.source.XYZ({
                url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
            });

            const layer = this.createTile(source);
            layers.push(layer);

        } else {

            source = new ol.source.TileWMS({
                url: this.url + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            });

            const layer = this.createTile(source);
            layers.push(layer);

        }
        return layers;

    }

    /**
     * 设置数据源
     * @param  {(string|Object)}   type 设置数据源
     * @default blue
     * @example
     *
     *  setTheme({
     *     mapId: your mapboxID
     *     key: your mapboxkey
     *  })
     *  or:
     *  setTheme('')
     */
    setTheme(type) {

        this.theme = type;
        const layers = this.initSource(type);
        this.setLayer(layers);

    }

    /**
     * 获取主题
     * @return {string} theme 获取主题
     */
    getTheme() {

        return this.theme;

    }

    /**
     * 设置图层
     * @private
     * @param {Array} layers
     */
    setLayer(layers) {

        this.layerArray.clear();
        this.layerArray.extend(layers);

    }

    /**
     * arcgis级别计算
     * @private
     * @param  {string}   num   原始数据
     * @param  {string}   len   长度
     * @param  {string}   radix 进制
     * @return {string}   string 转换后的数据
     */
    zeroPad(num, len, radix) {

        let str = num.toString(radix || 10);
        while (str.length < len) {

            str = '0' + str;

        }

        return str;

    }
}