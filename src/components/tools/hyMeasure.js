/*
 * @Author: wxq
 * @Date:   2017-05-15 10:48:02
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-29 11:40:25
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\tools\hyMeasure.js
 * @File Name: hyMeasure.js
 * @Descript: 
 */
'use strict';

require('../../../css/measure.css');

const ol = require('ol');
export default class hyMeasure {
    constructor(options) {

        this.map = options.map;
        this.type = (options.type == 'area' ? 'Polygon' : 'LineString');
        /**
         * Currently drawn feature.
         * @type {ol.Feature}
         */
        this.sketch;

        this.geodesicCheckbox = false;
        /**
         * The help tooltip element.
         * @type {Element}
         */
        this.helpTooltipElement;

        /**
         * Overlay to show the help messages.
         * @type {ol.Overlay}
         */
        this.helpTooltip;

        /**
         * The measure tooltip element.
         * @type {Element}
         */
        this.measureTooltipElement;


        /**
         * Overlay to show the measurement.
         * @type {ol.Overlay}
         */
        this.measureTooltip;

        this.wgs84Sphere = new ol.Sphere(6378137);
        this.source = new ol.source.Vector();
        this.vector = new ol.layer.Vector({
            source: this.source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        this.map.addLayer(this.vector);
        // this.map.on('singleclick', (evt) => {
        //     var feature = new ol.Feature({
        //         geometry: new ol.geom.Point(evt.coordinate)
        //     })
        //     this.source.addFeature(feature);
        // })
        this.pointerMoveHandlerKey = this.map.on('pointermove', this.pointerMoveHandler, this);
        this.map.getViewport().addEventListener('mouseout', () => {

            this.helpTooltipElement && this.helpTooltipElement.classList.add('hidden');
        });

        this.draw; // global so we can remove it later
        this.listener;
        // this.createHelpTooltip();

    }

    active(type) {
        this.map.removeInteraction(this.draw);
        this.stopInteraction();
        this.type = this.getType(type);
        this.addInteraction(this.type);
    }
    getType(type) {
        return type == 'area' ? 'Polygon' : 'LineString';
    }

    /**
     * Handle pointer move.
     * @param {ol.this.MapBrowserEvent} evt The event.
     */
    pointerMoveHandler(evt) {
        if (!this.draw) {
            return;
        }
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = '单击确定起点';
        var continueMsg = '单击继续,双击结束';
        if (this.sketch) {
            var geom = (this.sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = continueMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = continueMsg;
            }
        }

        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);
        this.helpTooltipElement.classList.remove('hidden');

    };



    /**
     * Format length output.
     * @param {ol.geom.LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength(line) {
        var length;
        if (this.geodesicCheckbox) {
            var coordinates = line.getCoordinates();
            length = 0;
            var sourceProj = this.map.getView().getProjection();
            for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                length += this.wgs84Sphere.haversineDistance(c1, c2);
            }
        } else {
            length = Math.round(line.getLength() * 100) / 100;
        }
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };


    /**
     * Format area output.
     * @param {ol.geom.Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea(polygon) {
        var area;
        if (this.geodesicCheckbox) {
            var sourceProj = this.map.getView().getProjection();
            var geom = /** @type {ol.geom.Polygon} */ (polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
            var coordinates = geom.getLinearRing(0).getCoordinates();
            area = Math.abs(this.wgs84Sphere.geodesicArea(coordinates));
        } else {
            area = polygon.getArea();
        }
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    addInteraction(type) {
        this.createMeasureTooltip();
        this.createHelpTooltip();

        this.draw = new ol.interaction.Draw({
            source: this.source,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            }),
            // geometryFunction: function(evt) {
            //     // return evt;
            // }
        });
        this.map.addInteraction(this.draw);

        this.draw.on('drawstart',
            (evt) => {
                // set sketch
                this.sketch = evt.feature;
                var tooltipCoord = evt.coordinate;
                this.listener = this.sketch.getGeometry().on('change', (evt) => {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = this.formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = this.formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();

                    }
                    this.measureTooltipElement.innerHTML = output;
                    this.measureTooltip.setPosition(tooltipCoord);
                });
            });

        this.draw.on('drawend',
            (evt) => {

                this.measureTooltipElement.className = 'tooltip tooltip-static tooltip-closer';
                var close = document.createElement('span');
                close.innerHTML = 'X';
                close.feature = evt.feature;
                close.addEventListener('click', () => {

                    this.removeSketch(close);

                })
                this.measureTooltipElement.appendChild(close);

                this.measureTooltip.setOffset([0, -7]);
                // unset sketch
                this.sketch = null;
                // unset tooltip so that a new one can be created
                this.measureTooltipElement = null;
                this.createMeasureTooltip();
                ol.Observable.unByKey(this.listener);
                this.onEnd();
            });
    }


    /**
     * Creates a new help tooltip
     */
    createHelpTooltip() {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip hidden';
        this.helpTooltip = new ol.Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        this.map.addOverlay(this.helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip() {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new ol.Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        this.map.addOverlay(this.measureTooltip);
    }

    stopInteraction() {
        let collection = this.map.getInteractions();
        collection.forEach((interaction) => {
            if (interaction instanceof ol.interaction.Select) {
                interaction.setActive(false);
            }
        })

    }
    recoverInteraction() {
        let collection = this.map.getInteractions();
        collection.forEach((interaction) => {
            if (interaction instanceof ol.interaction.Select) {
                interaction.setActive(true);
            }
        })


    }
    onEnd() {
        setTimeout(() => {
            this.map.removeInteraction(this.draw);

            this.recoverInteraction();

        }, 100)

        ol.Observable.unByKey(this.pointerMoveHandlerKey);
        this.helpTooltipElement.classList.add('hidden');

    }

    removeSketch(obj) {
        this.source.removeFeature(obj.feature);
        obj.parentNode.parentNode.removeChild(obj.parentNode);
    }

}