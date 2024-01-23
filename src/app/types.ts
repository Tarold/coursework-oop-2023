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
  physicalIndicators: PhysicalIndicators;
  biologicalIndicators: BiologicalIndicators;
}
export interface WaterIntakePoint {
  name: string;
  data?: WaterData;
  lastWaterIntake: Date | undefined;
  status: boolean;
}

export type Schedule = { name: string; date: Date; interval: number };
