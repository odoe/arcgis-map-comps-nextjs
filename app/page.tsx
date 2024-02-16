import PowerPlants from "@/components/PowerPlants";
import { getPowerPlants } from "./utils";

export const revalidate = 3600;

export default async function Home() {
  const data = await getPowerPlants();

  return (
    <section className="flex flex-col w-full items-center justify-between">
      <PowerPlants {...data} />
    </section>
  );
}
