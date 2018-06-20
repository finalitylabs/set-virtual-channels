'use strict'

import MerkleTree from './helpers/MerkleTree'
const Utils = require('./helpers/utils')
const Ledger = artifacts.require('./LedgerChannel.sol')
const EC = artifacts.require('./ECTools.sol')

const Web3latest = require('web3')
const web3latest = new Web3latest(new Web3latest.providers.HttpProvider("http://localhost:7545")) //ganache port

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
let AI_lcS3

let BI_lcS0
let BI_lcS1
let BI_lcS2

let AB_vcS0
let AB_vcS1

// signature storage
let AI_lcS0_sigA
let AI_lcS1_sigA
let AI_lcS2_sigA
let AI_lcS3_sigA

let AI_lcS0_sigI
let AI_lcS1_sigI
let AI_lcS2_sigI
let AI_lcS3_sigI

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
    lc = await Ledger.new()
  })

  it("Create initial ledger channel state lcS0 for AI channel", async () => {
    // AI_lcS0 = []
    // AI_lcS0.push(0)
    // AI_lcS0.push(0)
    // AI_lcS0.push(0)
    // AI_lcS0.push('0x0')
    // AI_lcS0.push(partyA)
    // AI_lcS0.push(partyI)
    // AI_lcS0.push(web3.toWei(10, 'ether'))
    // AI_lcS0.push(web3.toWei(20, 'ether'))

    // AI_lcS0 = Utils.marshallState(AI_lcS0)

    AI_lcS0 = web3latest.utils.soliditySha3(
      { type: 'bool', value: false }, // isclose
      //{ type: 'bytes32', value: web3.sha3('lc2', {encoding: 'hex'}) }, // lcid
      { type: 'uint256', value: '0' }, // sequence
      { type: 'uint256', value: '0' }, // open VCs
      { type: 'bytes32', value: '0x0' }, // VC root hash
      { type: 'address', value: partyA }, // partyA
      { type: 'address', value: partyI }, // hub
      { type: 'uint256', value: web3latest.utils.toWei('10') },
      { type: 'uint256', value: web3latest.utils.toWei('20') }
    ) 
  })

  it("Alice signs initial lcS0 state", async () => {
    AI_lcS0_sigA = await web3latest.eth.sign(AI_lcS0, partyA)
  })


  it("Alice initiates ledger channel with lcS0", async () => {
    await lc.createChannel(web3latest.utils.sha3('1111', {encoding: 'hex'}), partyI, {from:partyA, value: web3latest.utils.toWei('10')})
    // let openTimeout = await lc.LCopenTimeout()
    // let stateHash = await lc.stateHash()
    // let pa = await lc.partyA()
    // let pi = await lc.partyI()
    // let ba = await lc.balanceA()
    // let bi = await lc.balanceI()
  })

  it("Hub signs initial lcS0 state", async () => {
    AI_lcS0_sigI = await web3latest.eth.sign(AI_lcS0, partyI)
  })

  it("Ingrid joins ledger channel", async () => {
    await lc.joinChannel(web3latest.utils.sha3('1111', {encoding: 'hex'}), {from: partyI, value: web3latest.utils.toWei('20')})
  })

  // Bob creates ledger channel
  it("Create Bob's ledger channel state lcS0 for BI channel", async () => {
    // BI_lcS0 = []
    // BI_lcS0.push(0)
    // BI_lcS0.push(0)
    // BI_lcS0.push(0)
    // BI_lcS0.push('0x0')
    // BI_lcS0.push(partyB)
    // BI_lcS0.push(partyI)
    // BI_lcS0.push(web3.toWei(10, 'ether'))
    // BI_lcS0.push(web3.toWei(20, 'ether'))

    // BI_lcS0 = Utils.marshallState(BI_lcS0)

    BI_lcS0 = web3latest.utils.soliditySha3(
      { type: 'bool', value: false }, // isclose
      //{ type: 'bytes32', value: web3.sha3('lc4', {encoding: 'hex'}) }, // lcid
      { type: 'uint256', value: '0' }, // sequence
      { type: 'uint256', value: '0' }, // open VCs
      { type: 'bytes32', value: '0x0' }, // VC root hash
      { type: 'address', value: partyB }, // partyA
      { type: 'address', value: partyI }, // hub
      { type: 'uint256', value: web3latest.utils.toWei('10') },
      { type: 'uint256', value: web3latest.utils.toWei('20') }
    ) 
  })

  it("Bob signs initial lcS0 state", async () => {
    BI_lcS0_sigB = await web3latest.eth.sign(BI_lcS0, partyB)
  })


  it("Bob initiates ledger channel with lcS0", async () => {
    await lc.createChannel(web3latest.utils.sha3('2222', {encoding: 'hex'}), partyI, {from:partyB, value: web3latest.utils.toWei('10')})
    // let openTimeout = await lc.LCopenTimeout()
    // let stateHash = await lc.stateHash()
    // let pa = await lc.partyA()
    // let pi = await lc.partyI()
    // let ba = await lc.balanceA()
    // let bi = await lc.balanceI()
  })

  it("Hub signs initial lcS0 state", async () => {
    BI_lcS0_sigI = await web3latest.eth.sign(BI_lcS0, partyI)
  })

  it("Ingrid joins ledger channel", async () => {
    await lc.joinChannel(web3latest.utils.sha3('2222', {encoding: 'hex'}), {from: partyI, value: web3latest.utils.toWei('20')})
  })


  it("Alice creates vc state vcSO with Bob", async () => {
    // AB_vcS0 = []
    // AB_vcS0.push(web3.sha3('1337', {encoding: 'hex'}))
    // AB_vcS0.push(0)
    // AB_vcS0.push(partyA)
    // AB_vcS0.push(partyB)
    // AB_vcS0.push(web3.toWei(5, 'ether'))
    // AB_vcS0.push(web3.toWei(7, 'ether'))

    // AB_vcS0 = Utils.marshallState(AB_vcS0)

    AB_vcS0 = web3latest.utils.soliditySha3(
      { type: 'bytes32', value: web3latest.utils.sha3('1337', {encoding: 'hex'}) }, // vc id
      { type: 'uint256', value: '0' }, // sequence
      { type: 'address', value: partyA }, // partyA
      { type: 'address', value: partyB }, // counterparty
      { type: 'uint256', value: web3latest.utils.toWei('3') },
      { type: 'uint256', value: web3latest.utils.toWei('9') }
    )

  })

  it("Alice and Bob sign vcSO", async () => {
    AB_vcS0_sigA = await web3latest.eth.sign(AB_vcS0, partyA)
    AB_vcS0_sigB = await web3latest.eth.sign(AB_vcS0, partyB)
  })

  it("Alice creates lc state lcS1 containing vcSO with Ingrid", async () => {
    var hash = web3latest.utils.sha3(AB_vcS0, {encoding: 'hex'})
    var buf = Utils.hexToBuffer(hash)
    var elems = []
    elems.push(buf)
    var merkle = new MerkleTree(elems)

    vcRootHash = Utils.bufferToHex(merkle.getRoot())

    // AI_lcS1 = []
    // AI_lcS1.push(0)
    // AI_lcS1.push(1)
    // AI_lcS1.push(1)
    // AI_lcS1.push(vcRootHash)
    // AI_lcS1.push(partyA)
    // AI_lcS1.push(partyI)
    // AI_lcS1.push(web3.toWei(5, 'ether'))
    // AI_lcS1.push(web3.toWei(13, 'ether'))

    // AI_lcS1 = Utils.marshallState(AI_lcS1)
    AI_lcS1 = web3latest.utils.soliditySha3(
      { type: 'bool', value: false }, // isclose
      //{ type: 'bytes32', value: web3.sha3('lc2', {encoding: 'hex'}) }, // lcid
      { type: 'uint256', value: '1' }, // sequence
      { type: 'uint256', value: '1' }, // open VCs
      { type: 'bytes32', value: vcRootHash }, // VC root hash
      { type: 'address', value: partyA }, // partyA
      { type: 'address', value: partyI }, // hub
      { type: 'uint256', value: web3latest.utils.toWei('5') },
      { type: 'uint256', value: web3latest.utils.toWei('13') }
    ) 
  })

  it("Alice signs lcS1 state and sends to Hub", async () => {
    AI_lcS1_sigA = await web3latest.eth.sign(AI_lcS1, partyA)
  })

  it("Bob creates lc state lcS1 containing vcSO with Ingrid", async () => {
    var hash = web3latest.utils.sha3(AB_vcS0, {encoding: 'hex'})
    var buf = Utils.hexToBuffer(hash)
    var elems = []
    elems.push(buf)
    var merkle = new MerkleTree(elems)

    vcRootHash = Utils.bufferToHex(merkle.getRoot())

    // BI_lcS1 = []
    // BI_lcS1.push(0)
    // BI_lcS1.push(1)
    // BI_lcS1.push(1)
    // BI_lcS1.push(vcRootHash)
    // BI_lcS1.push(partyB)
    // BI_lcS1.push(partyI)
    // BI_lcS1.push(web3.toWei(3, 'ether'))
    // BI_lcS1.push(web3.toWei(15, 'ether'))

    // BI_lcS1 = Utils.marshallState(BI_lcS1)

    BI_lcS1 = web3latest.utils.soliditySha3(
      { type: 'bool', value: false }, // isclose
      //{ type: 'bytes32', value: web3.sha3('lc4', {encoding: 'hex'}) }, // lcid
      { type: 'uint256', value: '1' }, // sequence
      { type: 'uint256', value: '1' }, // open VCs
      { type: 'bytes32', value: vcRootHash }, // VC root hash
      { type: 'address', value: partyB }, // partyA
      { type: 'address', value: partyI }, // hub
      { type: 'uint256', value: web3latest.utils.toWei('3') },
      { type: 'uint256', value: web3latest.utils.toWei('15') }
    ) 
  })

  it("Bob signs lcS1 state and sends to hub", async () => {
    BI_lcS1_sigB = await web3latest.eth.sign(BI_lcS1, partyB)
  })

  it("Hub signs both Alice and Bob's lcS1 state to open VC", async () => {
    AI_lcS1_sigI = await web3latest.eth.sign(AI_lcS1, partyI)
    BI_lcS1_sigI = await web3latest.eth.sign(BI_lcS1, partyI)
  })

  it("Alice generates virtual channel payment with Bob", async () => {
    // AB_vcS1 = []
    // AB_vcS1.push(web3.sha3('1337', {encoding: 'hex'}))
    // AB_vcS1.push(1)
    // AB_vcS1.push(partyA)
    // AB_vcS1.push(partyB)
    // AB_vcS1.push(web3.toWei(3, 'ether'))
    // AB_vcS1.push(web3.toWei(9, 'ether'))

    // AB_vcS1 = Utils.marshallState(AB_vcS1)    

    AB_vcS1 = web3latest.utils.soliditySha3(
      { type: 'bytes32', value: web3latest.utils.sha3('1337', {encoding: 'hex'}) }, // vc id
      { type: 'uint256', value: '1' }, // sequence
      { type: 'address', value: partyA }, // partyA
      { type: 'address', value: partyB }, // counterparty
      { type: 'uint256', value: web3latest.utils.toWei('5') },
      { type: 'uint256', value: web3latest.utils.toWei('7') }
    )

  })

  it("Alice and Bob sign vcS1", async () => {
    AB_vcS1_sigA = await web3latest.eth.sign(AB_vcS1, partyA)
    AB_vcS1_sigB = await web3latest.eth.sign(AB_vcS1, partyB)
  })

  it("Alice generates lc state to close vc", async () => {
    // AI_lcS2 = []
    // AI_lcS2.push(0)
    // AI_lcS2.push(2)
    // AI_lcS2.push(0)
    // AI_lcS2.push('0x0')
    // AI_lcS2.push(partyA)
    // AI_lcS2.push(partyI)
    // AI_lcS2.push(web3.toWei(8, 'ether'))
    // AI_lcS2.push(web3.toWei(22, 'ether'))

    // AI_lcS2 = Utils.marshallState(AI_lcS2)    

    AI_lcS2 = web3latest.utils.soliditySha3(
      { type: 'bool', value: false }, // isclose
      //{ type: 'bytes32', value: web3.sha3('lc2', {encoding: 'hex'}) }, // lcid
      { type: 'uint256', value: '2' }, // sequence
      { type: 'uint256', value: '0' }, // open VCs
      { type: 'bytes32', value: '0x0' }, // VC root hash
      { type: 'address', value: partyA }, // partyA
      { type: 'address', value: partyI }, // hub
      { type: 'uint256', value: web3latest.utils.toWei('8') },
      { type: 'uint256', value: web3latest.utils.toWei('22') }
    ) 

  })

  it("Ingrid initiates settling on-chain with byzantine Bob", async () => {
    await lc.updateLCstate(web3latest.utils.sha3('2222', {encoding: 'hex'}), '1', '1', web3latest.utils.toWei('3'), web3latest.utils.toWei('15'), vcRootHash, BI_lcS1_sigB, BI_lcS1_sigI)
    // let seq = await lc2.sequence()
    // let numvc = await lc2.numOpenVC()
    // let ba = await lc2.balanceA()
    // let bi = await lc2.balanceI()
    // let root = await lc2.VCrootHash()

    // let isSettle = await lc2.isUpdateLCSettling()
    // let timeout = await lc2.updateLCtimeout()
  })

  it("Ingrid initiates settling vc with initial state", async () => {
    // Todo multiple channels and actual tree reformation
    let proof = [vcRootHash]
    proof = Utils.marshallState(proof)
    // todo: generate vcID before vc creation and perhaps store in state
    await lc.initVCstate(web3latest.utils.sha3('2222', {encoding: 'hex'}), web3latest.utils.sha3('1337', {encoding: 'hex'}), proof, '0', partyA, partyB, web3latest.utils.toWei('3'), web3latest.utils.toWei('9'), AB_vcS0_sigA, AB_vcS0_sigB)

  })

  it("Igrid or a watcher supply latest known vc state vcS1", async () => {
    await lc.settleVC(web3latest.utils.sha3('2222', {encoding: 'hex'}), web3latest.utils.sha3('1337', {encoding: 'hex'}), '1', partyA, partyB, web3latest.utils.toWei('5'), web3latest.utils.toWei('7'), AB_vcS1_sigA, AB_vcS1_sigB)
  })

  it("Hub may now sign Alice's lcS2 state to consensus close VC", async () => {
    AI_lcS2_sigI = await web3latest.eth.sign(AI_lcS2, partyI)
  })

  it("Anyone calls the wakeup function to settle vc state into lc state", async () => {
    await lc.closeVirtualChannel(web3latest.utils.sha3('2222', {encoding: 'hex'}), web3latest.utils.sha3('1337', {encoding: 'hex'}))
  })

  it("Anyone calls close byzantine channel since all vc are closed", async () => {
    // var balA = await web3latest.eth.getBalance(partyA)
    // var balB = await web3latest.eth.getBalance(partyI)
    // console.log('Balance A before close: ' + balA)
    // console.log('Balance I before close: ' + balB)
    await lc.byzantineCloseChannel(web3latest.utils.sha3('2222', {encoding: 'hex'}))
    // balA = await web3latest.eth.getBalance(partyA)
    // balB = await web3latest.eth.getBalance(partyI)
    // console.log('Balance A after close: ' + balA)
    // console.log('Balance I after close: ' + balB)
  })


})