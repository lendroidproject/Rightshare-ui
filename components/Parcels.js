import Tabs from '~components/common/Tabs'

export const Addresses = {
  CV: '0x79986af15539de2db9a5086382daeda917a9cf0c',
  ENS: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  '0x79986af15539de2db9a5086382daeda917a9cf0c': 'CV',
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85': 'ENS',
}
const isAddr = (lang, addr) => (Addresses[lang] ? addr.toLowerCase() === Addresses[lang] : true)
export const filterPlatform = (lang, getName) => ({ asset_contract: { address } }) =>
  !['FRight', 'IRight'].includes(getName(address)) && isAddr(lang, address)
export const filterBase = (lang) => ({ base }) => base && isAddr(lang, base[0])
export const platforms = { CV: 'cryptovoxels', ENS: '', NFT: '' }

export default function (props) {
  return <Tabs lang="CV" {...props} />
}
