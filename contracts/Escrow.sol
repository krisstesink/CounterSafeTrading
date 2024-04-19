// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Escrow {
    address payable public seller;
    Counters.Counter private totalSupply;


    constructor(address payable _seller) {
        seller = _seller;
    }

    modifier onlyBuyer(uint256 skinId) {
        require (msg.sender == buyer[skinId], "Only buyer can call this method");
        _;
    }

    modifier onlySeller() {
        require (msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyEscrow() {
        require (msg.sender == address(this), "Only escrow can call this method");
        _;
    }
    mapping(uint256 => bool) public listedSkins;
    mapping(uint256 => uint256) public skinIds;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => uint256) public askPrice;
    mapping(uint256 => uint256) public minBidPrice;
    mapping(uint256 => uint256) public escrowBalance;
    mapping(uint256 => mapping(address => bool)) public approval;

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply.current();
    }

    function listSkin(uint256 skinId, uint256 _askPrice, uint256 _minBidPrice) public onlySeller {
        require(!listedSkins[skinId], "Skin has already been listed");
        listedSkins[skinId] = true;
        askPrice[skinId] = _askPrice;
        minBidPrice[skinId] = _minBidPrice;
        totalSupply.increment();
        skinIds[totalSupply.current()] = skinId;
    }

    function purchase(uint256 skinId) public payable {
        require(listedSkins[skinId], "Seller has not listed this skin");
        require(msg.value >= askPrice[skinId], "Not enough funds to purchase this skin");

        buyer[skinId] = msg.sender;
        escrowBalance[skinId] += msg.value;
    }

    function approveSale(uint256 skinId) public {
        approval[skinId][msg.sender] = true;
    }


    function finalizeSale(uint256 skinId) public {
        require(escrowBalance[skinId]>=askPrice[skinId], "Not enough funds to purchase this skin");
        require(getBalance()>=askPrice[skinId], "The balance on this contract is too low");
        require(approval[skinId][seller], "The seller has not approved this sale");
        require(approval[skinId][buyer[skinId]], "The buyer has not approved this sale");
        
        (bool success, ) = payable(seller).call{value: askPrice[skinId]}("");
        require(success);

        escrowBalance[skinId] -= askPrice[skinId];
        approval[skinId][buyer[skinId]] = false;
        approval[skinId][seller] = false;
        listedSkins[skinId] = false;
        buyer[skinId] = address(0);
    }

}
