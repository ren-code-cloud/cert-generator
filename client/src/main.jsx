import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter , RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import Canvas from './Canvas.jsx'
import Settings from './components/Settings.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     <Route path='*' element={<h1>Error to pri</h1>}/>
     <Route path='/' element={<Canvas />}>
        <Route path='settings' element={<Settings />} /> 
        <Route path='export' element={<h1>This is Export</h1>} />
     </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
