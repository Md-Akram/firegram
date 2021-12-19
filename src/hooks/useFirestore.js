import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'

function useFirestore(col) {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    const q = query(collection(db, col), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let documents = []
      querySnapshot.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id })
      })

      setDocs(documents)
    })

    return () => unsubscribe()
  }, [col])

  return { docs }
}

export default useFirestore
