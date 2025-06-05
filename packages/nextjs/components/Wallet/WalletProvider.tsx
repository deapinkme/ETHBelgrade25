"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';


interface WalletContextType {
  connection: Connection | null;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connection: null,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    // Initialize Solana connection
    const conn = new Connection('https://api.devnet.solana.com', 'confirmed');
    setConnection(conn);
  }, []);

  const connect = async () => {
    try {
      // Check if Phantom is installed
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        alert('Phantom wallet is not installed!');
        return;
      }

      // Connect to Phantom
      const response = await solana.connect();
      setPublicKey(new PublicKey(response.publicKey));
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  return (
    <WalletContext.Provider value={{ connection, publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}; 