import { ConnectButton } from "@rainbow-me/rainbowkit"
import logo from '../resources/logo.png'

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-gradient-radial text-white p-4">
        <img src={logo} alt="Logo" className="w-36" />
        <h1 className="text-xl">ENS Based Payroll System</h1>
        <ConnectButton />
    </div>
  )
}

export default Navbar;