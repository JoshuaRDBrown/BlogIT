export interface FireBaseUserObj {
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  metadata: {
    creationTime: string,
    lastSignInTime: string
  }
}