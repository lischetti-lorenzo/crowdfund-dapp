import React, { Component } from 'react';
import { withRouter } from "next/router";
import Link from 'next/link';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import web3 from '../../../../ethereum/web3';
import Campaign from '../../../../ethereum/campaign';

class RequestNew extends Component {
  state = {
    description: '',
    value: '',
    recipientAddress: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props ){
    const campaignAddress = props.query.campaign;

    return { campaignAddress };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
    const { description, value, recipientAddress } = this.state; 
    try {
      const campaign = Campaign(this.props.campaignAddress);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipientAddress)
        .send({
          from: accounts[0]
        });

      this.props.router.push(`/campaigns/${this.props.campaignAddress}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message })
    }

    this.setState({
      loading: false,
      value: '',
      description: '',
      recipientAddress: ''
    });
  }

  render() {
    return (
      <Layout>
        <Link href={`/campaigns/${this.props.campaignAddress}/requests`}>
          <a>Back</a>
        </Link>
        <h3>New Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({description: event.target.value})}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient address</label>
            <Input
              value={this.state.recipientAddress}
              onChange={event => this.setState({recipientAddress: event.target.value})}
            />
          </Form.Field>

          <Message error header="Error!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    )
  }
}

export default withRouter(RequestNew);