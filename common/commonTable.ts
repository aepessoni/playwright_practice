import { Page, Locator } from '@playwright/test'

/**
 * Class representing a utility for interacting with tables in a Playwright test.
 */
export class Tables {
  private page: Page

  /**
   * Initializes the `Tables` class with the provided Playwright page instance.
   * @param {Page} page - The Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Retrieves the headers of a table.
   * @param {Locator} tableLocator - The locator for the table.
   * @returns {Promise<string[]>} - A promise that resolves to an array of header names.
   */
  async getHeaders(tableLocator: Locator): Promise<string[]> {
    const headerCells = tableLocator.locator('tr').first().locator('th')
    return await headerCells.allTextContents()
  }

  /**
   * Checks if the table has headers.
   * @param {Locator} tableLocator - The locator for the table.
   * @returns {Promise<boolean>} - A promise that resolves to true if the table has headers, false otherwise.
   */
  async hasHeaders(tableLocator: Locator): Promise<boolean> {
    const headerCells = tableLocator.locator('tr').first().locator('th')
    return await headerCells.count() > 0
  }

  /**
   * Finds the column position by the header name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} headerName - The name of the header to locate.
   * @returns {Promise<number>} - A promise that resolves to the 1-based column position.
   * @throws Will throw an error if the header is not found.
   */
  async findColumnPosition(tableLocator: Locator, headerName: string): Promise<number> {
    const headers = await this.getHeaders(tableLocator)
    const index = headers.findIndex((header) => header.trim() === headerName)
    if (index === -1) {
      throw new Error(`Column with header name "${headerName}" not found.`)
    }
    return index + 1 // Convert to 1-based index
  }

