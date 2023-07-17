import React, { useEffect, useRef, useState } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import * as Style from 'ol/style'
import * as Layer from 'ol/layer'
import * as Source from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON';

import countiesData from '../data/countries.geojson'

const MapComponent = ({setInfoData,setHighlight}) => {
    
const [selectedData, setSelectedData] = useState()
  const mapRef = useRef()
  const ref = useRef()

  const colors = {
    primary: 'rgb(55,139,164)',
    dark: 'rgb(10,47,74)',
    light: 'rgb(232,237,231)',
    highlight: 'rgb(104,199,53)',
  }

  useEffect(()=>{
    
    if(mapRef.current && !ref.current){

      var style = new Style.Style({
        fill: new Style.Fill({
          color: colors.primary
        }),
        stroke: new Style.Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new Style.Text({
          font: '14px Helvetica',
          fill: new Style.Fill({
            color: colors.light
          }),
          stroke: new Style.Stroke({
            color: colors.dark,
            width: 1
          })
        })
      });

      var highlightStyle = new Style.Style({
        stroke: new Style.Stroke({
          color: '#f00',
          width: 1
        }),
        fill: new Style.Fill({
          color: 'rgba(255,0,0,0.1)'
        }),
        text: new Style.Text({
          font: '14px Helvetica',
          fill: new Style.Fill({
            color: colors.light
          }),
          stroke: new Style.Stroke({
            color: colors.dark,
            width: 1
          })
        })
      });
      

      var vectorLayer = new Layer.Vector({
        source: new Source.Vector({
          url: countiesData,
          format: new GeoJSON()
        }),
        style: function(feature) {
          style.getText().setText(feature.get('name'));
          return style;
        }
      });

      
      ref.current = new Map({
        controls:[],
        layers: [vectorLayer],
        target: mapRef.current,
        view: new View({
          center: [0, 0],
          zoom: 1
        })
      });
      
      var featureOverlay = new Layer.Vector({
        source: new Source.Vector(),
        map: ref.current,
        style: function(feature) {
          highlightStyle.getText().setText(feature.get('name'));
          return highlightStyle;
        }
      });

      ref.current.on('pointermove', function(e) {
        if (e.dragging) {
          return;
        }
        var pixel = ref.current.getEventPixel(e.originalEvent);
        highlightMapEvent(pixel);
      });

      var highlightMapEvent = (pixel) =>{
        var feature = ref.current.forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });
        if(feature?.values_.name){
            setHighlight(feature.values_.name)
        }else{
            setHighlight('Water Body')
        }
      }

      ref.current.on('click', function(e) {
        displayMapEvent(e.pixel);
      });
      

      var highlight;
      var displayMapEvent = (pixel) => {

        var feature = ref.current.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });

        // console.log(feature.values_.name)
        setInfoData({title:feature.values_.name,data:['tets']})


        // featureOverlay.getSource().addFeature(feature);
        if (feature !== highlight) {
          featureOverlay.getSource().removeFeature(highlight);
          if (highlight) {
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature);
          }
          highlight = feature;
        }

      };

    }

  },[])
  
    return (
        <>
             <div ref={mapRef} className='map' id='map'></div>
        </>
    )
}

export default MapComponent;


