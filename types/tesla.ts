// Define type for a single highway data point
interface HighwayData {
  kmh: number;
  kilometers: number;
}

// Define type for the range data
interface RangeData {
  temp: number;
  wheelsize: number;
  ac: string;
  hwy: HighwayData[];
}

// Define type for the vehicle model data array
export type VehicleModelData = RangeData[];
