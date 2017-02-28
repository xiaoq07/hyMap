import hyMapQuery from '../query/hyMapQuery';
import hyMapStyle from '../style/hyMapStyle';

const ol = require('../../public/lib/ol');

export default class hyLayer extends hyMapStyle {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group({
            zIndex: 99
        });
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this.baseLayer = new ol.layer.Tile();
        this.geoVectorSource = null;

    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {

        this._basicLayersArray.push(this.baseLayer);
        this.map.addLayer(this._basicLayerGroup);
        this.createGeoLayer();

    }

    createGeoLayer() {

        this.geoVectorSource = new ol.source.Vector();
        this.geoVectorSource.on('addfeature', evt => {

            evt.feature.source = this.geoVectorSource;
            evt.feature.set('style', this._regionsObj[evt.feature.get('xzqmc')]);

        });
        this.geoVector = new ol.layer.Vector({
            source: this.geoVectorSource,
            style: this._geoStyleFn
        });
        this.geoVector.set('type', 'geo');
        this.geoVectorSource.vector = this.geoVector;
        this._basicLayersArray.push(this.geoVector);
        return this.geoVector;

    }

    setGeo(mapName) {

        if (mapName) {

            hyMapQuery.spatialQuery({
                'url': this._serverUrl,
                'msg': hyMapQuery.createFeatureRequest([mapName + '_country']),
                'callback': (features) => {

                    this.geoVectorSource.addFeatures(features);

                }
            });

        } else {

            this.baseLayer.setSource();

        }
        this._regionsObj = this._createRegionsStyle(this._geo.regions);
        let vectorStyle = this._createGeoStyle(this._geo.itemStyle, this._geo.label);
        this.geoVector.set('fstyle', vectorStyle);


    }

    setTheme(theme = 'dark') {

        if (theme == 'white') {

            this.baseLayer.setSource(
                new ol.source.OSM({
                    logo: false
                })
            );

        } else if (theme == 'dark') {

            this.baseLayer.setSource(
                new ol.source.TileWMS({
                    url: this._serverUrl + '/wms',
                    params: {
                        'LAYERS': 'hygis:china_vector_group_dark'
                    },
                    serverTyjpe: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            );

        } else {

            this.baseLayer.setSource(
                new ol.source.TileWMS({
                    url: this._serverUrl + '/wms',
                    params: {
                        'LAYERS': 'hygis:china_vector_group'
                    },
                    serverTyjpe: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            );

        }

        //放到图层添加功能中


        // this._basicLayersArray.push(new ol.layer.Tile({
        //     source: new ol.source.TileWMS({
        //         url: this.geoserverUrl + '/wms',
        //         params: {
        //             'LAYERS': 'shandong_area',
        //         },
        //         serverTyjpe: 'geoserver',
        //         crossOrigin: 'anonymous'
        //     })
        // }));

        // const wmsSource = new ol.source.TileWMS({
        //     url: this.geoserverUrl + '/wms',
        //     params: {
        //         'LAYERS': 'csdlzxx_pl'
        //     },
        //     serverTyjpe: 'geoserver',
        //     crossOrigin: 'anonymous'
        // });
        // this.wmsTile = new ol.layer.Tile({
        //     source: wmsSource
        // });

        // this._basicLayersArray.push(this.wmsTile);
        // 

    }

    /**
     * [_geoStyleFn description]
     * @param  {[type]} feature    [description]
     * @param  {[type]} resolution [description]
     * @param  {String} type       [description]
     * @return {[type]}            [description]
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const vectorStyle = feature.source.vector.get('fstyle');

        const style = feature.get('style') || vectorStyle;
        const text = style[type].getText();
        text.show && text.setText(feature.get('xzqmc'));
        return style[type];

    }
}