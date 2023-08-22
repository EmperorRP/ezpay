import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import ContractPayment from './pages/ContractPayment';
import PaymentPage from './pages/PaymentPage';
import './App.css';
// import 'tailwindcss/tailwind.css';
import Navbar from './components/Navbar';
import SSXComponent from './components/SSXComponent';
import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Navbar />
        <Router>
          <Routes>
            <Route path='/' element={isConnected ? <ContractPayment /> : <div className='flex flex-col justify-center items-center py-5 my-1'>Wallet is not connected <br /><ConnectButton></ConnectButton></div>} />
            <Route path='/PaymentPage' element={<PaymentPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}
