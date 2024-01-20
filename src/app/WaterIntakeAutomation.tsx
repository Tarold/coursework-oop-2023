'use client';
import { api } from '@/api/api';
import React, { useState, useEffect } from 'react';
import { WaterData } from './types';

const WaterIntakeAutomation = ({ pointName }: { pointName: string }) => {
  const [waterData, setWaterData] = useState<WaterData>();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  const fetchWaterData = async () => {
    const data = await api.getData(pointName);
    setWaterData(data);
  };

  const fetchIntakeStatus = async () => {
    const data = await api.getStatus(pointName);
    setIsIntakeOpen(data);
  };

  useEffect(() => {
    api.initApp();
    fetchWaterData();
    fetchIntakeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleIntake = async () => {
    const newIntakeStatus = !isIntakeOpen;
    console.log('newIntakeStatus :>> ', newIntakeStatus);
    const data = await api.setStatus(pointName, newIntakeStatus);
    if (data === undefined) return;
    if (!data) fetchWaterData();

    setIsIntakeOpen(data);
  };

  return (
    <div>
      <p>Статус водозабору: {isIntakeOpen ? 'Триває' : 'Простоює'}</p>
      <button onClick={toggleIntake}>
        {isIntakeOpen ? 'Припинити водозабір' : 'Почати водозабір'}
      </button>

      {waterData === undefined && <p>Завантаження даних...</p>}
      {waterData !== undefined && isIntakeOpen === true && (
        <p>Триває водозабір...</p>
      )}
      {waterData !== undefined && isIntakeOpen === false && (
        <div className="visualization">
          <h2>Хімічні Показники</h2>
          <ul>
            <li>
              Жорсткість води:{' '}
              {waterData.chemicalIndicators.waterHardness.toFixed(2)} (мг/л)
            </li>
            <li>
              Мінералізація води:{' '}
              {waterData.chemicalIndicators.waterMineralization.toFixed(2)}{' '}
              (мг/л)
            </li>
            <li>
              Вміст органічних речовин:{' '}
              {waterData.chemicalIndicators.organicContent.toFixed(2)} (мг/л)
            </li>
            <li>
              Вміст мікроелементів:{' '}
              {waterData.chemicalIndicators.microelementsContent.toFixed(2)}{' '}
              (мг/л)
            </li>
            <li>
              Вміст важких металів:{' '}
              {waterData.chemicalIndicators.heavyMetalsContent.toFixed(2)}{' '}
              (мг/л)
            </li>
            <li>
              Вміст забруднюючих речовин:{' '}
              {waterData.chemicalIndicators.pollutantsContent.toFixed(2)} (мг/л)
            </li>
          </ul>

          <h2>Фізичні Показники</h2>
          <ul>
            <li>
              Температура води:{' '}
              {waterData.physicalIndicators.waterTemperature.toFixed(2)} (°C)
            </li>
            <li>
              Прозорість води:{' '}
              {waterData.physicalIndicators.waterTransparency.toFixed(2)}{' '}
              (одиниці відносності)
            </li>
            <li>Колір води: {waterData.physicalIndicators.waterColor}</li>
            <li>Запах води: {waterData.physicalIndicators.waterOdor}</li>
            <li>Смак води: {waterData.physicalIndicators.waterTaste}</li>
          </ul>

          <h2>Біологічні Показники</h2>
          <ul>
            <li>
              Вміст мікроорганізмів:{' '}
              {waterData.biologicalIndicators.microorganismsContent.toFixed(2)}{' '}
              (шт/мл)
            </li>
            <li>
              Вміст планктону:{' '}
              {waterData.biologicalIndicators.planktonContent.toFixed(2)} (мг/л)
            </li>
            <li>
              Вміст бентосу:{' '}
              {waterData.biologicalIndicators.benthosContent.toFixed(2)} (мг/л)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeAutomation;
