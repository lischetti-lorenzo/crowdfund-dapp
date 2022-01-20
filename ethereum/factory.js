import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x65ec3aaCb87A8B96942870c5EdD966E15eB1A34E'
);

export default factory;