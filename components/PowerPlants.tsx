import Link from "next/link";

export default function PowerPlants({ types }: { types: string[] }) {
  return (
    <ul className="list-none flex flex-col w-full divide-y m-0 p-0">
      {types.map((value, idx) => (
        <li
          className="flex w-full p-2 overflow-auto hover:border-l-blue-800 hover:border-l-4 hover:cursor-pointer"
          key={`${value}-${idx}`}
        >
          <Link className="w-full" href={`/map/${value}`}>
            {value}
          </Link>
        </li>
      ))}
    </ul>
  );
}
