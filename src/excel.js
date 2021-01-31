import xl from 'excel4node'
import { getIssues } from './jira'

export const excel = async ({
  targetFile
}) => {

  const response = await getIssues(['JRA-9'])
  console.log(response)

  const wb = new xl.Workbook()

  const ws = wb.addWorksheet('Jira', {
    sheetView: {
      showGridLines: false
    }
  })

  ws.cell(1, 1, 1, 4, true)
    .string(
      `This is a test.`
    )
    .style({
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: '#ffffff',
        fgColor: '#595959'
      },
      font: {
        color: '#ffffff',
        size: 24
      },
      alignment: {
        horizontal: 'center'
      }
    })

  wb.write(`${targetFile}.xlsx`)
}
