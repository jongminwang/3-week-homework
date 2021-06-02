import logo from './logo.svg';
import Caver from 'caver-js';
import './App.css';

const COUNT_CONTRACT_ADDRESS = '0xd9BBc7814a84d3766f22c52A0eAFfa04045DcE6D';
const COUNT_ABI = '[ { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]';

const ACCESS_KEY_ID = '';
const SECRET_ACCESS_KEY = '';
const CHAIN_ID = '1001' // mainnet 8217 testnet 1001

const option = {
  headers: [
    {
      name: "Authorization",
      value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
    },
    {
      name: "x-chain-id", value: CHAIN_ID
    }
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

const CountContract = new caver.contract(JSON.parse(COUNT_ABI), COUNT_CONTRACT_ADDRESS);

const readCount = async() => {
  const _count = await CountContract.methods.count().call();
  console.log(_count)
}

const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(`BALANCE: ${balance}`);
    return balance;
  })
}

const setCount = async (newCount) => {

  try{
    const privatekey = "0x5dda1aeaa20a2a227b93d8c045e0672e4dea634501baba295e6ad417292113c3";
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);

    const receipt = await CountContract.methods.setCount(newCount).send({
      from: deployer.address,
      gas: "0x4bfd200"
    })
    console.log(receipt);
  } catch(e) {
    console.log(`[ERROR_SET_COUNT]${e}`);
  }

}


function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p> 카운트 확인 </p>
        <button title={'카운트 확인'} onClick = {()=>{readCount()}} />
        <p> 잔액 확인 </p>
        <button title={'잔액 확인'} onClick = {()=>{getBalance('0x89d2c03f59ca9f62580b1997dffa113176ba4821')}} />
        <p> 카운트 변경 </p>
        <button title={'카운트 변경'} onClick = {()=>{setCount(1004)}} />
        <p>
          Good <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
