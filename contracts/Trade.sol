pragma solidity >=0.4.22 <0.6.0;

contract Trade {
  mapping(address => uint256) public balances;

  constructor(address nodeA, address nodeB, address nodeC) public {
    balances[nodeA] = 10 ether;
    balances[nodeB] = 10 ether;
    balances[nodeC] = 10 ether;
  }
  
  function getBalance(address node) public view returns (uint256){
    return balances[node];
  }
  
  function sendEther(address node, uint256 price) public returns (bool) {
    require(balances[msg.sender] >= price);

    balances[msg.sender] -= price;
    balances[node] += price;

    return true;
  }
}