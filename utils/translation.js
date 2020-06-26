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
      exclusive: 'Encumbered',
      nonExclusive: 'Unencumbered',
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
      approve: 'Approve',
      issueUnencumberedI: 'Create Metatoken',
      freeze: 'Activate Rental',
      issueI: 'Create a new Rental Token',
      transfer: 'Transfer Rental Token',
      revokeI: 'Burn Rental Token',
      unfreeze: 'Deactivate Rental',
      submit: 'Proceed',
    },
    ENS: {
      approve: 'Approve',
      issueUnencumberedI: 'Create Metatoken',
      freeze: 'Activate Domain Rental',
      issueI: 'Create a new Rental Token',
      transfer: 'Transfer Rental Token',
      revokeI: 'Burn Rental Token',
      unfreeze: 'Deactivate Domain Rental',
      submit: 'Proceed',
    },
    NFT: {
      approve: 'Approve',
      issueUnencumberedI: 'Create Metatoken',
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
      contract: 'DAO',
      asset: 'CryptoVoxel Parcel',
      fRight: 'Land',
      iRight: 'Rental',
    },
    ENS: {
      contract: 'DAO',
      asset: 'ENS Domain',
      fRight: 'Frozen Domain',
      iRight: 'Rental',
    },
    NFT: {
      contract: 'DAO',
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

export const intlTransactions = (lang) => {
  const titles = intlActions(lang)
  const units = intlUnits(lang)

  return {
    approve: [
      titles.approve,
      `Please wait while the ${units.contract} contract acknowledges your authorization to store your ${units.asset}`,
    ],
    freeze: [
      titles.freeze,
      'Please wait while',
      `a) Your ${units.asset} is sent to the ${units.contract},`,
      `b) ${units.fRight} Token is minted to your address,`,
      `c) ${units.iRight} Token is minted to your address`,
    ],
    issueUnencumberedI: [titles.issueUnencumberedI, 'Please wait while', 'a) Your Metatoken is minted to your address'],
    issueI: [titles.issueI, `Please wait while a new ${units.iRight} Token is being minted to your address`],
    transfer: (to) => [titles.transfer, `Please wait while the ${units.iRight} Token is being transferred to ${to}`],
    revokeI: [titles.revokeI, `Please wait while the ${units.iRight} Token is being burned from your address.`],
    unfreeze: [
      titles.unfreeze,
      'Please wait while',
      `a) Your ${units.fRight} Token is being burned from your address`,
      `b) Your ${units.asset} is being sent to your address`,
    ],
    submit: 'Proceed',
  }
}
