function dateFormatter(creationDate: string, lastSignIn: string): Array<string> {

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let day: string, month:string, year:string, indexOfMonth: number;

  day = creationDate.substring(5, 7);
  month = creationDate.substring(8, 11);
  year = creationDate.substring(12, 16);

  indexOfMonth = months.findIndex(arr => arr.includes(month));

  const formattedCreationDate:string = `${day}/${indexOfMonth+1}/${year}`;

  day = lastSignIn.substring(5, 7);
  month = lastSignIn.substring(8, 11);
  year = lastSignIn.substring(12, 16);

  indexOfMonth = months.findIndex(arr => arr.includes(month));

  const formattedLastSignInDate:string = `${day}/${indexOfMonth+1}/${year}`;

  return [formattedCreationDate, formattedLastSignInDate];
}

export default dateFormatter;