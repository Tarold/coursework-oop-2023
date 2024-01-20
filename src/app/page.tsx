'use client';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { api } from '@/api/api';
import WaterIntakeAutomation from './WaterIntakeAutomation';
import { WaterIntakePoint } from './types';

const WaterPointsPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<WaterIntakePoint | null>(
    null
  );
  const [waterPoints, setWaterPoints] =
    useState<Record<string, WaterIntakePoint>>();

  const openModal = (point: WaterIntakePoint) => {
    setSelectedPoint(point);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPoint(null);
  };

  const fetchWaterPoints = async () => {
    const points = await api.fetchData();
    setWaterPoints(points);
  };

  useEffect(() => {
    fetchWaterPoints();
  }, []);

  return (
    <div>
      <h1>Water Points</h1>
      {waterPoints && (
        <>
          <ul>
            {Object.keys(waterPoints).map((pointName) => (
              <li
                key={pointName}
                onClick={() => openModal(waterPoints[pointName])}
              >
                {waterPoints[pointName].name}
                {waterPoints[pointName].status}
              </li>
            ))}
          </ul>
          {selectedPoint && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Water Point Modal"
              ariaHideApp={false}
            >
              <WaterIntakeAutomation pointName={selectedPoint.name} />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default WaterPointsPage;
