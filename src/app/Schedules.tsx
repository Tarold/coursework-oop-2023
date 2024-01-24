import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Schedule } from './types';
import { IntervalInput } from './IntervalInput';

const ScheduleContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PointName = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const DateInfo = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StartNowButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const Schedules = ({
  schedulePoints,
  changeDate,
  startNow,
}: {
  schedulePoints: Schedule[];
  changeDate: (pointName: string, newDate?: Date, interval?: number) => void;
  startNow: (pointName: string) => void;
}) => {
  const sortedSchedulePoints = () => {
    return schedulePoints.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div>
      {sortedSchedulePoints().map((point) => (
        <ScheduleContainer key={point.name}>
          <PointName>{point.name}</PointName>
          <DateInfo>
            Time: {new Date(point.date).toLocaleTimeString()}
            <StartNowButton onClick={() => startNow(point.name)}>
              Start Now
            </StartNowButton>
          </DateInfo>
          <DateInfo>
            Date:{' '}
            <DatePicker
              selected={new Date(point.date)}
              onChange={(date) =>
                changeDate(point.name, new Date(date as Date))
              }
              minDate={new Date()}
              showTimeSelect
              filterTime={filterPassedTime}
              timeFormat="h:mm aa"
            />
          </DateInfo>
          <IntervalInput
            interval={point.interval}
            setInterval={(interval: number) => {
              console.log('interval :>> ', interval);
              changeDate(point.name, undefined, interval);
            }}
          ></IntervalInput>
        </ScheduleContainer>
      ))}
    </div>
  );
};
