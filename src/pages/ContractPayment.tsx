import { usePrepareContractWrite, useContractWrite, useContractRead  } from 'wagmi';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';


const contractAddress = '0x8fac7F463D1b842C1F57cD1E6893926B6225aE91';
const PayrollContractABI = 
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"recipients","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentsDistributed","type":"event"},{"inputs":[],"name":"depositFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"distributePayments","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"getPendingRecipients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  ;

const ContractPayment = () => {
    
    const [amount, setAmount] = useState('');

    const { data, isLoading, isSuccess, error, write } = useContractWrite({
        address: contractAddress,
        abi: PayrollContractABI,
        functionName: 'depositFunds',
    });

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amountInWei = ethers.parseEther(amount);
        await write({ value: BigInt(amountInWei.toString()) });
    };
    

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const navigate = useNavigate();
    
    return (
        
        <div className="bg-gradient-radial text-white flex flex-col items-center justify-start h-screen pt-20">
            <h1>ContractPayment</h1>
        
            <form onSubmit={handleDeposit} className="flex flex-col items-center mt-4">
                <input 
                    type="text" 
                    placeholder="Enter amount in Ether"
                    value={amount}
                    onChange={handleAmountChange}
                    className="text-xl bg-opacity-20 bg-gray-300 text-white px-5 py-3 rounded border border-white mb-4" 
                />
                <button type="submit" className="bg-button-blue text-white px-6 py-2 rounded">Deposit</button>
            </form>
        
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && (
                <div className="flex flex-col items-center mt-4">
                    <div>Transaction: <a href={`https://goerli.arbiscan.io/tx/${data?.hash}`} target="_blank" rel="noopener noreferrer" className="underline">{data?.hash}</a></div>
                    <button 
                        onClick={() => navigate("/PaymentPage")} 
                        className="border border-button-blue px-6 py-2 rounded mt-4 block hover:bg-button-blue-hover"
                    >
                        Go to Payments Page
                    </button>
                </div>
            )}
            {error && <div>Error: {error.message}</div>}
        </div>
    )
    
}

export default ContractPayment;