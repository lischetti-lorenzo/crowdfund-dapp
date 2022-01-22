import React from 'react';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>
        <Link href="/">
          CrowdCoin
        </Link>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Link href="/">
            Campaigns
          </Link>
        </Menu.Item>
        
        <Menu.Item>
          <Link href="/campaigns/new">
            +
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}