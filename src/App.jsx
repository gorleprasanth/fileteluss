import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSession(null)
        setLoading(false)
        return
      }

      const snap = await getDoc(doc(db, 'users', user.uid))

      if (!snap.exists() || snap.data().status !== 'approved') {
        await auth.signOut()
        setSession(null)
        setLoading(false)
        return
      }

      setSession(snap.data())
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-primary-dark">
        Loading...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? <Home session={session} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/login"
          element={
            !session ? <Login setSession={setSession} /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/register"
          element={
            !session ? <Register /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  )
}
