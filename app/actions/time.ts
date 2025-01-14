export const calculateDurationInSeconds = (startTime: Date) => {
    const durationInMs = new Date().getTime() - startTime.getTime();
    return Math.round(durationInMs / 1000); // Convert to seconds and round to nearest integer
  };