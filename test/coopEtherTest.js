// 'use strict'

// import MerkleTree from './helpers/MerkleTree'
// const Utils = require('./helpers/utils')
// const Ledger = artifacts.require('./LedgerChannel.sol')
// const EC = artifacts.require('./ECTools.sol')

// let lc
// let lc2

// // state

// let partyA
// let partyB
// let partyI

// let vcRootHash

// // is close flag, lc state sequence, number open vc, vc root hash, partyA/B, partyI, balA/B, balI

// let AI_lcS0
// let AI_lcS1
// let AI_lcS2
// let AI_lcS3

// let BI_lcS0
// let BI_lcS1
// let BI_lcS2

// let AB_vcS0
// let AB_vcS1

// // signature storage
// let AI_lcS0_sigA
// let AI_lcS1_sigA
// let AI_lcS2_sigA
// let AI_lcS3_sigA

// let AI_lcS0_sigI
// let AI_lcS1_sigI
// let AI_lcS2_sigI
// let AI_lcS3_sigI

// let BI_lcS0_sigB
// let BI_lcS1_sigB
// let BI_lcS2_sigB

// let BI_lcS0_sigI
// let BI_lcS1_sigI
// let BI_lcS2_sigI

// let AB_vcS0_sigA
// let AB_vcS1_sigA

// let AB_vcS0_sigB
// let AB_vcS1_sigB

// contract('Test Cooperative Ether Payments', function(accounts) {

//   before(async () => {
//     partyA = accounts[0]
//     partyB = accounts[1]
//     partyI = accounts[2]

//     let ec = await EC.new()
//     Ledger.link('ECTools', ec.address)
//   })

//   it("Create initial ledger channel state lcS0 for AI channel", async () => {
//     AI_lcS0 = []
//     AI_lcS0.push(0)
//     AI_lcS0.push(0)
//     AI_lcS0.push(0)
//     AI_lcS0.push('0x0')
//     AI_lcS0.push(partyA)
//     AI_lcS0.push(partyI)
//     AI_lcS0.push(web3.toWei(10, 'ether'))
//     AI_lcS0.push(web3.toWei(20, 'ether'))

//     AI_lcS0 = Utils.marshallState(AI_lcS0)
//   })

//   it("Alice signs initial lcS0 state", async () => {
//     AI_lcS0_sigA = await web3.eth.sign(partyA, web3.sha3(AI_lcS0, {encoding: 'hex'}))
//   })


//   it("Alice initiates ledger channel with lcS0", async () => {
//     lc = await Ledger.new(partyA, partyI, web3.toWei(10, 'ether'), web3.toWei(20, 'ether'), {from:partyA, value: web3.toWei(10, 'ether')})
//     let openTimeout = await lc.LCopenTimeout()
//     let stateHash = await lc.stateHash()
//     let pa = await lc.partyA()
//     let pi = await lc.partyI()
//     let ba = await lc.balanceA()
//     let bi = await lc.balanceI()
//   })

//   it("Hub signs initial lcS0 state", async () => {
//     AI_lcS0_sigI = await web3.eth.sign(partyI, web3.sha3(AI_lcS0, {encoding: 'hex'}))
//   })

//   it("Ingrid joins ledger channel", async () => {
//     await lc.joinChannel(AI_lcS0_sigI, {from: partyI, value: web3.toWei(20, 'ether')})
//   })

//   // Bob creates ledger channel
//   it("Create Bob's ledger channel state lcS0 for BI channel", async () => {
//     BI_lcS0 = []
//     BI_lcS0.push(0)
//     BI_lcS0.push(0)
//     BI_lcS0.push(0)
//     BI_lcS0.push('0x0')
//     BI_lcS0.push(partyB)
//     BI_lcS0.push(partyI)
//     BI_lcS0.push(web3.toWei(10, 'ether'))
//     BI_lcS0.push(web3.toWei(20, 'ether'))

//     BI_lcS0 = Utils.marshallState(BI_lcS0)
//   })

//   it("Bob signs initial lcS0 state", async () => {
//     BI_lcS0_sigB = await web3.eth.sign(partyB, web3.sha3(BI_lcS0, {encoding: 'hex'}))
//   })


