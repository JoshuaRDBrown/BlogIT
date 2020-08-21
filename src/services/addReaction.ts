import fb from '../config/fireBase';

const addReaction = (reactionType: string, postId: number) => {
  const db = fb.firestore();
  const ref = db.doc(`posts/${postId}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      let store = doc.data()
      if(store[reactionType]) {
        return ref.update({
          [reactionType]: doc.data().reactionType + 1
        });
      }
      return ref.update({
        [reactionType]: 1
      });
    }
  });
}

export default addReaction;