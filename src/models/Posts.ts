import Comment from './Comment';

export interface Posts {
  likes: number,
  dislikes: number,
  comments: Comment[],
  content: { 
    id: number, 
    userId: string, 
    title: string, 
    body: string, 
    author: string, 
    photoURL: string, 
    time: number, 
  }
}