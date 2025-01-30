interface TimestampInfo {
  hours: number;
  minutes: number;
  seconds: number;
}

const createTimestampInfo = (timeMs: number): TimestampInfo => {
  const timeInSeconds: number = Math.floor(timeMs / 1000);

  const secondsInHour = 3600;
  const hours: number = Math.floor(timeInSeconds / secondsInHour);

  const hoursRemainder: number = timeInSeconds % secondsInHour;
  const secondsInMinute = 60;
  const minutes: number = Math.floor(hoursRemainder / secondsInMinute);

  const seconds: number = Math.floor(hoursRemainder % secondsInMinute);
  return { hours, minutes, seconds };
};

const pad = (timePart: number): string => {
  const partAsString = `${timePart}`;
  const maxLength: number = Math.max(partAsString.length, 2);
  return partAsString.padStart(maxLength, "0");
};

export const formatTime = (timeMs: number): string => {
  const { hours, minutes, seconds }: TimestampInfo =
    createTimestampInfo(timeMs);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
