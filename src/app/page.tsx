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
  const [newPointName, setNewPointName] = useState('');
  const [renameName, setRenameName] = useState('');
  const [deleteName, setDeleteName] = useState('');

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
  const handleAddPoint = () => {
    api.addPoint(newPointName);
    setNewPointName('');
    setModalIsOpen(false);
  };
  const handleRenamePoint = () => {
    api.renamePoint(renameName, newPointName);
    setRenameName('');
    setNewPointName('');
    setModalIsOpen(false);
    fetchWaterPoints();
  };
  const handleDeletePoint = () => {
    api.deletePoint(deleteName);
    setDeleteName('');
    setModalIsOpen(false);
    fetchWaterPoints();
  };

  useEffect(() => {
    api.initApp();
    fetchWaterPoints();
  }, [modalIsOpen]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <h1>Water Points</h1>
      {!waterPoints && <p>Loading...</p>}
      {waterPoints && (
        <>
          <ul>
            {Object.keys(waterPoints).map((pointName) =>
              deleteName === pointName ? (
                <div key={pointName}>
                  If you delete the data, it will be impossible to restore them.
                  <button onClick={() => handleDeletePoint()}>delete</button>
                  <button onClick={() => setDeleteName('')}>cancel</button>
                </div>
              ) : (
                <li
                  key={pointName}
                  onClick={() => openModal(waterPoints[pointName])}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    margin: '5px',
                    borderRadius: '5px',
                  }}
                >
                  {renameName === pointName ? (
                    <>
                      <input
                        type="text"
                        value={newPointName}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          setNewPointName(e.target.value);
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          newPointName !== '' && handleRenamePoint();
                        }}
                      >
                        done
                      </button>
                    </>
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{pointName}</span>
                  )}
                  <span style={{ marginLeft: '10px' }}>
                    Status:{' '}
                    <span
                      style={{
                        color: waterPoints[pointName].status
                          ? 'lightgreen'
                          : 'lightcoral',
                        fontWeight: 'bold',
                      }}
                    >
                      ●
                    </span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewPointName(pointName);
                      setRenameName(pointName);
                    }}
                  >
                    edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteName(pointName);
                    }}
                  >
                    delete
                  </button>
                </li>
              )
            )}
            <li
              key={'newPintName'}
              onClick={() => setModalIsOpen(true)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                margin: '5px',
                borderRadius: '5px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Add new point</span>
            </li>
          </ul>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Water Point Modal"
            ariaHideApp={false}
          >
            <h2>{selectedPoint ? selectedPoint.name : 'New Point'}</h2>
            {selectedPoint ? (
              <WaterIntakeAutomation pointName={selectedPoint.name} />
            ) : (
              <div>
                <label>
                  Point Name:
                  <input
                    type="text"
                    value={newPointName}
                    onChange={(e) => setNewPointName(e.target.value)}
                  />
                </label>
                <button onClick={handleAddPoint}>Add Point</button>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default WaterPointsPage;
