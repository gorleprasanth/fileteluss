// IndexedDB utility for storing files (PDF, DOCX, etc.)

const DB_NAME = 'FileStorageDB'
const DB_VERSION = 1
const STORE_NAME = 'files'

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

// Save file to IndexedDB
export const saveFile = async (id, file, metadata) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise((resolve, reject) => {
      const request = store.put({ 
        id, 
        file, 
        metadata,
        timestamp: Date.now() 
      })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return true
  } catch (error) {
    console.error('Error saving file:', error)
    return false
  }
}

// Get file from IndexedDB
export const getFile = async (id) => {
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
    return result || null
  } catch (error) {
    console.error('Error getting file:', error)
    return null
  }
}

// Delete file from IndexedDB
export const deleteFile = async (id) => {
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
    console.error('Error deleting file:', error)
    return false
  }
}

// Get all files from IndexedDB
export const getAllFiles = async () => {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const result = await new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    return result || []
  } catch (error) {
    console.error('Error getting all files:', error)
    return []
  }
}
