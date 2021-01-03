function timeFormatter(unixTimeStamp: number): string {

  let postDate = new Date(unixTimeStamp * 1000),
  currentDate = new Date(),
  seconds = currentDate.getSeconds() - postDate.getSeconds(),
  minutes = currentDate.getMinutes() - postDate.getMinutes(),
  hours = currentDate.getHours() - postDate.getHours(),
  days = currentDate.getDate() - postDate.getDate(),
  months = currentDate.getMonth() - postDate.getMonth(),
  years = currentDate.getFullYear() - postDate.getFullYear();

  if(years === 0) {
    if(months === 0) {
      if(days === 0) {
        if(hours === 0) {
          if(minutes === 0) {
            return `${seconds} seconds ago` ;
          } else {
            return `${minutes} minutes ago`;
          }
        } else {
          return `${hours} hours ago`;
        }
      } else {
        return `${days} days ago`;
      }
    } else {
      return `${months} months ago`;
    }
  } else {
    return `${years} years ago`;
  }
}

export default timeFormatter;