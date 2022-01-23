import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';

class RequestRow extends Component {
  state = {
    loadingApprove: false,
    loadingFinalize: false,
    errorMessage: ''
  };

  approveRequest = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.campaignAddress);
    const accounts = await web3.eth.getAccounts();

    this.setState({ loadingApprove: true, errorMessage: '' });
    try {
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0]
      })
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loadingApprove: false });
  };

  finalizeRequest = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.campaignAddress);
    const accounts = await web3.eth.getAccounts();

    this.setState({ loadingFinalize: true, errorMessage: '' });
    try {
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      })
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loadingFinalize: false });
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          { request.complete ? null : (
              <Button
                basic
                color="green"
                loading={this.state.loadingApprove}
                onClick={this.approveRequest}
              >
                Approve
              </Button>
            )
          }
        </Cell>
        <Cell>
          { request.complete ? null : (
              <Button
                basic
                color="teal"
                loading={this.state.loadingFinalize}
                onClick={this.finalizeRequest}
              >
                Finalize
              </Button>
            )
          }
        </Cell>
      </Row>
    )
  }
}

export default RequestRow;