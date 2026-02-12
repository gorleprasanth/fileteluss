import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Videos from './pages/Videos'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import AccessGate from './components/AccessGate'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase Auth state and load user document from Firestore
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSession(null)
        setLoading(false)
        return
      }

      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid))
        if (userSnap.exists()) {
          const u = userSnap.data()
          setSession({
            id: u.id || user.uid,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            features: u.features || [],
            accessExpiry: u.accessExpiry || null,
          })
        } else {
          setSession(null)
        }
      } catch (err) {
        setSession(null)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-dark">
        <div className="text-neon-blue text-2xl font-bold">FileTelus</div>
      </div>
    )
  }

  return (
    <Router>
      {session && <Navbar session={session} setSession={setSession} />}
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" /> : <Login setSession={setSession} />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/" /> : <Register />} 
        />

        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute session={session}>
              <Home session={session} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/videos" 
          element={
            <ProtectedRoute session={session}>
              <AccessGate session={session} feature="videos">
                <Videos />
              </AccessGate>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/portfolio" 
          element={
            <ProtectedRoute session={session}>
              <AccessGate session={session} feature="portfolio">
                <Portfolio />
              </AccessGate>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute session={session} requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={session ? "/" : "/login"} />} />
      </Routes>
    </Router>
  )
}
