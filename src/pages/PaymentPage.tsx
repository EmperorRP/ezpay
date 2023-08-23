import React from 'react';
import { Button, Card, Input, Avatar } from '@ensdomains/thorin';
import { useState } from 'react';
import styled from 'styled-components';
import { useDebounce } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useContractWrite, useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi';

const sizeMultiplier = 3;

const CenteredCard = styled(Card)`
  margin: 0 auto;
  max-width: ${800 * sizeMultiplier}px; // e.g., 1600px now
`;

const AddressBox = styled.div`
  border: 4px solid #9F53FF; // e.g., 6px now
  padding: ${8 * sizeMultiplier}px ${16 * sizeMultiplier}px; // e.g., 16px 32px now
  display: flex;
  align-items: center;
  margin-bottom: ${8 * sizeMultiplier}px; // e.g., 16px now
  border-radius: ${4 * sizeMultiplier}px; // e.g., 8px now
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: red;
  margin-left: ${16 * sizeMultiplier}px; // e.g., 32px now
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
`;

const FixedDistributeButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  text-align: center;
`;


type AddressItemProps = {
  addr: string;
  name?: string | null;
  removeAddress: (address: string) => void;
};

const truncateAddress = (address: string): string => {
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};

const AddressItem: React.FC<AddressItemProps> = ({ addr, name, removeAddress }) => {
  const { data: avatarImage, isError: avatarIsError, isLoading: avatarLoading } = useEnsAvatar({ name: name });

  return (
    <div className="address-item flex items-center justify-between">
      <div className="flex items-center">
        <div className='w-12 h-12'>
          <Avatar label="Avatar Image" src={avatarImage || undefined} />
        </div>
        <div className="ml-2">
          <div>{name}</div>
          <div>{truncateAddress(addr)}</div>
        </div>
      </div>
      <CloseButton onClick={() => removeAddress(addr)}>X</CloseButton>
    </div>
  );
};


const contractAddress = '0x67968Dea9e69199D96E71439e381d4A145FC9c18';
const PayrollContractABI = 
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"recipients","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentsDistributed","type":"event"},{"inputs":[],"name":"depositFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"distributePayments","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"getPendingRecipients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  ;

const PaymentPage = () => {
  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: contractAddress,
    abi: PayrollContractABI,
    functionName: 'distributePayments',
  });
  
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);
  const isPotentialEnsName = debouncedInput.includes('.');

  const { data: ensAddress, isLoading: ensAddressIsLoading } = useEnsAddress({
    name: isPotentialEnsName ? debouncedInput : undefined,
    chainId: 1,
  });

  console.log({ ensAddress });

  const address = isAddress(debouncedInput) ? debouncedInput : (ensAddress || undefined);

  if (ensAddressIsLoading) return <div>Fetching address...</div>;

  const [addressList, setAddressList] = useState<string[]>([]);

  const distributeToAddresses = async () => {
    if(addressList.length > 0) {
      try {
        await write({ args: [addressList] });
      } catch(err: any) {
        console.error("Error distributing payments:", err.message);
      }
    } else {
      console.log("No addresses to distribute payments to.");
    }
  }

  const removeAddress = (addr: string) => {
    setAddressList((prev) => prev.filter((address) => address !== addr));
  };

  const { data: ensName, isError: ensNameIsError, isLoading: ensNameLoading } = useEnsName({
    address: address as `0x${string}`,
  });

  const [addressToNameMapping, setAddressToNameMapping] = useState<{[address: string]: string}>({});
  
  console.log("ENS Name:", ensName);
  if(ensNameIsError) console.error("ENS Name Hook Error:", ensNameIsError);
  
  return (
    <div className="flex flex-col justify-center items-center h-screen p-16">
      <CenteredCard title="Name/Address Input">
        <Input
          label="Address or ENS name"
          placeholder="xrahul.eth"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          description={ensAddress && address}
        />
        <Button
          disabled={!address}
          onClick={() => {
            if (address && !addressList.includes(address)) {
              console.log("Adding address to the list:", address);
              setAddressList((prev) => [...prev, address]);
              if (ensName) {
                setAddressToNameMapping((prev) => ({...prev, [address]: ensName }));
              }
            } else {
              console.warn("Address not added. It's either invalid or already in the list.");
            }
          }}
        >
          Add Address
        </Button>
      </CenteredCard>

      {/* List of addresses vertically centered */}
      <div className="mt-6 flex flex-col items-center justify-center h-screen p-16">
        {addressList.map((addr, index) => (
          <AddressBox key={index}>
            <AddressItem addr={addr} name={addressToNameMapping[addr]} removeAddress={removeAddress} />
          </AddressBox>
        ))}
        <FixedDistributeButton 
          disabled={addressList.length === 0} 
          onClick={distributeToAddresses}
        >
          Distribute
        </FixedDistributeButton>
        {isLoading && <div>Check wallet, distributing payments...</div>}
        {isSuccess && <div>Payments distributed!</div>}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
    
  );
};

export default PaymentPage;