//   it("Bob initiates ledger channel with lcS0", async () => {
//     lc2 = await Ledger.new(partyB, partyI, web3.toWei(10, 'ether'), web3.toWei(20, 'ether'), {from:partyB, value: web3.toWei(10, 'ether')})
//     let openTimeout = await lc.LCopenTimeout()
//     let stateHash = await lc.stateHash()
//     let pa = await lc.partyA()
//     let pi = await lc.partyI()
//     let ba = await lc.balanceA()
//     let bi = await lc.balanceI()
//   })

//   it("Hub signs initial lcS0 state", async () => {
//     BI_lcS0_sigI = await web3.eth.sign(partyI, web3.sha3(BI_lcS0, {encoding: 'hex'}))
//   })

//   it("Ingrid joins ledger channel", async () => {
//     await lc2.joinChannel(BI_lcS0_sigI, {from: partyI, value: web3.toWei(20, 'ether')})
//   })


//   it("Alice creates vc state vcSO with Bob", async () => {
//     AB_vcS0 = []
//     AB_vcS0.push(0)
//     AB_vcS0.push(partyA)
//     AB_vcS0.push(partyB)
//     AB_vcS0.push(partyI)
//     AB_vcS0.push(web3.toWei(5, 'ether'))
//     AB_vcS0.push(web3.toWei(7, 'ether'))

//     AB_vcS0 = Utils.marshallState(AB_vcS0)
//   })

//   it("Alice and Bob sign vcSO", async () => {
//     AB_vcS0_sigA = await web3.eth.sign(partyA, web3.sha3(AB_vcS0, {encoding: 'hex'}))
//     AB_vcS0_sigB = await web3.eth.sign(partyB, web3.sha3(AB_vcS0, {encoding: 'hex'}))
//   })

//   it("Alice creates lc state lcS1 containing vcSO with Ingrid", async () => {
//     var hash = web3.sha3(AB_vcS0, {encoding: 'hex'})
//     var buf = Utils.hexToBuffer(hash)
//     var elems = []
//     elems.push(buf)
//     var merkle = new MerkleTree(elems)

//     vcRootHash = Utils.bufferToHex(merkle.getRoot())

//     AI_lcS1 = []
//     AI_lcS1.push(0)
//     AI_lcS1.push(1)
//     AI_lcS1.push(1)
//     AI_lcS1.push(vcRootHash)
//     AI_lcS1.push(partyA)
//     AI_lcS1.push(partyI)
//     AI_lcS1.push(web3.toWei(5, 'ether'))
//     AI_lcS1.push(web3.toWei(13, 'ether'))

//     AI_lcS1 = Utils.marshallState(AI_lcS1)
//   })

//   it("Alice signs lcS1 state and sends to Hub", async () => {
//     AI_lcS1_sigA = await web3.eth.sign(partyA, web3.sha3(AI_lcS1, {encoding: 'hex'}))
//   })

//   it("Bob creates lc state lcS1 containing vcSO with Ingrid", async () => {
//     var hash = web3.sha3(AB_vcS0, {encoding: 'hex'})
//     var buf = Utils.hexToBuffer(hash)
//     var elems = []
//     elems.push(buf)
//     var merkle = new MerkleTree(elems)

//     vcRootHash = Utils.bufferToHex(merkle.getRoot())

//     BI_lcS1 = []
//     BI_lcS1.push(0)
//     BI_lcS1.push(1)
//     BI_lcS1.push(1)
//     BI_lcS1.push(vcRootHash)
//     BI_lcS1.push(partyB)
//     BI_lcS1.push(partyI)
//     BI_lcS1.push(web3.toWei(3, 'ether'))
//     BI_lcS1.push(web3.toWei(15, 'ether'))

//     BI_lcS1 = Utils.marshallState(BI_lcS1)
//   })

//   it("Bob signs lcS1 state and sends to hub", async () => {
//     BI_lcS1_sigB = await web3.eth.sign(partyB, web3.sha3(BI_lcS1, {encoding: 'hex'}))
//   })

//   it("Hub signs both Alice and Bob's lcS1 state to open VC", async () => {
//     AI_lcS1_sigI = await web3.eth.sign(partyI, web3.sha3(AI_lcS1, {encoding: 'hex'}))
//     BI_lcS1_sigI = await web3.eth.sign(partyI, web3.sha3(BI_lcS1, {encoding: 'hex'}))
//   })

