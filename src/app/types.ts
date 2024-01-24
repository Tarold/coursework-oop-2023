interface ChemicalIndicators {
  pH: number;
  waterHardness: number;
  waterMineralization: number;
  organicContent: number;
  microelementsContent: number;
  heavyMetalsContent: number;
  pollutantsContent: number;
}

interface PhysicalIndicators {
  waterTemperature: number;
  waterTransparency: number;
  waterColor: string;
  waterOdor: string;
  waterTaste: string;
}

interface BiologicalIndicators {
  microorganismsContent: number;
  planktonContent: number;
  benthosContent: number;
}

export interface WaterData {
  chemicalIndicators: ChemicalIndicators;
  biologicalIndicators: BiologicalIndicators;
}
export interface WaterIntakePoint {
  name: string;
  data?: WaterData;
  status: boolean;
}

export type WaterPoint = {
  data: WaterIntakePoint;
  schedule: Schedule;
};

export type Schedule = { name: string; date: Date; interval: number };

export type WaterIntakePoints = Record<string, WaterPoint>;
