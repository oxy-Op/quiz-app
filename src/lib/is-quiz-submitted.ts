import { read } from "./db-provider";

export async function readArrayByKey(
  key: string,
  key2: string,
  primaryKey: string,
  searchValue: any
): Promise<Record<string, any>[]> {
  const data = await read(key);

  if (data && Array.isArray(data[key2])) {
    // Filter the objects based on the matching primary key and search value
    const matchingData = data[key2].filter((item: Record<string, any>) => {
      return item[primaryKey] === searchValue;
    });

    return matchingData;
  } else {
    return []; // Return an empty array if the key or the array doesn't exist
  }
}
