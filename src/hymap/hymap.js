import hymapOption from './hymapOption';

const ol = require('openlayers/dist/ol-debug');
const olstyle = require('openlayers/dist/ol.css');

export default class hyMap extends hymapOption {
    constructor(dom, options) {

        super();
        this.geoserverUrl = 'http://192.168.0.50:8080/geoserver/wms';
        this.map = null;
        this._dom = dom;
        this._show = true;

        this._extent = [];
        this._event = [];
        this._showLogo = true;
        this._panFunction = function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

        };
        this._layersArray = new ol.Collection();
        this._layerGroup = new ol.layer.Group();
        this._init();
        this.setOption(options);

    }
    _init() {

        this._createMap();


    }

    /**
     * 初始化hymap对象
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    init(dom) {

        // if (!dom) {

        //     return;

        // }
        if (dom) {
            this._dom = dom;
            this.map.setTarget(dom);
        }



        // return hymap;

    }

    /**
     * 创建map
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _createMap() {

        this.map = new ol.Map({

            // target: ,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }).extend([
                // new ol.control.FullScreen(),
                // new ol.control.MousePosition(),//鼠标位置
                // new ol.control.OverviewMap(),//鹰眼
                new ol.control.ScaleLine()
                // new ol.control.ZoomSlider(),//地图缩放侧边栏
                // new ol.control.ZoomToExtent()//一键缩放到全图
            ]),
            logo: this.getLogo()

        });
        this.init(this._dom);

    }

    getLogo() {

        if (!this._showLogo) {

            return false;

        }

        let logoElement = document.createElement('a');
        logoElement.href = 'http://www.hydata.cc/';
        logoElement.target = '_blank';
        logoElement.className = 'ol-hy-logo';
        logoElement.innerHTML = '&copy; 2013 Haiyun data';

    }

    /**
     * 创建vieww
     * @return {[type]} [description]
     */
    _createView() {

        let minZoom = this._geo.scaleLimit[0];
        let maxZoom = this._geo.scaleLimit[1];
        //限制缩放
        if (this._geo.roam === 'false' || this._geo.roam == 'pan') {

            minZoom = this._geo.zoom;
            maxZoom = this._geo.zoom;

        }
        //限制平移
        if (this._geo.roam === 'false' || this._geo.roam == 'scale') {

            this.map.on('pointerdrag', this._panFunction);

        } else {

            this.map.un('pointerdrag', this._panFunction);

        }
        this.view = new ol.View({
            center: this._geo.center,
            zoom: this._geo.zoom,
            enableRotation: false,
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: 'EPSG:4326'
                // extent: []
                // zoomFactor: 2
                // resolutions: [0.005767822265625, 0.00494384765625,
                //     0.004119873046875, 0.0020599365234375, 0.00102996826171875,
                //     0.000514984130859375, 0.0002574920654296875, 0.00012874603271484375
                // ]
        });

        this.map.setView(this.view);

    }

    _createBasicLayer() {


        // this.map.addLayer(new ol.layer.Tile({
        //     source: new ol.source.OSM()
        // }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'xzqh'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'hygis:xzqhbz_pt'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        // const wmsSource = new ol.source.TileWMS({
        //     url: this.geoserverUrl,
        //     params: {
        //         'LAYERS': 'csdlzxx_pl'
        //     },
        //     serverTyjpe: 'geoserver',
        //     crossOrigin: 'anonymous'
        // });
        // this.wmsTile = new ol.layer.Tile({
        //     source: wmsSource
        // });

        // this.map.addLayer(this.wmsTile);

    }
    _createGroupLayer() {

        this._layersArray = new ol.Collection();
        this._layerGroup = new ol.layer.Group();
        this._layerGroup.setLayers(this._layersArray);
        this.map.addLayer(this._layerGroup);

    }
    _createLayers(series) {

        series.forEach((a) => {

            this._createLayer(a);

        });
        this._createSelectInteraction();
        this._createHoverInteraction();

    }
    _createLayer(serie) {

        const data = serie.data;

        let array = [];
        if (serie.type == 'point') {

            for (let i = 0; i < data.length; i++) {

                const obj = data[i];
                let feature = new ol.Feature({
                    geometry: new ol.geom.Point([obj['lon'], obj['lat']])

                });
                feature.setProperties(obj);
                array.push(feature);

            }

        } else if (serie.type == 'line') {

            for (let i = 0; i < data.length; i++) {

                const obj = data[i];
                let coords = [];
                const str = obj.xys.split(';');
                for (let i = 0; i < str.length; i++) {

                    const coord = str[i].split(',');
                    coords.push(coord);

                }
                const feature = new ol.Feature({
                    geometry: new ol.geom.LineString(coords)

                });
                feature.setProperties(obj);
                array.push(feature);

            }

        } else if (serie.type == 'polygon') {

            for (let i = 0; i < data.length; i++) {

                const obj = data[i];
                let coords = [];
                const str = obj.xys.split(';');
                for (let i = 0; i < str.length; i++) {

                    const coord = str[i].split(',');
                    coords.push(coord);

                }
                const feature = new ol.Feature({
                    geometry: new ol.geom.LineString(coords)

                });
                feature.setProperties(obj);
                array.push(feature);

            }

        } else if (serie.type == 'chart') {


        }


        const style = this._createStyle(serie);
        let source = new ol.source.Vector();
        source.addFeatures(array);
        let vector = new ol.layer.Vector({
            source: source,
            style: function() {

                return style;

            }

        });

        this._layersArray.push(vector);

    }

    _createSelectInteraction() {

        let select = new ol.interaction.Select();
        this.map.addInteraction(select);
        select.on('select', function(evt) {

            const selFeatures = evt.selected;
            const unSelFeatures = evt.deselected;
            if (selFeatures.length > 0) {

                const properties = selFeatures[0].getProperties();
                this.dispatchAction({
                    type: 'geoSelect',
                    data: properties
                });

            }
            if (unSelFeatures.length > 0) {

                const properties = unSelFeatures[0].getProperties();
                this.dispatchAction({
                    type: 'geoUnSelect',
                    data: properties
                });

            }


        }, this);

    }
    _createHoverInteraction() {}

    _createStyle(serie) {

        const symbolStyle = serie.symbolStyle;
        const normal = symbolStyle.normal;
        let icon;
        let style;
        if (serie.type == 'point') {

            if (serie.symbol == 'circle') {

                icon = new ol.style.Circle({
                    radius: normal.strokeWidth,
                    stroke: new ol.style.Stroke({
                        color: normal.strokeColor,
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: normal.fillColor //'rgba(0,255,255,0.3)'
                    })
                });

            } else {

                const canvas = document.createElement('canvas');

                let ctx = canvas.getContext('2d');
                let img = new Image();
                img.src = serie.symbol.split(':')[1];

                img.onload = function() {

                    ctx.drawImage(img, 0, 0, normal.symbolwidth, normal.symbolwidth);

                };
                canvas.setAttribute('width', normal.symbolwidth);
                canvas.setAttribute('height', normal.symbolwidth);
                icon = new ol.style.Icon({
                    anchor: [0.5, 1],
                    img: canvas,
                    imgSize: [canvas.width, canvas.height]
                });

            }

            style = new ol.style.Style({
                image: icon
            });

        } else if (serie.type == 'line') {

            style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 5
                })
            });

        }

        return style;

    }

    setOption(opt_options) {

        const options = opt_options || {};
        Object.assign(this._geo, options);

        //
        if (this._geo.show === true) {

            this.show();

        } else {

            this.hide();

        }

        this._createView();
        this._createBasicLayer();
        this._createGroupLayer();
        this._createLayers(this._geo.series);

    }

    getOption() {

        return this._geo;

    }

    /**
     * [on description]
     * @param  {[type]} type    click
     * @param  {[type]} listener [description]
     * @return {[type]}          [description]
     */
    on(type, listener) {

        this._event[type] = listener;
        // const s = Symbol(listener);

    }

    /**
     * [off description]
     * @return {[type]} [description]
     */
    off() {

    }

    /**
     * [dispatchAction description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    dispatchAction(options) {

        this._event[options.type](options);

    }

    /**
     * [addPoints description]
     * @param {[type]} serie [description]
     */
    addPoints(serie) {

        this._createLayer(serie);

    }



    /**
     * dom状态切换（显示，隐藏）
     * @return {[type]} [description]
     */
    tollgeShow() {

        if (this._show === false) {

            this._dom.style.display = 'block';

        } else {

            this._dom.style.display = 'none';

        }

    }

    /**
     * 隐藏dom对象
     * @return {[type]} [description]
     */
    hide() {

        this._dom.style.display = 'none';
        this._show = false;

    }

    /**
     * 显示dom对象
     * @return {[type]} [description]
     */
    show() {

        this._dom.style.display = 'block';
        this._show = true;

    }

    /**
     * [resize description]
     * @return {[type]} [description]
     */
    resize() {

        this.map.updateSize();

    }

    flyTo() {

    }

    /**
     * 销毁对象
     * @return {[type]} [description]
     */
    dispose() {

        this.map.dispose();
        // hyMap = nullFunction();

    }

    nullFunction() {

        return;

    }
}