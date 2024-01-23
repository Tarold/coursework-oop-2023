'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
  gap: 5px;
`;

const Input = styled.input`
  width: 50px;
`;

export const IntervalInput = ({
  interval,
  setInterval,
}: {
  interval: number;
  setInterval: (int: number) => void;
}) => {
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0) {
      const daysFromInterval = Math.floor(interval / (24 * 60 * 60 * 1000));
      const hoursFromInterval = Math.floor(
        (interval % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutesFromInterval = Math.floor(
        (interval % (60 * 60 * 1000)) / (60 * 1000)
      );

      setDays(daysFromInterval);
      setHours(hoursFromInterval);
      setMinutes(minutesFromInterval);
    }
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const millisecondsInHour = 60 * 60 * 1000;
    const millisecondsInMinute = 60 * 1000;

    const totalMilliseconds =
      days * millisecondsInDay +
      hours * millisecondsInHour +
      minutes * millisecondsInMinute;
    if (interval !== totalMilliseconds) setInterval(totalMilliseconds);
  }, [interval, setInterval, days, hours, minutes]);

  const handleDaysChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) return;
    setDays(Number(event.target.value));
  };

  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) return;
    setHours(Number(event.target.value));
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) return;
    setMinutes(Number(event.target.value));
  };

  return (
    <Container>
      <p>interval D/H/M </p>
      <Input type="number" value={days} onChange={handleDaysChange} />
      <Input type="number" value={hours} onChange={handleHoursChange} />
      <Input type="number" value={minutes} onChange={handleMinutesChange} />
    </Container>
  );
};
