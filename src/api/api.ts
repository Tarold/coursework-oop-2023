import {
  Schedule,
  WaterIntakePoint,
  WaterIntakePoints,
  WaterPoint,
} from '@/app/types';

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

const generateBiologicalData = () => {
  return {
    microorganismsContent: getRandomNumber(100, 1000),
    planktonContent: getRandomNumber(0.1, 5),
    benthosContent: getRandomNumber(0.01, 1),
  };
};

const generateData = () => {
  return {
    chemicalIndicators: generateChemicalData(),
    biologicalIndicators: generateBiologicalData(),
  };
};

const points: WaterIntakePoints = {
  'Point A': {
    data: {
      name: 'Point A',
      data: generateData(),
      status: true,
    },
    schedule: {
      name: 'Point A',
      date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      interval: 1000 * 60 * 60 * 24,
    },
  },
  'Point B': {
    data: {
      name: 'Point B',
      data: generateData(),
      status: true,
    },
    schedule: {
      name: 'Point B',
      date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      interval: 1000 * 60 * 60 * 24,
    },
  },
  'Point C': {
    data: {
      name: 'Point C',
      data: generateData(),
      status: true,
    },
    schedule: {
      name: 'Point C',
      date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      interval: 1000 * 60 * 60 * 24,
    },
  },
};

const initApp = async () => {
  if (!localStorage.getItem('waterData')) {
    localStorage.setItem('waterData', JSON.stringify(points));
  }
};

const getPoints = async (): Promise<
  Record<string, { data: WaterIntakePoint; schedule: Schedule }>
> => {
  if (!localStorage.getItem('waterData')) {
    await initApp();
  }
  const storedData = JSON.parse(
    localStorage.getItem('waterData') || '{}'
  ) as Record<string, { data: WaterIntakePoint; schedule: Schedule }>;
  return storedData;
};

const updatePoint = async (
  pointName: string,
  updates: { data?: Partial<WaterIntakePoint>; schedule?: Partial<Schedule> }
): Promise<void> => {
  const storedData = JSON.parse(
    localStorage.getItem('waterData') || '{}'
  ) as Record<string, WaterIntakePoints>;

  const point = storedData[pointName];

  if (point) {
    const newData = {
      ...point.data,
      ...(updates.data || {}),
    } as WaterIntakePoint;
    const newSchedule = {
      ...point.schedule,
      ...(updates.schedule || {}),
    } as Schedule;

    const newPoint: WaterPoint = {
      data: newData,
      schedule: newSchedule,
    };

    localStorage.setItem(
      'waterData',
      JSON.stringify({ ...storedData, [pointName]: newPoint })
    );
  }
};

const addPoint = async (
  pointName: string
): Promise<{ data: WaterIntakePoint; schedule: Schedule }> => {
  const storedData = JSON.parse(
    localStorage.getItem('waterData') || '{}'
  ) as Record<string, { data: WaterIntakePoint; schedule: Schedule }>;
  const newPoint = {
    data: { name: pointName, status: false, data: generateData() },
    schedule: {
      name: pointName,
      date: new Date(),
      interval: 1000 * 60 * 60 * 24,
    },
  };
  localStorage.setItem(
    'waterData',
    JSON.stringify({ ...storedData, [pointName]: newPoint })
  );
  return newPoint;
};

const renamePoint = async (
  oldPointName: string,
  newPointName: string
): Promise<void> => {
  const storedData = JSON.parse(
    localStorage.getItem('waterData') || '{}'
  ) as Record<string, { data: WaterIntakePoint; schedule: Schedule }>;
  const point = storedData[oldPointName];
  if (point) {
    const newPoint = {
      ...point,
      data: { ...point.data, name: newPointName },
      schedule: { ...point.schedule, name: newPointName },
    };
    const newStoredData = Object.fromEntries(
      Object.entries(storedData).filter(([key]) => key !== oldPointName)
    );
    localStorage.setItem(
      'waterData',
      JSON.stringify({ ...newStoredData, [newPointName]: newPoint })
    );
  }
};

const deletePoint = async (pointName: string): Promise<void> => {
  const storedData = JSON.parse(
    localStorage.getItem('waterData') || '{}'
  ) as Record<string, { data: WaterIntakePoint; schedule: Schedule }>;
  const newStoredData = { ...storedData };
  delete newStoredData[pointName];
  localStorage.setItem('waterData', JSON.stringify(newStoredData));
};

export const api = {
  initApp,
  getPoints,
  updatePoint,
  addPoint,
  renamePoint,
  deletePoint,
};
