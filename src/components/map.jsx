import React, { useEffect, useRef, useState } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import * as Style from 'ol/style'
import * as Layer from 'ol/layer'
import * as Source from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON';

import countiesData from '../data/countries.geojson'

import LanguagesCountries from '../data/languagesByCountries.json'

//Get info
const searchByString = (target)=>{
    let filteredData = LanguagesCountries.filter(item => {
      // Check if the item contains the substring, use all lowercase to allow for case insensitive search
      return JSON.stringify(item.country).toLowerCase().includes(target.toLowerCase());
    });
    if(filteredData.length>0){
        return(filteredData[0].languages)
    }else{
        return(["Missing Data"])
    }
}

const MapComponent = ({setInfoData,setHighlight,countryHighlights}) => {
  const mapRef = useRef()
  const ref = useRef()

  const featureOverlay = useRef()
  const vectorLayer = useRef()
  const multiSelectOverlay = useRef()

  const colors = {
    primary: 'rgb(55,139,164)',
    dark: 'rgb(10,47,74)',
    light: 'rgb(232,237,231)',
    highlight: 'rgb(104,199,53)',
  }
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

        var multiSelectStyle = new Style.Style({
          stroke: new Style.Stroke({
            color: '#f00',
            width: 1
          }),
          fill: new Style.Fill({
            color: 'rgba(0,255,0,0.1)'
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
        
  useEffect(()=>{
    
    if(mapRef.current && !ref.current){

    vectorLayer.current = new Layer.Vector({
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
        layers: [vectorLayer.current],
        target: mapRef.current,
        view: new View({
          center: [0, 0],
          zoom: 1
        })
      });
      
    featureOverlay.current = new Layer.Vector({
        source: new Source.Vector(),
        map: ref.current,
        style: function(feature) {
          highlightStyle.getText().setText(feature.get('name'));
          return highlightStyle;
        }
      });

    multiSelectOverlay.current = new Layer.Vector({
        source: new Source.Vector(),
        map: ref.current,
        style: function(feature) {
          multiSelectStyle.getText().setText(feature.get('name'));
          return multiSelectStyle;
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

        vectorLayer.current.getSource().forEachFeature(function (feature) {
          multiSelectOverlay.current.getSource().removeFeature(feature);
        })
        var feature = ref.current.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });

        if(feature?.values_.name){
            setInfoData({title:feature.values_.name,data:searchByString(feature.values_.name), dataType: 'searchByCountry'})
        }else{
            setInfoData({title:'',data:''})
            return
        }
        if (feature !== highlight) {
            if (highlight) {
              featureOverlay.current.getSource().removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.current.getSource().addFeature(feature);
            }
            highlight = feature;
        }

      };

    }

  },[])

    useEffect(()=>{
        if(countryHighlights){
          vectorLayer.current.getSource().forEachFeature(function (feature) {
            featureOverlay.current.getSource().removeFeature(feature);
          })
            let countries = countryHighlights.map(item=>(item.country.toLowerCase()))
            vectorLayer.current.getSource().forEachFeature(function (feature) {
              multiSelectOverlay.current.getSource().removeFeature(feature);
                if(countries.includes(feature.values_.name.toLowerCase())){
                    multiSelectOverlay.current.getSource().addFeature(feature);
                }
            });
        }
    },[countryHighlights])
  
    return (
        <>
             <div ref={mapRef} className='map' id='map'></div>
        </>
    )
}

export default MapComponent;


