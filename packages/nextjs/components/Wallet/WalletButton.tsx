import React from 'react';
import { useWallet } from './WalletProvider';

export const WalletButton = () => {
  const { publicKey, connect, disconnect } = useWallet();

  return (
    <div className="flex gap-2">
      {publicKey ? (
        <button
          onClick={disconnect}
          className="btn btn-primary"
        >
          Disconnect {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </button>
      ) : (
        <button
          onClick={connect}
          className="btn btn-primary"
        >
          Connect Phantom
        </button>
      )}
    </div>
  );
}; 