import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// ABIs
import Escrow from './abis/Escrow.abi'

// Config
import config from './config.json';

function App() {

  const [provider, setProvider] = useState(null)

  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [skins, setSkins] = useState([])

  const [skin, setSkin] = useState(null)

  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
    setEscrow(escrow);

    const totalSupply = await escrow.totalSupply();
    const skins = [];

    for (var i = 1; i<= totalSupply; i++) {
      const id = escrow.skinIds(i);
      skins.push(id);
    }
    setSkins(skins);
   

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    })

  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

function togglePop(skin) {
  setSkin(skin)
  toggle ? setToggle(false) : setToggle(true)
}

  return (
    <div>

      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className='cards__section'>

        <h3>Skins for you</h3>

        <hr />

        <div className='cards'>
          {skins.map((index) => (
            <div className='card' key = {index} onClick={() => togglePop(index)}>
              <h3>Skin id: {index}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
