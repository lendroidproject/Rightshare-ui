const defaultLang = 'CV'

export const intlTabs = (lang) =>
  ({
    CV: {
      MyAssets: 'My Parcels',
      MyFRights: 'My Land Tokens',
      MyIRights: 'My Rental Tokens',
    },
    NFT: {
      MyAssets: 'My Assets',
      MyFRights: 'My fRights',
      MyIRights: 'My iRights',
    },
  }[lang || defaultLang])

export const intlActions = (lang) =>
  ({
    CV: {
      freeze: 'Activate Rental',
      issueI: 'Create a new Rental Token',
      transfer: 'Transfer Rental Token',
      revokeI: 'Burn Rental Token',
      unfreeze: 'Deactivate Rental',
      submit: 'Proceed',
    },
    NFT: {
      freeze: 'Initiate Rightshare',
      issueI: 'Mint iRight',
      transfer: 'Transfer iRight',
      revokeI: 'Burn iRight',
      unfreeze: 'Unfreeze',
      submit: 'Proceed',
    },
  }[lang || defaultLang])
