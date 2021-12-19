import { useState, useEffect } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '../firebase/config'

function useStorage(file) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    //references
    const storageRef = ref(storage, file.name)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(prog)
      },
      (error) => {
        // Handle unsuccessful uploads
        setError(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, 'images'), {
            url: downloadURL,
            createdAt: serverTimestamp(),
          })

          setUrl(downloadURL)
        })
      }
    )
  }, [file])

  return { progress, url, error }
}

export default useStorage
