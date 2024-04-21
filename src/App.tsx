import { Route, Routes } from 'react-router-dom'

import './globals.css'


import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import { Home } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/signin' element={<SignInForm />}/>
          <Route path='/signup' element={<SignUpForm />}/>
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />}/>
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App