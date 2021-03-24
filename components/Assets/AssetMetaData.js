import styled from 'styled-components'

export const Table = styled.table`
  margin: 12px 0;
  width: 100%;
  font-size: 16px;
  @media all and (max-width: 767px) {
    font-size: 14px;
  }

  tbody {
    tr td {
      padding: 4px 0;

      &:first-child {
        font-weight: bold;
      }
    }
  }
`

export default function AssetMetaData({ data: { expiry, isExclusive, maxISupply, circulatingISupply, serialNumber } }) {
  return (
    <Table cellSpacing="0" borderSpacing="1">
      <tbody>
        <tr>
          <td>Expiry (UTC):</td>
          <td>{expiry}</td>
        </tr>
        <tr>
          <td>Exclusive :</td>
          <td>{isExclusive ? 'Yes' : 'No'}</td>
        </tr>
        {maxISupply && (
          <tr>
            <td>Max I Supply :</td>
            <td>{maxISupply}</td>
          </tr>
        )}
        {circulatingISupply && (
          <tr>
            <td>Curculating I Supply :</td>
            <td>{circulatingISupply}</td>
          </tr>
        )}
        {serialNumber && (
          <tr>
            <td>Serial Number :</td>
            <td>{serialNumber}</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}
