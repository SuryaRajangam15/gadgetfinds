import React, { useEffect } from 'react'

import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import {
  AuthProvider,
  useAuth
} from './context/AuthContext'

import Navbar from './components/Navbar'
import Toast  from './components/Toast'

import Home          from './pages/Home'
import Products      from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories    from './pages/Categories'
import About         from './pages/About'

import AdminLayout     from './pages/admin/AdminLayout'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import Analytics       from './pages/admin/Analytics'

import { trackPageView } from './utils/trackPageView'
import RequestButton from './components/RequestButton'

function Guard({ children }) {

  const {
    isAdmin,
    loading
  } = useAuth()

  if (loading) {

    return (
      <div
        style={{
          minHeight:'100vh',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          color:'var(--muted)',
          fontFamily:'Outfit,sans-serif'
        }}
      >
        Loading…
      </div>
    )
  }

  if (!isAdmin) {

    return (
      <div
        style={{
          minHeight:'80vh',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          color:'var(--muted)',
          gap:16
        }}
      >

        <div style={{fontSize:48}}>
          🔐
        </div>

        <p style={{fontSize:16}}>
          Admin access required.
        </p>

        <p style={{fontSize:13}}>
          Click the logo 5 times to open login.
        </p>

      </div>
    )
  }

  return children
}

function AppInner() {

  const location = useLocation()

 /* UNIQUE VISITOR TRACKING */
useEffect(() => {

  const alreadyTracked =
    sessionStorage.getItem('viewTracked')

  if (!alreadyTracked) {

    trackPageView(location.pathname)

    sessionStorage.setItem(
      'viewTracked',
      'true'
    )

  }

}, [])

  return (
    <>

      {/* NAVBAR */}
      <Navbar/>

      {/* ROUTES */}
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={<Home/>}
        />

        <Route
          path="/products"
          element={<Products/>}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail/>}
        />

        <Route
          path="/categories"
          element={<Categories/>}
        />

        <Route
          path="/about"
          element={<About/>}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <Guard>
              <AdminLayout/>
            </Guard>
          }
        >

          {/* DEFAULT ADMIN PAGE */}
          <Route
            index
            element={
              <Navigate
                to="/admin/products"
                replace
              />
            }
          />

          {/* PRODUCTS */}
          <Route
            path="products"
            element={<AdminProducts/>}
          />

          {/* CATEGORIES */}
          <Route
            path="categories"
            element={<AdminCategories/>}
          />

          {/* ANALYTICS */}
          <Route
            path="analytics"
            element={<Analytics/>}
          />

        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
            <RequestButton/>
      {/* TOAST */}
      <Toast/>

    </>
  )
}

export default function App() {

  return (
    <AuthProvider>
      <AppInner/>
    </AuthProvider>
  )
}