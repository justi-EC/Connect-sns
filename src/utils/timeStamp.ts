export const timeStamp = (value: string) => {
  //TODO:
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "just now";
  if (betweenTime < 60) {
    return `${betweenTime} m`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour} h`;
  }

  const year = timeValue.getFullYear();
  const month =
    timeValue.getMonth() + 1 < 10
      ? "0" + (timeValue.getMonth() + 1)
      : timeValue.getMonth() + 1;
  const date =
    timeValue.getDate() < 10 ? "0" + timeValue.getDate() : timeValue.getDate();

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay <= 2) {
    return `${betweenTimeDay}d`;
  } else if (betweenTimeDay > 2) {
    return `${year}-${month}-${date}`;
  }
};
