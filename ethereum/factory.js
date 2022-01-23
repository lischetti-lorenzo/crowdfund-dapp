import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x62A592B8e936Fb3a534B529B4D1B1D3B35ECFd50'
);

export default factory;