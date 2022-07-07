import fetch from 'cross-fetch';
import config from './../config';
import { toHexFormat } from './../utils';


const rpcToChainNodeAsync = (method, params = []) => {
  return fetch(config.DEIP_FULL_NODE_URL, {
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method,
      params
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then((response) => response.json())
    .then(({ error, result }) => {
      if (error) {
        throw new Error(
          `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
        );
      }
      return result;
    })
    .catch(error => {
      console.error(error);
      throw new Error(
        `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
      );
    });
}


const getAccountAsync = async function (id) {
  return rpcToChainNodeAsync("deipDao_get", [null, toHexFormat(id)]);
}


const getProjectAsync = async function (id) {
  return rpcToChainNodeAsync("deip_getProject", [null, toHexFormat(id)]);
}


const getProposalAsync = async function (id) {
  return rpcToChainNodeAsync("deipProposal_get", [null, toHexFormat(id)]);
}


const getFungibleTokenAsync = async function (id) {
  return rpcToChainNodeAsync("assets_getAsset", [null, toHexFormat(id)]);
}


const getFungibleTokenBalanceByOwnerAsync = async function (address, assetId) {
  return rpcToChainNodeAsync("assets_getAssetBalanceByOwner", [null, address, toHexFormat(assetId)]);
}


const getInvestmentOpportunityAsync = async function (id) {
  return rpcToChainNodeAsync("deip_getInvestmentOpportunity", [null, toHexFormat(id)]);
}


const getContractAgreementAsync = async function (id) {
  return rpcToChainNodeAsync("deip_getContractAgreement", [null, toHexFormat(id)]);
}


const sendTxAsync = (rawTx) => {
  return rpcToChainNodeAsync('author_submitExtrinsic', [rawTx]);
}


export {
  getAccountAsync,
  getProjectAsync,
  getProposalAsync,
  getFungibleTokenAsync,
  getFungibleTokenBalanceByOwnerAsync,
  getInvestmentOpportunityAsync,
  getContractAgreementAsync,
  sendTxAsync
}