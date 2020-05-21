const defaultLang = 'CV'

export const intlTabs = (lang) =>
  ({
    CV: {
      MyAssets: 'My Parcels',
      MyFRights: 'My Land Tokens',
      MyIRights: 'My Rental Tokens',
    },
    ENS: {
      MyAssets: 'My Domains',
      MyFRights: 'My Domain NFTs',
      MyIRights: 'My Rental NFTs',
    },
    NFT: {
      MyAssets: 'My Assets',
      MyFRights: 'My fRights',
      MyIRights: 'My iRights',
    },
  }[lang || defaultLang])

export const intlForm = (lang) =>
  ({
    CV: {
      exclusive: 'Exclusive',
      nonExclusive: 'Non-Exclusive',
      maxISupply: 'Max Supply - Rentals?',
    },
    ENS: {
      exclusive: 'Exclusive',
      nonExclusive: 'Non-Exclusive',
      maxISupply: 'Max Supply - Rentals?',
    },
    NFT: {
      exclusive: 'Exclusive',
      nonExclusive: 'Non-Exclusive',
      maxISupply: 'Max Supply - iRights?',
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
    ENS: {
      freeze: 'Activate Domain Rental',
      issueI: 'Create a new Rental Token',
      transfer: 'Transfer Rental Token',
      revokeI: 'Burn Rental Token',
      unfreeze: 'Deactivate Domain Rental',
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

export const intlUnits = (lang) =>
  ({
    CV: {
      asset: 'CryptoVoxel',
      fRight: 'Land',
      iRight: 'Rental',
    },
    ENS: {
      asset: 'ENS Domain',
      fRight: 'Frozen Domain Token',
      iRight: 'Rental Token',
    },
    NFT: {
      asset: 'NFT',
      fRight: 'fRight',
      iRight: 'iRight',
    },
  }[lang || defaultLang])

export const intlInfo = (lang) => {
  const units = intlUnits(lang)

  return {
    fRight: [
      `1. You can retrieve the original ${units.asset} only if you hold its ${units.fRight} Token.`,
      `2. Transferring the ${units.fRight} Token, in essence, means transferring your ownership of the original ${units.asset} itself.`,
      `3. Whatever you do, please do not transfer your ${units.fRight} Token to a smart contract, as it would mean you would permanently lose your original ${units.asset} itself. Please do not transfer your ${units.fRight} Token to a Smart contract`,
    ],
    iRight: [
      `1. You can retrieve the original ${units.asset} if either all its ${units.iRight} Tokens have been burned / expired, or if its ${units.fRight} Token has expired.`,
      `2. Transferring the ${units.iRight} Token, in essence, means transferring your access to the original ${units.asset}.`,
    ],
  }
}
