import Comment from './Comment';
import {Reaction } from './Reactions'

export interface Posts {
  likes?: Reaction[] | [],
  dislikes?: Reaction[] | [],
  comments?: Comment[],
  content: { 
    id: string, 
    userId: string, 
    title: string, 
    body: string, 
    author: string, 
    photoURL: string, 
    time: number, 
    timeUpdated?: number,
    isEdited: boolean
  }
}