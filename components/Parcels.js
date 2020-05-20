import Tabs from '~components/common/Tabs'

export const CV_ADDR = '0x79986af15539de2db9a5086382daeda917a9cf0c'
export const filterCV = (isCV, getName) => ({ asset_contract: { address } }) =>
  !['FRight', 'IRight'].includes(getName(address)) && (address.toLowerCase() === CV_ADDR) === isCV
export const filterBase = (isCV) => ({ base }) => (base && base[0].toLowerCase() === CV_ADDR) === isCV

export default function (props) {
  return <Tabs isCV {...props} />
}
