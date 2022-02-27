import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xa08A32917f5B1026B976fB8228977316869B4de6'
);

export default factory;