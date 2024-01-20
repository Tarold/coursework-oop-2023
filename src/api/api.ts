import { WaterIntakePoint } from '@/app/types';

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomString = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 8;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateChemicalData = () => {
  return {
    pH: getRandomNumber(6.5, 8.5),
    waterHardness: getRandomNumber(50, 150),
    waterMineralization: getRandomNumber(100, 300),
    organicContent: getRandomNumber(5, 20),
    microelementsContent: getRandomNumber(1, 10),
    heavyMetalsContent: getRandomNumber(0.1, 1),
    pollutantsContent: getRandomNumber(0.5, 5),
  };
};

const generatePhysicalData = () => {
  return {
    waterTemperature: getRandomNumber(5, 30),
    waterTransparency: getRandomNumber(0.1, 1),
    waterColor: getRandomString(),
    waterOdor: getRandomString(),
    waterTaste: getRandomString(),
  };
};

const generateBiologicalData = () => {
  return {
    microorganismsContent: getRandomNumber(100, 1000),
    planktonContent: getRandomNumber(0.1, 5),
    benthosContent: getRandomNumber(0.01, 1),
  };
};

const generateData = (pointName?: string) => {
  const data = {
    chemicalIndicators: generateChemicalData(),
    physicalIndicators: generatePhysicalData(),
    biologicalIndicators: generateBiologicalData(),
  };

  if (pointName) {
    const storedData = JSON.parse(localStorage.getItem('waterData') || '{}');

    const point = { ...storedData[pointName], data };
    localStorage.setItem(
      'waterData',
      JSON.stringify({ ...storedData, [pointName]: point })
    );
  }
  return data;
};

const waterIntakePoints: Record<string, WaterIntakePoint> = {
  'Point A': {
    name: 'Point A',
    data: generateData(),
    status: true,
  },
  'Point B': {
    name: 'Point B',
    data: generateData(),
    status: true,
  },
  'Point C': {
    name: 'Point C',
    data: generateData(),
    status: true,
  },
};

const initApp = async () => {
  if (
    !(JSON.parse(localStorage.getItem('waterData') || '{}') as Record<
      string,
      WaterIntakePoint
    >)
  )
    localStorage.setItem('waterData', JSON.stringify(waterIntakePoints));
};
const fetchData = async () => {
  if (!localStorage.getItem('waterData')) {
    await initApp();
  }
  return JSON.parse(localStorage.getItem('waterData') || '{}') as Record<
    string,
    WaterIntakePoint
  >;
};
const getData = async (pointName: string) => {
  let storedData = JSON.parse(localStorage.getItem('waterData') || '{}');
  if (!storedData[pointName]) {
    return await generateData(pointName);
  }
  return storedData[pointName].data;
};

const getStatus = (pointName: string) => {
  const storedData = JSON.parse(localStorage.getItem('waterData') || '{}');
  const point = storedData[pointName];
  return point ? point.status : false;
};

const setStatus = async (pointName: string, status: boolean) => {
  const storedData = JSON.parse(localStorage.getItem('waterData') || '{}');
  const point = { ...storedData[pointName], status };
  localStorage.setItem(
    'waterData',
    JSON.stringify({ ...storedData, [pointName]: point })
  );
  if (status) generateData(pointName);
  return status;
};

export const api = {
  initApp,
  fetchData,
  getData,
  getStatus,
  setStatus,
};
