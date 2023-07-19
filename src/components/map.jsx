import React, { useEffect, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import * as Style from "ol/style";
import * as Layer from "ol/layer";
import * as Source from "ol/source";
import GeoJSON from "ol/format/GeoJSON";

// Country boundary Geo-spatial Dataset
import countiesData from "../data/countries.geojson";

// Language by country Dataset
import LanguagesCountries from "../data/languagesByCountries.json";

// Get all languages by country 
const getLanguagesByCounty = (target) => {
  let filteredData = LanguagesCountries.filter((item) => {
    // Check if the item contains the substring, use all lowercase to allow for case insensitive search
    return JSON.stringify(item.country)
      .toLowerCase()
      .includes(target.toLowerCase());
  });
  if (filteredData.length > 0) {
    return filteredData[0].languages;
  } else {
    return ["Missing Data"];
  }
};

// Default export
const MapComponent = ({ setInfoData, setHighlight, countryHighlights }) => {
  // Track and access map div and openLayers instance in state
  const mapRef = useRef();
  const ref = useRef();

  // Track and access openLayers overlays or layers
  const featureOverlay = useRef();
  const vectorLayer = useRef();
  const multiSelectOverlay = useRef();

  // Colors variable, extracted from CSS
  const colors = {
    primary: "rgb(55,139,164)",
    dark: "rgb(10,47,74)",
    light: "rgb(232,237,231)",
    highlight: "rgb(104,199,53)",
  };

  // Main Map Style
  var style = new Style.Style({
    fill: new Style.Fill({
      color: colors.primary,
    }),
    stroke: new Style.Stroke({
      color: "#319FD3",
      width: 1,
    }),
    text: new Style.Text({
      font: "14px Helvetica",
      fill: new Style.Fill({
        color: colors.light,
      }),
      stroke: new Style.Stroke({
        color: colors.dark,
        width: 1,
      }),
    }),
  });

  // Map highlight style, when the map is clicked on
  var highlightStyle = new Style.Style({
    stroke: new Style.Stroke({
      color: "#f00",
      width: 1,
    }),
    fill: new Style.Fill({
      color: "rgba(255,0,0,0.1)",
    }),
    text: new Style.Text({
      font: "14px Helvetica",
      fill: new Style.Fill({
        color: colors.light,
      }),
      stroke: new Style.Stroke({
        color: colors.dark,
        width: 1,
      }),
    }),
  });

  // map multi select style, when the data search for is visualized on the map
  var multiSelectStyle = new Style.Style({
    stroke: new Style.Stroke({
      color: "#f00",
      width: 1,
    }),
    fill: new Style.Fill({
      color: "rgba(0,255,0,0.1)",
    }),
    text: new Style.Text({
      font: "14px Helvetica",
      fill: new Style.Fill({
        color: colors.light,
      }),
      stroke: new Style.Stroke({
        color: colors.dark,
        width: 1,
      }),
    }),
  });

  // Main functions to run on component mount
  useEffect(() => {
    
    if (mapRef.current && !ref.current) {
      // init main may vector layer
      vectorLayer.current = new Layer.Vector({
        source: new Source.Vector({
          url: countiesData,
          format: new GeoJSON(),
        }),
        style: function (feature) {
          style.getText().setText(feature.get("name"));
          return style;
        },
      });

      // init map in div
      ref.current = new Map({
        controls: [],
        layers: [vectorLayer.current],
        target: mapRef.current,
        view: new View({
          center: [0, 0],
          zoom: 1,
        }),
      });

      // init feature overlay and map data
      featureOverlay.current = new Layer.Vector({
        source: new Source.Vector(),
        map: ref.current,
        style: function (feature) {
          highlightStyle.getText().setText(feature.get("name"));
          return highlightStyle;
        },
      });
      
      // init feature overlay and map data
      multiSelectOverlay.current = new Layer.Vector({
        source: new Source.Vector(),
        map: ref.current,
        style: function (feature) {
          multiSelectStyle.getText().setText(feature.get("name"));
          return multiSelectStyle;
        },
      });

      // Handle highlighting of the region hovered on the map
      ref.current.on("pointermove", function (e) {
        if (e.dragging) {
          return;
        }
        var pixel = ref.current.getEventPixel(e.originalEvent);
        highlightMapHoverEvent(pixel);
      });

      var highlightMapHoverEvent = (pixel) => {
        var feature = ref.current.forEachFeatureAtPixel(
          pixel,
          function (feature) {
            return feature;
          }
        );
        if (feature?.values_.name) {
          setHighlight(feature.values_.name);
        } else {
          setHighlight("Water Body");
        }
      };

      ref.current.on("click", function (e) {
        handleMapClickEvent(e.pixel);
      });

      var highlight;
      var handleMapClickEvent = (pixel) => {
        vectorLayer.current.getSource().forEachFeature(function (feature) {
          multiSelectOverlay.current.getSource().removeFeature(feature);
        });
        var feature = ref.current.forEachFeatureAtPixel(
          pixel,
          function (feature) {
            return feature;
          }
        );

        // Ensure the user clicked on a country on not an area with no data; i.e the water bodies
        if (feature?.values_.name) {
          setInfoData({
            title: feature.values_.name,
            data: getLanguagesByCounty(feature.values_.name),
            dataType: "searchByCountry",
          });
        } else {
          setInfoData({ title: "", data: "" });
          return;
        }
        // Only highlight the data clicked on the map
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
  }, []);

  // When the global state for the counties held added in multi select changes and hold values;
  useEffect(() => {
    // 1. We ensure the selected countries array holds values
    if (countryHighlights) {
      // 2. We clear the previously highlighted or selected data
      vectorLayer.current.getSource().forEachFeature(function (feature) {
        featureOverlay.current.getSource().removeFeature(feature);
      });
      let countries = countryHighlights.map((item) =>
      item.country.toLowerCase()
      );
      // 2. We clear the previously highlighted or selected data
      vectorLayer.current.getSource().forEachFeature(function (feature) {
        multiSelectOverlay.current.getSource().removeFeature(feature);
        // 3. We now highlight the selected data on the map in the multi select overlay
        if (countries.includes(feature.values_.name.toLowerCase())) {
          multiSelectOverlay.current.getSource().addFeature(feature);
        }
      });
    }
  }, [countryHighlights]);

  return (
    <>
      <div ref={mapRef} className="map" id="map"></div>
    </>
  );
};

export default MapComponent;
