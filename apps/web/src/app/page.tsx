import { CountySearch } from "@/components/county-search";
import { getCounties } from "@/lib/data";

export default async function HomePage() {
  const counties = await getCounties();
  const options = counties.map(({ fips, name, state }) => ({ fips, name, state }));

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center pb-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">Powered land for data centers</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
        Where would you like to explore?
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">
        See the power, land and parcels a county offers, how its residents feel, and the projects that could
        earn their support.
      </p>
      <div className="mt-12 w-full max-w-2xl">
        <CountySearch counties={options} />
      </div>
    </div>
  );
}
