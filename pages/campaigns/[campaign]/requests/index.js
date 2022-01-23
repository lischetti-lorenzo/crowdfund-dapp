import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Link from 'next/link';
import Layout from '../../../../components/Layout';

class RequestsList extends Component {
  static async getInitialProps(props) {
    const campaignAddress = props.query.campaign;

    return { campaignAddress };
  }

  render () {
    return (
      <Layout>
        <h3>Request List</h3>
        <Link href={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
      </Layout>
    )
  }
}

export default RequestsList;