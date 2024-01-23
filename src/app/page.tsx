'use client';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { api } from '@/api/api';
import WaterIntakeAutomation from './WaterIntakeAutomation';
import { Schedule, WaterIntakePoint } from './types';
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
  const [selectedPoint, setSelectedPoint] = useState<WaterIntakePoint | null>(
    null
  );
  const [waterPoints, setWaterPoints] =
    useState<Record<string, WaterIntakePoint>>();
  const [schedulesPoints, setSchedules] = useState<Record<string, Schedule>>(
    {}
  );
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
  const fetchSchedules = async () => {
    const points = await api.getSchedule();
    setSchedules(points);
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
  const handleStartNow = (name: string) => {
    api.setStatus(name, true);
    api.setData(name, { date: new Date() });
    fetchSchedules();
  };
  const handleChangeDate = (
    pointName: string,
    date?: Date,
    interval?: number
  ) => {
    api.setSchedule(pointName, date, interval);
    setSchedules((schedules) => {
      if (schedules)
        return {
          ...schedules,
          [pointName]: {
            ...schedules[pointName],
            ...(date ? { date } : {}),
            ...(interval ? { interval } : {}),
          },
        };
      return schedules;
    });
  };
  const setDateSchedules = () => {
    Object.values(schedulesPoints).forEach((schedule) => {
      if (new Date(schedule.date) < new Date()) {
        api.setSchedule(
          schedule.name,
          new Date(new Date().getTime() + firstPoint.interval)
        );
        api.setStatus(schedule.name, true);
        fetchSchedules();
        fetchWaterPoints();
      }
    });
  };

  useEffect(() => {
    api.initApp();
    fetchWaterPoints();
    fetchSchedules();
    setDateSchedules();
  }, [modalIsOpen]);
  const firstPoint = Object.values(schedulesPoints).reduce(function (
    next,
    now
  ) {
    return now.date < next.date ? now : next;
  },
  Object.values(schedulesPoints)[0]);

  const handleEndTimer = () => {
    api.setSchedule(
      firstPoint.name,
      new Date(new Date().getTime() + firstPoint.interval)
    );
    api.setStatus(firstPoint.name, true);
    fetchSchedules();
    fetchWaterPoints();
  };

  return (
    <Container>
      <Heading>Water Points</Heading>
      {firstPoint && (
        <TimeInterval
          time={firstPoint.date}
          name={firstPoint.name}
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
                          color: waterPoints[pointName].status
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
            {schedulesPoints && (
              <Schedules
                schedulePoints={schedulesPoints}
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
          >
            <ModalContent>
              <h2>{selectedPoint ? selectedPoint.name : 'New Point'}</h2>
              {selectedPoint ? (
                <WaterIntakeAutomation pointName={selectedPoint.name} />
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
