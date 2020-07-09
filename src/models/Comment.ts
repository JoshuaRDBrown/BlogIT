export default interface Comment {
  commentId: string,
  content: string,
  author: string,
  timeCreated: number,
  photoURL: string,
  interactions: {
    likes: number,
    dislikes: number,
    comments: Comment | [],
  }
}