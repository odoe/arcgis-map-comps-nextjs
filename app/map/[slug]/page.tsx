"use client";

import "@arcgis/core/assets/esri/themes/dark/main.css";
import {
  ArcgisExpand,
  ArcgisLegend,
  ArcgisMap,
} from "@arcgis/map-components-react";

import config from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import { useEffect, useRef } from "react";

config.apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY as string;

export default function WebMap({ params }: { params: { slug: string } }) {
  const mapRef = useRef<HTMLArcgisMapElement>(null);

  // Popup options
  const popupOptions: any = {
    dockEnabled: true,
    dockOptions: {
      buttonEnabled: false,
      breakpoint: false,
      position: "top-right",
    },
  };

  useEffect(() => {
    // Lazy load the custom elements
    import("@arcgis/map-components/dist/loader").then(
      ({ defineCustomElements }) => {
        defineCustomElements();
      },
    );
  }, []);

  // When the view is ready, add the layer to the map and zoom to it
  function handleViewReady() {
    const mapElement = mapRef.current!;
    const layer = new FeatureLayer({
      portalItem: {
        id: "848d61af726f40d890219042253bedd7",
      },
      definitionExpression: `fuel1 = '${decodeURI(params.slug)}'`,
      visible: true,
    });

    mapElement.map.add(layer);
    layer.when(async () => {
      const query = layer.createQuery();
      const extent = await layer.queryExtent(query);
      mapElement.goTo(extent);
    });
  }

  return (
    <div className="w-full h-full">
      <ArcgisMap
        ref={mapRef}
        basemap="arcgis/dark-gray"
        popup={popupOptions}
        onArcgisViewReadyChange={handleViewReady}
      >
        <ArcgisExpand position="bottom-left">
          <ArcgisLegend />
        </ArcgisExpand>
      </ArcgisMap>
    </div>
  );
}
