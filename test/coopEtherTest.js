'use strict'

import MerkleTree from './helpers/MerkleTree'
const Utils = require('./helpers/utils')
const Ledger = artifacts.require('./LedgerChannel.sol')
const EC = artifacts.require('./ECTools.sol')

let lc

// state

let partyA
let partyB
let partyI

let vcRootHash

// is close flag, lc state sequence, number open vc, vc root hash, partyA/B, partyI, balA/B, balI

let AI_lcS0
let AI_lcS1
let AI_lcS2

let BI_lcS0
let BI_lcS1
let BI_lcS2

let AB_vcS0
let AB_vcS1

// signature storage
let AI_lcS0_sigA
let AI_lcS1_sigA
let AI_lcS2_sigA

let AI_lcS0_sigI
let AI_lcS1_sigI
let AI_lcS2_sigI

let BI_lcS0_sigB
let BI_lcS1_sigB
let BI_lcS2_sigB

let BI_lcS0_sigI
let BI_lcS1_sigI
let BI_lcS2_sigI

let AB_vcS0_sigA
let AB_vcS1_sigA

let AB_vcS0_sigB
let AB_vcS1_sigB

contract('Test Disputed Ether Payments', function(accounts) {

  before(async () => {
    partyA = accounts[0]
    partyB = accounts[1]
    partyI = accounts[2]

    let ec = await EC.new()
    Ledger.link('ECTools', ec.address)
  })

  it("Create initial ledger channel state lcS0", async () => {
    AI_lcS0 = []
    AI_lcS0.push(0)
    AI_lcS0.push(0)
    AI_lcS0.push(0)
    AI_lcS0.push('0x0')
    AI_lcS0.push(partyA)
    AI_lcS0.push(partyI)
    AI_lcS0.push(web3.toWei(10, 'ether'))
    AI_lcS0.push(web3.toWei(20, 'ether'))

    AI_lcS0 = Utils.marshallState(AI_lcS0)
    //console.log(AI_lcS0)
  })

  it("Alice signs initial lcS0 state", async () => {
    AI_lcS0_sigA = await web3.eth.sign(partyA, web3.sha3(AI_lcS0, {encoding: 'hex'}))
  })


  it("Alice initiates ledger channel with lcS0", async () => {
    //address _partyA, address _partyI, uint256 _balanceA, uint256 _balanceI
    lc = await Ledger.new(partyA, partyI, web3.toWei(10, 'ether'), web3.toWei(20, 'ether'), {from:partyA, value: web3.toWei(10, 'ether')})
    let openTimeout = await lc.LCopenTimeout()
    let stateHash = await lc.stateHash()
    let pa = await lc.partyA()
    let pi = await lc.partyI()
    let ba = await lc.balanceA()
    let bi = await lc.balanceI()

    // console.log(pa)
    // console.log(partyA)
    // console.log(pi)
    // console.log(ba)
    // console.log(bi)
    // console.log(stateHash)
    // console.log(web3.sha3(AI_lcS0, {encoding: 'hex'}))
  })

  it("Hub signs initial lcS0 state", async () => {
    AI_lcS0_sigI = await web3.eth.sign(partyI, web3.sha3(AI_lcS0, {encoding: 'hex'}))
  })

  it("Ingrid joins ledger channel", async () => {
    await lc.joinChannel(AI_lcS0_sigI, {from: partyI, value: web3.toWei(20, 'ether')})
  })

})