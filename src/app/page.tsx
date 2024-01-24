'use client';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { api } from '@/api/api';
import WaterIntakeAutomation from './WaterIntakeAutomation';
import { WaterIntakePoints, WaterPoint } from './types';
import styled from 'styled-components';
import { Schedules } from './Schedules';
import { TimeInterval } from './Timer';
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`;

const Heading = styled.h1`
  color: #333;
`;

const LoadingMessage = styled.p`
  color: #888;
`;

const Name = styled.span`
  font-weight: bold;
  width: 40%;
`;

const EditContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 40%;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  min-width: 900px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  gap: 20px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button`
  align-items: center;
  background-clip: padding-box;
  background-color: #0074cc;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;

  &:hover,
  &:focus {
    background-color: #005aa3;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    background-color: #003366;
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    transform: translateY(0);
  }
`;

const MarginButton = styled(Button)`
  margin-left: auto;
`;
const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #0074cc;
  border-radius: 0.25rem;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: #005aa3;
    box-shadow: 0 0 5px rgba(0, 116, 204, 0.5);
  }
`;

const DeleteNotification = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-radius: 5px;
`;

const AddPointListItem = styled(ListItem)`
  font-weight: bold;
`;

const ModalContent = styled.div`
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const WaterPointsPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<WaterPoint | null>(null);
  const [waterPoints, setWaterPoints] = useState<WaterIntakePoints>({});
  const [newPointName, setNewPointName] = useState('');
  const [renameName, setRenameName] = useState('');
  const [deleteName, setDeleteName] = useState('');

  const openModal = (point: WaterPoint) => {
    setSelectedPoint(point);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPoint(null);
  };

  const fetchWaterPoints = async (a: string) => {
    const points = await api.getPoints();
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
    fetchWaterPoints('1');
  };
  const handleDeletePoint = () => {
    api.deletePoint(deleteName);
    setDeleteName('');
    setModalIsOpen(false);
    fetchWaterPoints('2');
  };
  const handleStartNow = (name: string) => {
    api.updatePoint(name, {
      data: { status: true },
      schedule: { date: new Date() },
    });
    fetchWaterPoints('3');
  };
  const handleChangeDate = (
    pointName: string,
    date?: Date,
    interval?: number
  ) => {
    api.updatePoint(pointName, {
      schedule: {
        ...(date ? { date } : {}),
        ...(interval ? { interval } : {}),
      },
    });
    fetchWaterPoints('4');
  };

  const setDateSchedules = () => {
    Object.values(waterPoints).forEach((waterPoint) => {
      if (new Date(waterPoint.schedule.date) < new Date()) {
        api.updatePoint(waterPoint.data.name, {
          data: { status: true },
          schedule: {
            date: new Date(new Date().getTime() + waterPoint.schedule.interval),
          },
        });
        fetchWaterPoints('5');
      }
    });
  };

  useEffect(() => {
    api.initApp();
    fetchWaterPoints('6');
    setDateSchedules();
  }, [modalIsOpen]);

  const firstPoint = Object.values(waterPoints).reduce(function (next, now) {
    return now.schedule.date < next.schedule.date ? now : next;
  }, Object.values(waterPoints)[0]);

  const handleEndTimer = () => {
    api.updatePoint(firstPoint.data.name, {
      data: { status: true },
      schedule: {
        date: new Date(new Date().getTime() + firstPoint.schedule.interval),
      },
    });
    fetchWaterPoints('7');
  };

  return (
    <Container>
      <Heading>Water Points</Heading>
      {firstPoint && (
        <TimeInterval
          time={firstPoint.schedule.date}
          name={firstPoint.schedule.name}
          onEndTimer={handleEndTimer}
        ></TimeInterval>
      )}
      {!waterPoints && <LoadingMessage>Loading...</LoadingMessage>}
      {waterPoints && (
        <>
          <Content>
            <List>
              {Object.keys(waterPoints).map((pointName) =>
                deleteName === pointName ? (
                  <DeleteNotification key={pointName}>
                    If you delete the data, <br />
                    it will be impossible to restore them.
                    <div>
                      <Button onClick={() => handleDeletePoint()}>
                        delete
                      </Button>
                      <Button onClick={() => setDeleteName('')}>cancel</Button>
                    </div>
                  </DeleteNotification>
                ) : (
                  <ListItem
                    key={pointName}
                    onClick={() => openModal(waterPoints[pointName])}
                  >
                    {renameName === pointName ? (
                      <EditContainer>
                        <Input
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
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            newPointName !== '' && handleRenamePoint();
                          }}
                        >
                          done
                        </Button>
                      </EditContainer>
                    ) : (
                      <Name>{pointName}</Name>
                    )}
                    <span style={{ marginLeft: '10px' }}>
                      Status:{' '}
                      <span
                        style={{
                          color: waterPoints[pointName].data.status
                            ? 'lightgreen'
                            : 'lightcoral',
                          fontWeight: 'bold',
                        }}
                      >
                        ●
                      </span>
                    </span>
                    <MarginButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (renameName === pointName) {
                          setNewPointName('');
                          setRenameName('');
                          return;
                        }
                        setNewPointName(pointName);
                        setRenameName(pointName);
                      }}
                    >
                      edit
                    </MarginButton>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteName(pointName);
                      }}
                    >
                      delete
                    </Button>
                  </ListItem>
                )
              )}
              <AddPointListItem onClick={() => setModalIsOpen(true)}>
                <span>Add new point</span>
              </AddPointListItem>
            </List>
            {waterPoints && (
              <Schedules
                schedulePoints={Object.values(waterPoints).map((point) => ({
                  ...point.schedule,
                }))}
                changeDate={handleChangeDate}
                startNow={handleStartNow}
              ></Schedules>
            )}
          </Content>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Water Point Modal"
            ariaHideApp={false}
            style={{
              content: {
                width: '600px',
                margin: 'auto',
              },
            }}
          >
            <ModalContent>
              <h2>{selectedPoint ? selectedPoint.data.name : 'New Point'}</h2>
              {selectedPoint ? (
                <WaterIntakeAutomation
                  waterPoint={waterPoints[selectedPoint.data.name]}
                  fetchWaterData={fetchWaterPoints}
                  updatePoint={api.updatePoint}
                />
              ) : (
                <div>
                  <label>
                    Point Name:{' '}
                    <Input
                      type="text"
                      value={newPointName}
                      onChange={(e) => setNewPointName(e.target.value)}
                    />
                  </label>{' '}
                  <Button onClick={handleAddPoint}>Add Point</Button>
                </div>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default WaterPointsPage;
