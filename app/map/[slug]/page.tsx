import "@arcgis/core/assets/esri/themes/dark/main.css";
import { executeQueryJSON } from "@arcgis/core/rest/query";
import config from "@arcgis/core/config";
import ClientMap from "@/components/ClientMap";
import { IQueryFeaturesResponse, queryFeatures } from '@esri/arcgis-rest-feature-service';

config.apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY as string;

interface SlugProps { params: { slug: string }};

const PLANT_URL =
  "https://services1.arcgis.com/4yjifSiIG17X0gW4/arcgis/rest/services/PowerPlants_WorldResourcesInstitute/FeatureServer/0";


// generate the static paths for the dynamic routes
export async function generateStaticParams(): Promise<SlugProps[]>
 {
  const query = {
    outFields: ["fuel1", "OBJECTID"],
    where: "1=1",
    returnDistinctValues: true,
    returnGeometry: false,
  };
  const results = await executeQueryJSON(PLANT_URL, query);
  const values = results.features
    .map((feature) => feature.attributes["fuel1"])
    .filter(Boolean)
    .sort();

  const paths: SlugProps[] = values.map((value) => ({ params: { slug: value } }));
  return paths;
}

export const getLayer = async (params: SlugProps["params"]) => {
  const data = await queryFeatures({
    url: PLANT_URL,
    outFields: ["OBJECTID", "fuel1"],
    where: `fuel1 = '${decodeURI(params.slug)}'`,
  }) as IQueryFeaturesResponse;
  return data;
};


export default async function WebMap({ params }: SlugProps) {
  // for each dynamic route, get the data for the page by querying the feature layer
  const layerData = await getLayer(params);

  return (
    <div className="w-full h-full">
      {/** pass the feature data down to the client map, which will render the graphics without a network request */}
      <ClientMap layerData={layerData} />
    </div>
  );
}