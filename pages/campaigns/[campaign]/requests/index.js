import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import Campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/campaigns/requests/RequestRow';

class RequestsList extends Component {
  static async getInitialProps(props) {
    const campaignAddress = props.query.campaign;
    const campaign = Campaign(campaignAddress);
    const numberOfRequests = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(numberOfRequests)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return { campaignAddress, requests, numberOfRequests, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return <RequestRow
        key={index}
        id={index}
        request={request}
        campaignAddress={this.props.campaignAddress}
        approversCount={this.props.approversCount}
      />
    })
  }

  render () {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Request List</h3>
        <Link href={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>              
            </Row>
          </Header>

          <Body>
            {this.renderRows()}
          </Body>
        </Table>

        <div>Found {this.props.numberOfRequests} requests.</div>
      </Layout>
    )
  }
}

export default RequestsList;