//   it("Alice generates virtual channel payment with Bob", async () => {
//     AB_vcS1 = []
//     AB_vcS1.push(1)
//     AB_vcS1.push(partyA)
//     AB_vcS1.push(partyB)
//     AB_vcS1.push(partyI)
//     AB_vcS1.push(web3.toWei(3, 'ether'))
//     AB_vcS1.push(web3.toWei(9, 'ether'))

//     AB_vcS1 = Utils.marshallState(AB_vcS1)    
//   })

//   it("Alice and Bob sign vcS1", async () => {
//     AB_vcS1_sigA = await web3.eth.sign(partyA, web3.sha3(AB_vcS1, {encoding: 'hex'}))
//     AB_vcS1_sigB = await web3.eth.sign(partyB, web3.sha3(AB_vcS1, {encoding: 'hex'}))
//   })

//   it("Alice generates lc state to close vc", async () => {
//     AI_lcS2 = []
//     AI_lcS2.push(0)
//     AI_lcS2.push(2)
//     AI_lcS2.push(0)
//     AI_lcS2.push('0x0')
//     AI_lcS2.push(partyA)
//     AI_lcS2.push(partyI)
//     AI_lcS2.push(web3.toWei(8, 'ether'))
//     AI_lcS2.push(web3.toWei(22, 'ether'))

//     AI_lcS2 = Utils.marshallState(AI_lcS2)    
//   })

//   it("Bob generates lc state to close vc", async () => {
//     BI_lcS2 = []
//     BI_lcS2.push(0)
//     BI_lcS2.push(2)
//     BI_lcS2.push(0)
//     BI_lcS2.push('0x0')
//     BI_lcS2.push(partyB)
//     BI_lcS2.push(partyI)
//     BI_lcS2.push(web3.toWei(12, 'ether'))
//     BI_lcS2.push(web3.toWei(18, 'ether'))

//     BI_lcS2 = Utils.marshallState(BI_lcS2)    
//   })

//   it("Alice signs lcS2 state and sends to Hub", async () => {
//     AI_lcS2_sigA = await web3.eth.sign(partyA, web3.sha3(AI_lcS2, {encoding: 'hex'}))
//   })

//   it("Bob signs lcS2 state and sends to hub", async () => {
//     BI_lcS2_sigB = await web3.eth.sign(partyB, web3.sha3(BI_lcS2, {encoding: 'hex'}))
//   })

//   it("Hub signs both Alice and Bob's lcS2 state to open VC", async () => {
//     AI_lcS2_sigI = await web3.eth.sign(partyI, web3.sha3(AI_lcS2, {encoding: 'hex'}))
//     BI_lcS2_sigI = await web3.eth.sign(partyI, web3.sha3(BI_lcS2, {encoding: 'hex'}))
//   })

//   it("Alice creates lc update to close lc", async () => {
//     AI_lcS3 = []
//     AI_lcS3.push(1)
//     AI_lcS3.push(3)
//     AI_lcS3.push(0)
//     AI_lcS3.push('0x0')
//     AI_lcS3.push(partyA)
//     AI_lcS3.push(partyI)
//     AI_lcS3.push(web3.toWei(8, 'ether'))
//     AI_lcS3.push(web3.toWei(22, 'ether'))

//     AI_lcS3 = Utils.marshallState(AI_lcS3) 
//   })

//   it("Alice signs lcS3 state and sends to Hub", async () => {
//     AI_lcS3_sigA = await web3.eth.sign(partyA, web3.sha3(AI_lcS3, {encoding: 'hex'}))
//   })

//   it("Hub signs closing lcS3 state", async () => {
//     AI_lcS3_sigI = await web3.eth.sign(partyI, web3.sha3(AI_lcS3, {encoding: 'hex'}))
//   })

//   it("Close ledger channel", async () => {
//     var balA = await web3.fromWei(web3.eth.getBalance(partyA), 'ether')
//     var balB = await web3.fromWei(web3.eth.getBalance(partyI), 'ether')
//     // console.log('Balance A before close: ' + balA)
//     // console.log('Balance I before close: ' + balB)
//     await lc.consensusCloseChannel(1, 3, web3.toWei(8, 'ether'), web3.toWei(22, 'ether'), AI_lcS3_sigA, AI_lcS3_sigI)
//     balA = await web3.fromWei(web3.eth.getBalance(partyA), 'ether')
//     balB = await web3.fromWei(web3.eth.getBalance(partyI), 'ether')
//     // console.log('Balance A after close: ' + balA)
//     // console.log('Balance I after close: ' + balB)
//   })

// })