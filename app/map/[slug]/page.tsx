"use client";

import "@arcgis/core/assets/esri/themes/dark/main.css";
import {
  ArcgisExpand,
  ArcgisLegend,
  ArcgisMap,
} from "@arcgis/map-components-react";

import { ArcgisChartsScatterPlot } from "@arcgis/charts-components-react";
import { ScatterPlotModel } from "@arcgis/charts-model";

import config from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import { useEffect, useRef, useState } from "react";

config.apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY as string;

export default function WebMap({ params }: { params: { slug: string } }) {
  const mapRef = useRef<HTMLArcgisMapElement>(null);
  const scatterPlotRef = useRef<any>();
  const [chartConfig, setChartConfig] = useState<any>(undefined);
  const [featureLayer, setFeatureLayer] = useState<any>(undefined);

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
    import("@arcgis/charts-components/dist/loader").then(
      ({ defineCustomElements }) => {
        defineCustomElements(globalThis as any, {
          resourcesUrl: "https://js.arcgis.com/charts-components/4.29/t9n",
        });
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
      const scatterPlotParams = {
        layer,
        xAxisFieldName: "estimated_generation_gwh",
        yAxisFieldName: "capacity_mw",
      };
      const scatterPlotModel = new ScatterPlotModel(scatterPlotParams);
      const config = await scatterPlotModel.config;
      setFeatureLayer(layer);
      setChartConfig(config);
    });
  }

  return (
    <div className="w-full h-full">
      <section className="w-full h-3/4">
        <ArcgisMap
          ref={mapRef}
          basemap="arcgis/dark-gray"
          popup={popupOptions}
          onArcgisViewReadyChange={handleViewReady}
        >
          <ArcgisExpand position="bottom-left">
            <ArcgisLegend legendStyle="card" />
          </ArcgisExpand>
        </ArcgisMap>
      </section>
      <ArcgisChartsScatterPlot
        ref={scatterPlotRef}
        placeholder="Loading..."
        displayErrorAlert={false}
        config={chartConfig}
        layer={featureLayer}
        className="w-full h-1/4"
      ></ArcgisChartsScatterPlot>
    </div>
  );
}
