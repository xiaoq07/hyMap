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
    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {
        this._basicLayersArray.push(this.baseLayer)
        this.map.addLayer(this._basicLayerGroup);

    }

    createGeoLayer(mapName) {

        let vectorStyle = this._createGeoStyle(this._geo.itemStyle, this._geo.label);
        this._regionsObj = this._createRegionsStyle(this._geo.regions);

        let vectorSource = new ol.source.Vector();

        vectorSource.on('addfeature', evt => {

            evt.feature.source = vectorSource;
            evt.feature.set('style', this._regionsObj[evt.feature.get('xzqmc')]);

        });
        let vector = new ol.layer.Vector({
            source: vectorSource,
            style: this._geoStyleFn
        });
        vector.set('type', 'geo');
        vector.set('fstyle', vectorStyle);
        vectorSource.vector = vector;

        this._basicLayersArray.push(vector);

        hyMapQuery.spatialQuery({
            'url': this._serverUrl,
            'msg': hyMapQuery.createFeatureRequest([mapName + '_country']),
            'callback': function(features) {

                vectorSource.addFeatures(features);

            }
        });
        return vector;

    }


    setTheme(mapName = 'dark') {

        if (mapName == 'white') {

            this.baseLayer.setSource(
                new ol.source.OSM({
                    logo: false
                })
            );

        } else if (mapName == 'dark') {

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