  /**
   * Finds the row position by the content in the row.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} content - The content to search for in the rows.
   * @returns {Promise<number>} - A promise that resolves to the 1-based row position.
   * @throws Will throw an error if the content is not found.
   */
  async findRowPosition(tableLocator: Locator, content: string): Promise<number> {
    const rows = tableLocator.locator('tr')
    const rowCount = await rows.count()

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i)
      if ((await row.textContent())?.includes(content)) {
        return i + 1 // Convert to 1-based index
      }
    }
    throw new Error(`Row containing "${content}" not found.`)
  }

  /**
   * Gets a cell in the table by its row and column positions.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {number} rowPosition - The 1-based position of the row.
   * @param {number} columnPosition - The 1-based position of the column.
   * @returns {Promise<Locator>} - A promise that resolves to the cell locator.
   * @throws Will throw an error if the cell is not visible.
   */
  async getCellByPosition(tableLocator: Locator, rowPosition: number, columnPosition: number): Promise<Locator> {
    console.log(`Getting cell by position row=${rowPosition}, column=${columnPosition}`)
    const tableHeader = tableLocator.locator(`tr:nth-child(${rowPosition}) > th:nth-child(${columnPosition})`)
    const tableWithoutHeader = tableLocator.locator(`tr:nth-child(${rowPosition}) > td:nth-child(${columnPosition})`)

    const cell = tableHeader.or(tableWithoutHeader).first()
    if (!(await cell.isVisible())) {
      throw new Error(`Cell at row ${rowPosition} and column ${columnPosition} is not visible.`)
    }
    return cell
  }

  /**
   * Gets a cell in the table by its row content and column name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} rowContent - The content of the row to search for.
   * @param {string} columnName - The name of the column.
   * @returns {Promise<Locator>} - A promise that resolves to the cell locator.
   */
  async getCellByContentAndColumnName(tableLocator: Locator, rowContent: string, columnName: string): Promise<Locator> {
    const rowPosition = await this.findRowPosition(tableLocator, rowContent)
    const columnPosition = await this.findColumnPosition(tableLocator, columnName)
    return await this.getCellByPosition(tableLocator, rowPosition, columnPosition)
  }

  /**
   * Validates the content of a cell by its row and column positions.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {number} rowPosition - The 1-based position of the row.
   * @param {number} columnPosition - The 1-based position of the column.
   * @param {string|RegExp} expectedContent - The expected content or regular expression to match.
   * @throws Will throw an error if the content does not match.
   * @returns {Promise<void>}
   */
  async validateCellContentByPosition(
    tableLocator: Locator,
    rowPosition: number,
    columnPosition: number,
    expectedContent: string | RegExp,
  ): Promise<void> {
    const cell = await this.getCellByPosition(tableLocator, rowPosition, columnPosition)
    const actualContent = (await cell.textContent())?.trim()

    if (typeof expectedContent === 'string') {
      if (actualContent !== expectedContent) {
        throw new Error(
          `Content mismatch. Expected: "${expectedContent}", Found: "${actualContent}".`,
        )
      }
    } else {
      if (!expectedContent.test(actualContent)) {
        throw new Error(
          `Content mismatch. Expected: "${expectedContent}", Found: "${actualContent}".`,
        )
      }
    }
  }

  /**
   * Validates the content of a cell by its row content and column name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} rowContent - The content of the row to search for.
   * @param {string} columnName - The name of the column.
   * @param {string} expectedContent - The expected content.
   * @throws Will throw an error if the content does not match.
   * @returns {Promise<void>}
   */
  async validateCellContentByContentAndColumnName(
    tableLocator: Locator,
    rowContent: string,
    columnName: string,
    expectedContent: string,
  ): Promise<void> {
    const cell = await this.getCellByContentAndColumnName(tableLocator, rowContent, columnName)
    const actualContent = (await cell.textContent())?.trim()
    if (actualContent !== expectedContent) {
      throw new Error(
        `Content mismatch. Expected: "${expectedContent}", Found: "${actualContent}".`,
      )
    }
  }

  /**
   * Validates the content of a cell by its row position and column name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {number} rowPosition - The 1-based position of the row.
   * @param {string} columnName - The name of the column.
   * @param {string|RegExp} expectedContent - The expected content or regular expression to match.
   * @throws Will throw an error if the content does not match.
   * @returns {Promise<void>}
   */
  async validateCellContentByRowPositionAndColumnName(
    tableLocator: Locator,
    rowPosition: number,
    columnName: string,
    expectedContent: string | RegExp,
  ): Promise<void> {
    const columnPosition = await this.findColumnPosition(tableLocator, columnName)
    await this.validateCellContentByPosition(tableLocator, rowPosition, columnPosition, expectedContent)
  }

  /**
   * Validates the visibility of a cell element by its row and column positions.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {number} rowPosition - The 1-based position of the row.
   * @param {number} columnPosition - The 1-based position of the column.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateElementVisibilityByPosition(
    tableLocator: Locator,
    rowPosition: number,
    columnPosition: number,
  ): Promise<void> {
    const cell = await this.getCellByPosition(tableLocator, rowPosition, columnPosition)
    if (!(await cell.isVisible())) {
      throw new Error(`Element at row ${rowPosition} and column ${columnPosition} is not visible.`)
    }
  }

  /**
   * Validates the visibility of a cell element by its row position and column name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {number} rowPosition - The 1-based position of the row.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateElementVisibilityByColumnName(
    tableLocator: Locator,
    rowPosition: number,
    columnName: string,
  ): Promise<void> {
    const columnPosition = await this.findColumnPosition(tableLocator, columnName)
    await this.validateElementVisibilityByPosition(tableLocator, rowPosition, columnPosition)
  }

  /**
   * Validates the visibility of a cell element by its row content and column name.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} rowContent - The content of the row to search for.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateElementVisibilityByRowContentAndColumnName(
    tableLocator: Locator,
    rowContent: string,
    columnName: string,
  ): Promise<void> {
    const rowPosition = await this.findRowPosition(tableLocator, rowContent)

    let actualRowPosition = rowPosition
    if (rowPosition > 1 && await this.hasHeaders(tableLocator)) {
      actualRowPosition = rowPosition - 1
    }

    await this.validateElementVisibilityByColumnName(tableLocator, actualRowPosition, columnName)
  }

  /**
   * Validates the visibility of a cell element by its row content and column position.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} rowContent - The content of the row to search for.
   * @param {number} columnPosition - The 1-based position of the column.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateElementVisibilityByRowContentAndColumnPosition(
    tableLocator: Locator,
    rowContent: string,
    columnPosition: number,
  ): Promise<void> {
    const rowPosition = await this.findRowPosition(tableLocator, rowContent)
    let actualRowPosition = rowPosition
    if (rowPosition > 1 && await this.hasHeaders(tableLocator)) {
      actualRowPosition = rowPosition - 1
    }
    await this.validateElementVisibilityByPosition(tableLocator, actualRowPosition, columnPosition)
  }

  /**
   * Validates the content of a cell by its row content and column position.
   * @param {Locator} tableLocator - The locator for the table.
   * @param {string} rowContent - The content of the row to search for.
   * @param {number} columnPosition - The 1-based position of the column.
   * @param {string} expectedContent - The expected content.
   * @throws Will throw an error if the content does not match.
   * @returns {Promise<void>}
   */
  async validateCellContentByContentAndColumnPosition(
    tableLocator: Locator,
    rowContent: string,
    columnPosition: number,
    expectedContent: string,
  ): Promise<void> {
    const rowPosition = await this.findRowPosition(tableLocator, rowContent)
    await this.validateCellContentByPosition(tableLocator, rowPosition, columnPosition, expectedContent)
  }
}
