// IndexedDB utility for storing large video files

const DB_NAME = 'VideoLibraryDB'
const DB_VERSION = 1
const STORE_NAME = 'videos'

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// Save video file to IndexedDB
export const saveVideoFile = async (id, file) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise((resolve, reject) => {
      const request = store.put({ id, file, timestamp: Date.now() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return true
  } catch (error) {
    console.error('Error saving video file:', error)
    return false
  }
}

// Get video file from IndexedDB
export const getVideoFile = async (id) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const result = await new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return result?.file || null
  } catch (error) {
    console.error('Error getting video file:', error)
    return null
  }
}

// Delete video file from IndexedDB
export const deleteVideoFile = async (id) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return true
  } catch (error) {
    console.error('Error deleting video file:', error)
    return false
  }
}

// Get all video IDs from IndexedDB
export const getAllVideoIds = async () => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const result = await new Promise((resolve, reject) => {
      const request = store.getAllKeys()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return result || []
  } catch (error) {
    console.error('Error getting video IDs:', error)
    return []
  }
}
