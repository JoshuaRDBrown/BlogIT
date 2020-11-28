export default interface UserInformation {
  displayName: string,
	photoURL: string,
	description: string,
	isOnline: boolean,
  dateCreated?: string,
  location: string,
  occupation: string
}