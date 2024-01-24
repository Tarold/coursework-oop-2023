'use client';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Schedule, WaterIntakePoint, WaterPoint } from './types';

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  margin: 10px;
`;

const StatusText = styled.p<{ isOpen: boolean }>`
  font-size: 18px;
  color: ${(props) => (props.isOpen ? 'green' : 'red')};
`;
const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
`;

const MessageContainer = styled.div`
  margin-top: 20px;
`;

const ProcessingMessage = styled.div`
  background-color: #ffd700;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
`;

const VisualizationContainer = styled.div`
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const IndicatorTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const IndicatorList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const IndicatorItem = styled.li`
  margin-bottom: 8px;
`;

const Value = styled.span`
  font-weight: bold;
`;

const WaterIntakeAutomation = ({
  waterPoint,
  fetchWaterData,
  updatePoint,
}: {
  waterPoint: WaterPoint;
  fetchWaterData: (a: string) => void;
  updatePoint: (
    pointName: string,
    updates: {
      data?: Partial<WaterIntakePoint> | undefined;
      schedule?: Partial<Schedule> | undefined;
    }
  ) => void;
}) => {
  const [isDone, setIsDone] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const setNewTimeout = () => {
      const timeoutId = setTimeout(() => {
        setIsDone(true);
      }, 5000);

      return timeoutId;
    };

    if (waterPoint.data?.status) {
      setIsDone(false);
    }
    if (!waterPoint.data?.status) {
      setIsDone(false);
      timer = setNewTimeout();
    }

    return () => {
      clearTimeout(timer), setIsDone(true);
    };
  }, [waterPoint.data.status]);

  const toggleIntake = async () => {
    updatePoint(waterPoint.data.name, {
      data: {
        status: !waterPoint.data.status,
      },
    });
    fetchWaterData('9');
  };

  const isIntakeOpen = waterPoint.data.status;
  const waterData = waterPoint.data.data;

  return (
    <Container>
      <StatusText isOpen={isIntakeOpen}>
        Статус водозабору: {isIntakeOpen ? 'Триває' : 'Простоює'}
      </StatusText>
      <Button onClick={toggleIntake}>
        {isIntakeOpen ? 'Припинити водозабір' : 'Почати водозабір'}
      </Button>

      {waterPoint === undefined && isIntakeOpen === false && (
        <MessageContainer>
          <p>Данних ще немає...</p>
        </MessageContainer>
      )}
      {isIntakeOpen === true && (
        <MessageContainer>
          <p>Триває водозабір...</p>
        </MessageContainer>
      )}
      {waterPoint !== undefined && isIntakeOpen === false && !isDone && (
        <ProcessingMessage>Оброблює данні</ProcessingMessage>
      )}
      {waterPoint !== undefined &&
        isIntakeOpen === false &&
        waterData &&
        isDone && (
          <div className="visualization">
            <IndicatorTitle>Хімічні Показники</IndicatorTitle>
            <IndicatorList>
              <IndicatorItem>
                Жорсткість води:{' '}
                <Value>
                  {waterData.chemicalIndicators.waterHardness.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Мінералізація води:{' '}
                <Value>
                  {waterData.chemicalIndicators.waterMineralization.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Вміст органічних речовин:{' '}
                <Value>
                  {waterData.chemicalIndicators.organicContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Вміст мікроелементів:{' '}
                <Value>
                  {waterData.chemicalIndicators.microelementsContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Вміст важких металів:{' '}
                <Value>
                  {waterData.chemicalIndicators.heavyMetalsContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Вміст забруднюючих речовин:{' '}
                <Value>
                  {waterData.chemicalIndicators.pollutantsContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
            </IndicatorList>

            <IndicatorTitle>Біологічні Показники</IndicatorTitle>
            <IndicatorList>
              <IndicatorItem>
                Вміст мікроорганізмів:{' '}
                <Value>
                  {waterData.biologicalIndicators.microorganismsContent.toFixed(
                    2
                  )}
                </Value>{' '}
                (шт/мл)
              </IndicatorItem>
              <IndicatorItem>
                Вміст планктону:{' '}
                <Value>
                  {waterData.biologicalIndicators.planktonContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
              <IndicatorItem>
                Вміст бентосу:{' '}
                <Value>
                  {waterData.biologicalIndicators.benthosContent.toFixed(2)}
                </Value>{' '}
                (мг/л)
              </IndicatorItem>
            </IndicatorList>
          </div>
        )}
    </Container>
  );
};

export default WaterIntakeAutomation;
