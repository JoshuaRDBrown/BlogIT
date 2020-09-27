import fb from '../config/fireBase';
import { Reaction } from '../models/Reactions'

const addReaction = (reactionType: string, postId: number, username: string, uid: string, photo: string, userHasLiked: boolean, userHasDisliked: boolean): Reaction => {
  const reactionObj: Reaction = {
    uid: uid,
    name: username,
    photo: photo,
  }
  const db = fb.firestore();
  const ref = db.doc(`posts/${postId}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      let store = doc.data()
      let reactionStore = store[reactionType]
      
      if(reactionStore) {
        reactionStore.push(reactionObj)
        
        return ref.update({
          [reactionType]: reactionStore
        });
      }
      return ref.update({
        [reactionType]: [reactionObj]
      });
    }
  });

  return reactionObj;

}

export default addReaction;