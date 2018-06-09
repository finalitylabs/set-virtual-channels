pragma solidity ^0.4.23;

/// @title SpankChain Virtual-Channels - A layer2 hub and spoke payment network 
/// @author Nathan Ginnever

contract LedgerChannel {

    string public constant NAME = "Ledger Channel";
    string public constant VERSION = "0.0.1";


    address public partyA; // VC participant
    address public partyI; // Hub
    uint256 public balanceA;
    uint256 public balanceI;
    uint256 public sequence;
    bytes32 public stateHash;
    bytes32 public VCrootHash;

    // timeout storage
    uint256 public confirmTime = 100 minutes;
    uint256 public LCopenTimeout = 0;
    uint256 public updateLCtimeout = 0; // when update LC times out

    bool public isOpen = false; // true when both parties have joined
    bool public isUpdateLCSettling = false;
    bool public isFinal = false;

    uint256 public numOpenVC = 0;

    address public closingParty = address(0x0);

    // virtual-channel state
    struct VirtualChannel {
        uint256 isClose;
        uint256 isInSettlementState;
        uint256 sequence;
        address challenger; // Initiator of challenge
        uint256 updateVCtimeout; // when update VC times out

        //uint256 subchan1; // ID of LC AI
        //uint256 subchan2; // ID of LC BI
        // channel state
        address partyA; // VC participant A
        address partyB; // VC participant B
        address partyI; // LC hub
        uint256 balanceA;
        uint256 balanceB;
        //uint256 balanceI;
    }

    mapping(uint => VirtualChannel) virtualChannels;

    constructor(address _partyA, address _partyB, uint256 _balanceA, uint256 _balanceI) public payable {
        require(_partyA != 0x0, 'No partyA address provided to LC constructor');
        require(_partyI != 0x0, 'No partyB address provided to LC constructor');
        require(msg.value == _balanceA);
        require(msg.sender == _partyA);
        // Set initial ledger channel state
        // Alice must execute this and we assume the initial state 
        // to be signed from this requirement
        // Alternative is to check a sig as in joinChannel
        partyA = _partyA;
        partyI = _partyI;
        balanceA = _balanceA;
        balanceI = _balanceI;
        sequeunce = 0;
        // is close flag, lc state sequence, number open vc, vc root hash, partyA... 
        stateHash = keccak256(0, 0, 0, 0x0, partyA, partyI, balanceA, balanceI);
        LCopenTimeout = now + confirmTime;
    }

    function LCOpenTimeout() public {
        require(msg.sender == partyA && isOpen == false);
        if (now > LCopenTimeout) {
            selfdestruct(partyA);
        }
    }

    function joinChannel(uint8 _v, bytes32 _r, bytes32 _s) public payable {
        // require the channel is not open yet
        require(isOpen == false);
        // Initial state
        bytes32 _state = keccak256(0, 0, 0x0, partyA, partyI, balanceA, msg.value);
        address recover = _getSig(_state, _v, _r, _s);
        require(_state == stateHash);

        // no longer allow joining functions to be called
        isOpen = true;

        // check that the state is signed by the sender and sender is in the state
        require(partyI == recover);
    }


    // additive updates of monetary state
    function deposit(address recipient) public payable {
        require(isOpen == true, 'Tried adding funds to a closed channel');
        require(recipient == partyA || recipient == partyI);

        if(partyA == recipient) { balanceA += msg.value; }
        if(partyI == recipient) { balanceI += msg.value; }
    }

    // TODO: Check there are no open virtual channels, the client should have cought this before signing a close LC state update
    function consensusCloseChannel(uint256 isClose, uint256 sequence, uint256 _balanceA, uint256 _balanceI, uint8[2] sigV, bytes32[2] sigR, bytes32[2] sigS) public {
        require(isClose == 1, 'State did not have a signed close sentinel');

        // assume num open vc is 0 and root hash is 0x0
        bytes32 _state = keccak256(isClose, sequence, 0, 0x0, partyA, partyI, _balanceA, _balanceI);

        require(partyA == _getSig(_state, sigV[0], sigR[0], sigS[0]));
        require(partyI == _getSig(_state, sigV[1], sigR[1], sigS[1]));

        _finalizeAll(_balanceA, _balanceI);
        isOpen = false;
    }

    // Byzantine functions

    function updateLCstate(uint256 isClose, uint256 _sequence, uint256 _numOpenVc, uint256 _balanceA, uint256 _balanceI, bytes32 VCroot, uint8[2] sigV, bytes32[2] sigR, bytes32[2] sigS) public {
        require(isClose == 0, 'State should not have a signed close sentinel');
        require(sequence < _sequence); // do same as vc sequence check

        bytes32 _state = keccak256(isClose, sequence, VCroot, numOpenVc, partyA, partyI, _balanceA, _balanceI);

        require(partyA == _getSig(_state, sigV[0], sigR[0], sigS[0]));
        require(partyI == _getSig(_state, sigV[1], sigR[1], sigS[1]));

        // update LC state
        sequence = _sequence;
        numOpenVC = _numOpenVc;
        balanceA = _balanceA;
        balanceI = _balanceI;
        VCrootHash = VCroot;

        isUpdateLCSettling = true;
        updateLCtimeout = now + confirmTime;

        // make settlement flag
    }

    // Params: vc init state, vc final balance, vcID
    function settleVC(uint _vcID, bytes _proof, uint256 _sequence, address _partyB, uint256 _balanceA, uint256 _balanceB, uint256 updateSeq, uint256 updateBalA, uint256 updateBalB, uint8[4] sigV, bytes32[4] sigR, bytes32[4] sigS) public payable{
        // sub-channel must be open
        require(virtualChannels[_vcID].isClose == 0);
        // Check time has passed on updateLCtimeout and has not passed the time to store a vc state
        require(updateLCtimeout < now && now < virtualChannels[_vcID].updateVCtimeout);
        // partyB is now Ingrid 
        bytes32 _initState = keccak256(_sequence, partyA, _partyB, partyI, _balanceA, _balanceB);

        // Make sure Alice and Bob have signed initial vc state (A/B in oldState)
        require(partyA == _getSig(_initState, sigV[0], sigR[0], sigS[0]));
        require(_partyB == _getSig(_initState, sigV[1], sigR[1], sigS[1]));

        virtualChannels[_vcID].partyB = _partyB; // VC participant B

        bytes32 _upateState = keccak256(updateSeq, partyA, _partyB, partyI, updateBalA, updateBalB);

        // Make sure Alice and Bob have signed a higher sequence new state
        require(partyA == _getSig(_upateState, sigV[2], sigR[2], sigS[2]));
        require(virtualChannels[_vcID].partyB == _getSig(_upateState, sigV[3], sigR[3], sigS[3]));

        if(_initState != _upateState) {
            // check the new state is a higher sequence
            require(virtualChannels[_vcID].sequence < updateSeq);
        } else {
            // only allow startSettleVC to be called once with init state only
            // if a valid higher sequence is passesd in, another higher sequence
            // will have to follow
            require(virtualChannels[_vcID].sequence == 0);
        }

        // Check the oldState is in the root hash
        require(_isContained(_initState, _proof, VCrootHash));
        // store VC data
        // we may want to record who is initiating on-chain settles
        virtualChannels[_vcID].challenger = msg.sender;
        virtualChannels[_vcID].sequence = updateSeq;

        // channel state
        virtualChannels[_vcID].partyA = partyA; // VC participant A
        virtualChannels[_vcID].partyI = partyI; // LC hub
        virtualChannels[_vcID].balanceA = updateBalA;
        virtualChannels[_vcID].balanceB = updateBalB;

        virtualChannels[_vcID].updateVCtimeout = now + confirmTime;
        virtualChannels[_vcID].isInSettlementState = 1;
    }

    function closeVirtualChannel(uint _vcID) public {
        // require(updateLCtimeout > now)
        require(subChannels[_channelID].isInSettlementState == 1);
        require(virtualChannels[_vcID].updateVCtimeout < now);
        // reduce the number of open virtual channels stored on LC
        numOpenVC--;
        // re-introduce the balances back into the LC state from the settled VC
        balanceA+=virtualChannels[_vcID].balanceA;
        balanceI+=virtualChannels[_vcID].balanceB;
        // close vc flags
        virtualChannels[_vcID].isClose = 1;
    }


    function byzantineCloseChannel() public{
        // check settlement flag
        require(numOpenChannels == 0);
        _finalizeAll(balanceA, balanceI);
        isFinal == true;
    }

    // Internal

    function _finalizeAll(uint256 _balanceA, uint256 _balanceI,) internal {
        partyA.transfer(_balanceA);
        partyI.transfer(_balanceI);
    }

    function _isContained(bytes32 _hash, bytes _proof, bytes32 _root) internal pure returns (bool) {
        bytes32 cursor = _hash;
        bytes32 proofElem;

        for (uint256 i=64; i<=_proof.length; i+=32) {
            assembly { proofElem := mload(add(_proof, i)) }

            if (cursor < proofElem) {
                cursor = keccak256(cursor, proofElem);
            } else {
                cursor = keccak256(proofElem, cursor);
            }
        }

        return cursor == _root;
    }


    function _getSig(bytes _d, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns(address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 h = keccak256(_d);

        bytes32 prefixedHash = keccak256(prefix, h);

        address a = ecrecover(prefixedHash, _v, _r, _s);

        //address a = ECRecovery.recover(prefixedHash, _s);

        return(a);
    }
}
