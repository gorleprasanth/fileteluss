import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore'

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

// Register using Firebase Auth and create a Firestore user document
export const registerUser = async (name, email, password) => {
  try {
    const normEmail = normalizeEmail(email)
    const credential = await createUserWithEmailAndPassword(auth, normEmail, password)
    const uid = credential.user.uid

    const userDoc = {
      id: uid,
      name: name || '',
      email: normEmail,
      role: 'user',
      status: 'pending',
      registeredAt: new Date().toISOString(),
      features: [],
      accessExpiry: null,
    }

    await setDoc(doc(db, 'users', uid), userDoc)

    return { success: true, message: 'Registration successful. Awaiting admin approval.' }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// Login using Firebase Auth, return session info from Firestore user doc
export const loginUser = async (email, password) => {
  try {
    const normEmail = normalizeEmail(email)
    const credential = await signInWithEmailAndPassword(auth, normEmail, password)
    const uid = credential.user.uid

    const userSnap = await getDoc(doc(db, 'users', uid))
    if (!userSnap.exists()) {
      return { success: false, message: 'User record not found in Firestore' }
    }

    const user = userSnap.data()

    if (user.status === 'pending') return { success: false, message: 'Your account is waiting for admin approval.' }
    if (user.status === 'rejected') return { success: false, message: 'Your account has been rejected.' }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      features: user.features || [],
      accessExpiry: user.accessExpiry || null,
    }

    return { success: true, user: session }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// Helper: find user doc by email
const findUserDocByEmail = async (email) => {
  const normEmail = normalizeEmail(email)
  const q = query(collection(db, 'users'), where('email', '==', normEmail))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ref: d.ref, data: d.data() }
}

// Admin helpers
export const getNonAdminUsers = async () => {
  const snap = await getDocs(collection(db, 'users'))
  const users = snap.docs.map(d => d.data()).filter(u => u.role !== 'admin')
  return users
}

export const updateUserStatus = async (email, newStatus) => {
  try {
    const found = await findUserDocByEmail(email)
    if (!found) return { success: false, message: 'User not found' }
    await updateDoc(found.ref, { status: newStatus })
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export const updateUserFeatures = async (email, features) => {
  try {
    const found = await findUserDocByEmail(email)
    if (!found) return { success: false, message: 'User not found' }
    await updateDoc(found.ref, { features })
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export const updateUserRole = async (email, newRole) => {
  try {
    const found = await findUserDocByEmail(email)
    if (!found) return { success: false, message: 'User not found' }
    await updateDoc(found.ref, { role: newRole })
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export const updateUserAccessExpiry = async (email, expiryDate) => {
  try {
    const found = await findUserDocByEmail(email)
    if (!found) return { success: false, message: 'User not found' }
    await updateDoc(found.ref, { accessExpiry: expiryDate })
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}
