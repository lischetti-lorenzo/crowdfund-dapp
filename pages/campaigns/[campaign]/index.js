import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../../components/campaigns/ContributeForm';

class CampaignDetail extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.campaign);

    const campaignDetail = await campaign.methods.getSummary().call();
    return {
      minimumContribution: campaignDetail[0],
      balance: campaignDetail[1],
      numberOfRequests: campaignDetail[2],
      approversCount: campaignDetail[3],
      manager: campaignDetail[4],
      campaignAddress: props.query.campaign
    };
  }

  renderCards() {
    const {balance, minimumContribution, numberOfRequests, approversCount, manager} = this.props;
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager that has created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: numberOfRequests,
        meta: 'Number Of Requestsr',
        description: 'A request tries to withdraw money from the contract. Request must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend'
      }
    ];
  
    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
         <h3>Campaign Detail</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm campaignAddress={this.props.campaignAddress} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Button
                content='View Requests'
                primary={true}
                onClick={() => this.props.router.push(`/campaigns/${this.props.campaignAddress}/requests`)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default withRouter(CampaignDetail);