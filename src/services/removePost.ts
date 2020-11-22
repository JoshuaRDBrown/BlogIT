import fb from '../config/fireBase';

const removePost = (postId: string) => {

  const db = fb.firestore()

  db.collection('posts').doc(postId).delete().then(()=> {
    console.log("Deleted post")
  }).catch((err) => {
    console.log("Error while deleting post")
  })
}

export default removePost;