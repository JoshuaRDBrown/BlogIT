import createRandomId from './createRandomId';
import fb from '../config/fireBase';
interface postContent {
  id: string,
  title: string,
  body: string,
  time: number,
  updatedTime?: number,
  author: string,
  photoURL: string,
  userId: string
  isEdited: boolean
}

const createOrUpdatePost = (action: string, postHeader: string, postBody: string, postId?: string, data?: any): postContent | undefined  => {

  if(postHeader !== "" || postBody !== "") {

    const time = Math.floor(Date.now() / 1000);
    
    if(action === "CREATE") {
      const postId = createRandomId();
      
      const content = Object.freeze({
        id: postId,
        title: postHeader,
        body: postBody,
        time: time,
        author: fb.auth().currentUser?.displayName,
        photoURL: fb.auth().currentUser?.photoURL,
        userId: fb.auth().currentUser?.uid,
        isEdited: false
      })

      fb.firestore().collection('/posts').doc(postId).set({
        content
      })
      //@ts-ignore
      return content;


    } else {

      const content = Object.freeze({
        id: postId,
        title: postHeader === "" ? data?.title : postHeader,
        body: postBody === "" ? data?.body : postBody,
        time: data?.time,
        timeUpdated: time,
        author: data?.author,
        photoURL: data?.photoURL,
        userId: data?.userId,
        isEdited: true
      })

      fb.firestore().collection('/posts').doc(`${postId}`).set({
        content
      })
      //@ts-ignore
      return content;
    }
  } else {
    console.log("error")
  }
}

export default createOrUpdatePost;