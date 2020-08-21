import fb from '../config/fireBase';
import createRandomId from './createRandomId';
import Comment from '../models/Comment';

const submitComment = (existingComments: any[], commentContent: string, postId: string) => {
  const db = fb.firestore();

  const commentObject: Comment = Object.freeze({
    commentId: createRandomId(),
    userId: fb.auth().currentUser?.uid!,
    content: commentContent,
    author: fb.auth().currentUser?.displayName!,
    timeCreated: Date.now(),
    photoURL: fb.auth().currentUser?.photoURL!,
    interactions: {
      likes: 0,
      dislikes: 0,
      comments: [],
    }
  });

  const newCommentsArray = [...existingComments, commentObject];

  const ref = db.doc(`posts/${postId}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      console.log(doc.data())
      return ref.update({
        comments: newCommentsArray
      });
    }
  });

  return newCommentsArray;
}

export default submitComment;