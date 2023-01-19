import React, { useState } from 'react';
import { useWeb3 } from 'web3-react';
import { abi } from './Market.json';
import { ethers } from 'ethers';

function App() {
  const { account, connector } = useWeb3();
  const [contract, setContract] = useState(null);
  const [val, setVal] = useState('');
  const [upOrDown, setUpOrDown] = useState('');
  const [timer, setTimer] = useState('');
  const [dealId, setDealId] = useState('');

  useEffect(() => {
    if (!contract && account) {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      setContract(contract);
    }
  }, [contract, account]);

  async function handleInitiateDeal() {
    if (!contract) return;
    try {
      const tx = await contract.initiateDeal(val, upOrDown, timer, { value: ethers.utils.parseEther('1') });
      await tx.wait();
      setDealId(tx.dealId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Private Lossless Prediction Market</h1>
      <form onSubmit={handleInitiateDeal}>
        <label>
          Bet Value:
          <input type="number" value={val} onChange={e => setVal(e.target.value)} />
        </label>
        <label>
          Up or Down:
          <select value={upOrDown} onChange={e => setUpOrDown(e.target.value)}>
            <option value="1">Up</option>
            <option value="0">Down</option>
          </select>
        </label>
        <label>
          Timer:
          <input type="number" value={timer} onChange={e => setTimer(e.target.value)} />
        </label>
        <button type="submit">Initiate Deal</button>
      </form>
      {dealId && <p>Deal Initiated with ID: {dealId}</p>}
    </div>
  );
}
