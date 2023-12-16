import { useEffect, useState } from 'react';
import './App.css'
import ConnectButton from './components/ConnectButton'
import Articles from './components/Articles'
import { Optimism, Arbitrum, Polygon, useEthers, useSendTransaction, Mainnet } from '@usedapp/core';
import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './main';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ALLOWED_NETWORKS, ONCHAIN_TORTUGA_ADDRESS } from './constants';
import { ethers } from 'ethers';
import Harvest from './components/Disclosures';

function App(): JSX.Element {
  const { account, library, chainId } = useEthers();
  const [harvest, setHarvest] = useState<DocumentData | null>(null);
  const { state, sendTransaction } = useSendTransaction();
  const [openTip, setOpenTip] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'The Trade Winds' | 'Disclosures'>('The Trade Winds');

  useEffect(() => {
    if (!account) return;
    fetchConfig();
    recordAddress();
    checkPendingTransaction();
  }, [account, library]);

  useEffect(() => {
    fetchConfig();
  }, []);


  const recordAddress = async () => {
    if (!account) return;
    const accountRef = doc(db, "accounts", account.toLowerCase());
    setDoc(accountRef, { account: account.toLowerCase() }, { merge: true });
  }

  const fetchConfig = async () => {
    const configRef = doc(db, "config", 'website');
    const configDoc = await getDoc(configRef);
    if (configDoc.exists()) {
      setHarvest(configDoc.data());
    }
  };

  const checkPendingTransaction = () => {
    const storedTxHash = localStorage.getItem('pendingTransactionHash');
    if (!storedTxHash || !library) return;

    library.getTransactionReceipt(storedTxHash).then(receipt => {
      if (receipt && receipt.confirmations) {
        updateAccountPaidStatus(storedTxHash);
      }
      localStorage.removeItem('pendingTransactionHash');
    });
  };

  useEffect(() => {
    if (account && state.status === 'Success') {
      updateAccountPaidStatus(state.transaction?.hash);
    }
  }, [state, account]);

  const updateAccountPaidStatus = (transactionHash?: string) => {
    if (!transactionHash || !account) return
    const accountRef = doc(db, "accounts", account.toLowerCase());
    setDoc(accountRef, { account: account.toLowerCase(), tipped: true, transactionHash }, { merge: true });
  };

  const isAllowedNetwork = () => ALLOWED_NETWORKS.includes(chainId || 1);

  const handleDonate = (amount: string) => {
    if (!account || !isAllowedNetwork()) return;

    sendTransaction({ to: ONCHAIN_TORTUGA_ADDRESS, value: ethers.utils.parseEther(amount) })
      .then((txResponse) => {
        localStorage.setItem('pendingTransactionHash', txResponse?.transactionHash || '');
      })
      .catch(console.error);
  };

  const getBlockExplorerUrl = (txHash: string = '', chainId: number = 1): string => {
    switch (chainId) {
      case Optimism.chainId:
        return Optimism.getExplorerTransactionLink(txHash);
      case Polygon.chainId:
        return Polygon.getExplorerTransactionLink(txHash);
      case Arbitrum.chainId:
        return Arbitrum.getExplorerTransactionLink(txHash);
      default:
        return Mainnet.getExplorerTransactionLink(txHash);
    }
  }

  const renderTransactionState = () => {
    switch (state.status) {
      case 'None':
        return <div className=" text-md text-center"></div>
      case 'PendingSignature':
        return <div className="  animate animate-pulse text-md text-center py-2 my-2 border-y border-theme-yellow bg-theme-gray text-theme-yellow">Awaiting Signature...</div>;
      case 'Mining':
        return <div className="  animate animate-pulse text-md text-center py-2 my-2 border-y border-theme-yellow bg-theme-gray text-theme-yellow">Transaction being processed.<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      case 'Success':
        return <div className="  text-md text-center py-2 my-2 border-y border-theme-yellow bg-theme-gray text-theme-yellow">Well look at that, transaction successful!<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      case 'Fail':
        return <div className="  text-md text-center py-2 my-2 border-y border-theme-yellow bg-theme-gray text-theme-yellow">Ah sorry, partner - the transaction failed.<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      default:
        return <div className="   text-md text-center"></div>;
    }
  };

  return (
    <div className='mx-auto max-w-4xl  min-h-full mb-32 text-theme-yellow rounded-sm mt-16  justify-center '>
      <>
        <div className="bg-theme-gray  justify-center mx-auto pb-8   rounded-sm max-w-4xl py-4  pt-8">
          <h1 className="text-xl font-bold mb-2 pt-4 text-center ">Tortuga Onchain</h1>

          {!account ? <h1 className="text-lg font-bold  pt-2 text-center ">The Docks</h1> : <h1 className="text-lg font-bold  pt-2 text-center ">The Tavern</h1>}
          {!account ? <p className='text-md text-center'>Drop anchor laddy, you must be tired</p> : <p className='text-md text-center'>Welcome back t' Tortuga, savvy.</p>}
          {!account ? <p className='text-md text-center pb-2'>Connect your wallet and head t' the tavern</p> : <p className='text-md text-center pb-2'>What can I do fer ya?</p>}

          <div className='justify-center mx-auto text-center pt-1'>
            <ConnectButton />

            <a href='https://tortugaonchain.substack.com/' target='_blank' className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
              Substack
            </a>
            <a href='https://apps.tortugaonchain.com' target='_blank' className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
              Web3 Apps
            </a>
            {account && <button onClick={() => setOpenTip(true)} className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
              Tip Barkeep
            </button>}

          </div>



          <Transition.Root show={openTip} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpenTip}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0  transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-theme-gray px-4 pb-4 pt-5 text-left shadow-xl border-2 border-theme-yellow transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div>
                        <div className=" text-center ">
                          <Dialog.Title as="h3" className="text-lg   font-semibold  text-theme-yellow">
                            Aye, thank you lad
                          </Dialog.Title>
                          <div className=" text-center">
                            <p className='text-md text-theme-yellow'>We be using our tips to import in the finest rum from Port Royal.</p>
                            {account && state.status && <span >
                              {renderTransactionState()}
                            </span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-4 grid grid-cols-3 text-theme-yellow">
                        <button onClick={() => handleDonate('0.001')} className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          .001 ETH
                        </button>
                        <button onClick={() => handleDonate('0.005')} className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          .005 ETH
                        </button>
                        <button onClick={() => handleDonate('0.01')} className="border-2 ml-3 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          0.01 ETH
                        </button>
                        <button onClick={() => handleDonate('0.03')} className="border-2 ml-3 mt-2 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          0.03 ETH
                        </button>
                        <button onClick={() => handleDonate('0.05')} className="border-2 ml-3 mt-2 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          0.05 ETH
                        </button>
                        <button onClick={() => handleDonate('0.10')} className="border-2 ml-3 mt-2 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto">
                          0.10 ETH
                        </button>
                      </div>

                      <div className="mt-4 sm:mt-4 grid grid-cols-3 ">
                        <div></div>
                        <button onClick={() => {
                          setOpenTip(false)
                        }} className="border-2 text-theme-gray border-theme-yellow text-md w-full px-2 rounded-sm bg-theme-yellow justify-center text-center inline-flex mx-auto">
                          Close
                        </button>
                        <div></div>
                      </div>

                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </>

      {account &&
        <div className='justify-center mx-auto text-center border-t-2 border-x-2 border-theme-yellow  bg-theme-gray '>

          <button
            onClick={() => setCurrentPage('The Trade Winds')}
            className={`mt-4 mb-4 border-2 border-theme-yellow mr-3 text-md px-2 rounded-sm ${currentPage === 'The Trade Winds' ? 'bg-theme-yellow text-theme-gray' : 'bg-theme-gray'}  justify-center text-center inline-flex mx-auto`}
          >
            The Trade Winds
          </button>

          <button
            onClick={() => setCurrentPage('Disclosures')}
            className={`mt-4 mb-4 border-2 border-theme-yellow text-md px-2 rounded-sm ${currentPage === 'Disclosures' ? 'bg-theme-yellow text-theme-gray' : 'bg-theme-gray text-theme-yellow'}  justify-center text-center inline-flex mx-auto`}
          >
            Disclosures
          </button>

        </div>}
      <>
        {currentPage === 'The Trade Winds' ? (
          <Articles config={harvest}></Articles>
        ) : (
          <Harvest config={harvest}></Harvest>
        )}

      </>


      <div className="bg-theme-gray border-b-2 border-x-2 border-theme-yellow mx-auto flex justify-evenly  rounded-b-sm max-w-4xl py-4  pt-4">


        <a target='_blank' href='https://twitter.com/tortugaonchain' className='text-md text-center inline-flex border-b hover:border-b-theme-yellow border-transparent'>Twitter</a>
        <a target='_blank' href='https://twitter.com/andrew_eth' className='text-md text-center inline-flex border-b hover:border-b-theme-yellow border-transparent'>Davy Jones</a>
        <a target='_blank' href='https://galleonlabs.io' className='text-md text-center inline-flex border-b hover:border-b-theme-yellow border-transparent'>Galleon Labs</a>
        <a target='_blank' href='https://github.com/galleonlabs/tortuga-onchain' className='text-md text-center inline-flex border-b hover:border-b-theme-yellow border-transparent'>Github</a>
      </div>

    </div>
  )
}

export default App
