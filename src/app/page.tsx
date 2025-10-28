'use client'; 

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0xc6b6bd4d003379e750Ed91C934F8A56714a0d34E"; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contractABI: any[] = [
  {
    "inputs": [],
    "name": "decrementCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "incrementCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function Home() {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState("");
  const [account, setAccount] = useState("");

useEffect(() => {
    const init = async () => {
      if (typeof (window as any).ethereum !== 'undefined') {
        setIsLoading(true);
        setMessage("지갑을 연결하고 컨트랙트 정보를 로드합니다...");
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          
          const signerAddress = await signer.getAddress();
          setAccount(signerAddress);
          
          const counterContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(counterContract);

          const [currentCount, ownerAddress] = await Promise.all([
            counterContract.getCounter(),
            counterContract.owner()
          ]);
          setCount(Number(currentCount));
          setOwner(ownerAddress);
          
          setMessage("로드 완료.");

        } catch (error) {
          console.error("초기화 실패:", error);
          setMessage("지갑 연결 또는 컨트랙트 로딩에 실패했습니다. (주소, ABI, 네트워크 확인)");
        }
        setIsLoading(false);
      } else {
        setMessage("MetaMask를 설치해주세요.");
      }
    };
    
    init();
  }, []);

  const incrementCounter = async () => {
    if (contract) {
      setIsLoading(true);
      setMessage("트랜잭션 승인을 기다리는 중...");
      try {
        const tx = await contract.incrementCounter();
        setMessage("트랜잭션 처리 중... (블록체인 확인 중)");
        await tx.wait();
        
        const currentCount = await contract.getCounter();
        setCount(Number(currentCount));
        setMessage("카운터 증가 완료!");
      } catch (error) {
        console.error("트랜잭션 실패:", error);
        setMessage("트랜잭션이 실패했습니다.");
      }
      setIsLoading(false);
    }
  };

  const decrementCounter = async () => {
    if (contract) {
      setIsLoading(true);
      setMessage("트랜잭션 승인을 기다리는 중...");
      try {
        const tx = await contract.decrementCounter();
        setMessage("트랜잭션 처리 중... (블록체인 확인 중)");
        await tx.wait();
        
        const currentCount = await contract.getCounter();
        setCount(Number(currentCount));
        setMessage("카운터 감소 완료!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("트랜잭션 실패:", error);
        const reason = error.reason || "트랜잭션이 실패했습니다.";
        setMessage(reason);
      }
      setIsLoading(false);
    }
  };

  const resetCounter = async () => {
    if (contract) {
      setIsLoading(true);
      setMessage("트랜잭션 승인을 기다리는 중...");
      try {
        const tx = await contract.resetCounter();
        setMessage("트랜잭션 처리 중... (블록체인 확인 중)");
        await tx.wait();
        
        const currentCount = await contract.getCounter();
        setCount(Number(currentCount));
        setMessage("카운터 초기화 완료!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("트랜잭션 실패:", error);
        const reason = error.reason || "트랜잭션이 실패했습니다.";
        setMessage(reason);
      }
      setIsLoading(false);
    }
  };

  const isOwner = account && owner && account.toLowerCase() === owner.toLowerCase();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-800">
          92113798 이현
        </h1>
        <p className="text-gray-500">Sepolia Counter DApp</p>
      </div>

      <div className="text-center bg-white p-10 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">카운터 앱</h2>
        <p className="text-6xl font-bold mb-6 text-gray-900">{count}</p>
        
        <div className="space-y-3">
          <button 
            onClick={incrementCounter} 
            disabled={isLoading || !contract}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "숫자 증가"}
          </button>
          
          <button 
            onClick={decrementCounter} 
            disabled={isLoading || !contract}
            className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "숫자 감소"}
          </button>

          <button 
            onClick={resetCounter} 
            disabled={isLoading || !contract || !isOwner}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "초기화 (Owner 전용)"}
          </button>
        </div>
        
      </div>

      {message && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 w-full max-w-sm break-all">
          <strong>상태:</strong> {message}
        </div>
      )}
    </main>
  );
}