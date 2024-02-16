"use client";

import { useEffect, useRef } from "react";
import {
  ArcgisExpand,
  ArcgisLegend,
  ArcgisMap,
} from "@arcgis/map-components-react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";

const ClientMap = ({ layerData }: { layerData: IQueryFeaturesResponse }) => {
  const mapRef = useRef<HTMLArcgisMapElement>(null);

  // Popup options
//   const popupOptions: any = {
//     dockEnabled: true,
//     dockOptions: {
//       buttonEnabled: false,
//       breakpoint: false,
//       position: "top-right",
//     },
//   };

  useEffect(() => {
    // Lazy load the custom elements
    import("@arcgis/map-components/dist/loader").then(
      ({ defineCustomElements }) => {
        defineCustomElements();
      }
    );
  }, []);

  // When the view is ready, add the layer to the map and zoom to it
  function handleViewReady() {
    const mapElement = mapRef.current!;
    // @ts-ignore
    const graphics = layerData.features.map((feature) => new Graphic({
        geometry: new Point(feature.geometry),
        attributes: feature.attributes,
    }));
    const layer = new FeatureLayer({
        fields: [
            {
                name: "OBJECTID",
                alias: "OBJECTID",
                type: "oid",
            },
            {
                name: "fuel1",
                alias: "Fuel Type",
                type: "string",
            }
        ],
        objectIdField: "OBJECTID",
        source: graphics,
    })
    mapElement.map.add(layer);
    layer.when(async () => {
      const query = layer.createQuery();
      const extent = await layer.queryExtent(query);
      mapElement.goTo(extent);
    });
  }
  return (
    <div className="w-full h-full">
      <ArcgisMap onArcgisViewReadyChange={handleViewReady} ref={mapRef}>
        <ArcgisExpand position="bottom-left">
          <ArcgisLegend />
        </ArcgisExpand>
      </ArcgisMap>
    </div>
  );
};

export default ClientMap;
