import PowerPlants from "@/components/PowerPlants";
import config from "@arcgis/core/config";
import { executeQueryJSON } from "@arcgis/core/rest/query";

config.request.useIdentity = false;

const PLANT_URL =
  "https://services1.arcgis.com/4yjifSiIG17X0gW4/arcgis/rest/services/PowerPlants_WorldResourcesInstitute/FeatureServer/0";

export default async function Home() {
  const query = {
    outFields: ["fuel1"],
    where: "1=1",
    returnDistinctValues: true,
    returnGeometry: false,
  };
  const results = await executeQueryJSON(PLANT_URL, query);
  const values = results.features
    .map((feature) => feature.attributes["fuel1"])
    .filter(Boolean)
    .sort();

  const data = { types: values } as const;

  return (
    <section className="flex flex-col w-full items-center justify-between">
      <PowerPlants {...data} />
    </section>
  );
}
