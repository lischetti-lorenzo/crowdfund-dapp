//SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint _minimumContribution, uint _goal, uint _deadline) public {
        Campaign newCampaign = new Campaign(_minimumContribution, msg.sender, _goal, _deadline);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        uint approvalCount;
        address payable recipient;
        bool complete;
        mapping(address => bool) requestApprovers;        
    }

    mapping(uint => Request) public requests;
    uint public numRequests;

    address public manager;
    uint public minimumContribution;
    mapping(address => uint) public approvers;
    uint public approversCount;

    uint public goal;
    uint public deadline; //timestamp
    uint public raisedAmount;

    modifier restrictedToManager() {
        require(msg.sender == manager, "Only manager can call to this funcion!");
        _;
    }

    constructor(uint _minimum, address _creator, uint _goal, uint _deadline) {
        manager = _creator;
        minimumContribution = _minimum;
        goal = _goal;
        deadline = block.timestamp + _deadline;
    }

    receive() payable external {
        contribute();
    }

    // TODO: Add test for deadline. Add test to check that an approver is not incrementing the approversCount twice
    function contribute() public payable {
        require(block.timestamp < deadline, "Campaing has already finished!");
        require(msg.value > minimumContribution, "Minimum Contribution not met!");

        if (approvers[msg.sender] == 0) {
            approversCount++;
        }
        approvers[msg.sender] += msg.value;
    }

    // TODO: Add tests for getRefunds function
    function getRefund() public {
        require(block.timestamp > deadline && raisedAmount < goal);
        require(approvers[msg.sender] > 0);

        payable(msg.sender).transfer(approvers[msg.sender]);
        approvers[msg.sender] = 0;
    }

    function createRequest(string memory _description, uint _value, address payable _recipient)
        public restrictedToManager
    {
        Request storage newRequest = requests[numRequests];
        numRequests++;

        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint _index) public {
        require(approvers[msg.sender] > 0, "You must be a contributor to approve a request!");
        Request storage request = requests[_index];
        require(!request.requestApprovers[msg.sender], "You have already approved this request!");

        request.requestApprovers[msg.sender] = true;
        request.approvalCount++;
    }

    // TODO: Add test for raisedAmount < goal.
    function finalizeRequest(uint _index) public restrictedToManager {
        require(raisedAmount >= goal);
        Request storage request = requests[_index];
        require(!request.complete, "The request has already been completed!");
        require(request.approvalCount > (approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return numRequests;
    }
}