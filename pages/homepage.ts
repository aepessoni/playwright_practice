import { Locator } from '@playwright/test'
import { Page } from 'playwright'
import { Lists } from '../common/commonList'
import { Tables } from '../common/commonTable'
import { DatePicker } from '../common/datePicker'
import { Elements } from '../common/elements'

/**
 * Class representing the homepage and its operations in a Playwright test.
 */
// page_url: https://testautomationpractice.blogspot.com/
export class HomePage {

  private commonElements: Elements
  private datePicker: DatePicker
  private lists: Lists
  private tables: Tables

  // locators
  private nameInput : Locator
  private emailInput: Locator
  private phoneInput : Locator
  private addressInput : Locator
  private genderList: Locator
  private daysList: Locator
  private countryDropdown: Locator
  private colorsList: Locator
  private animalsList: Locator
  private staticTable: Locator
  private dynamicTable: Locator

  /**
   * Initializes the `HomePage` class with the provided Playwright page instance.
   * @param {Page} page - The Playwright page instance.
   */
  constructor(private page: Page) {
    this.commonElements = new Elements(page)
    this.datePicker = new DatePicker(page)
    this.lists = new Lists(page)
    this.tables = new Tables(page)

    // Initialize locators
    this.nameInput = this.page.locator('#name')
    this.emailInput = this.page.locator('#email')
    this.phoneInput = this.page.locator('#phone')
    this.addressInput = this.page.locator('#textarea')
    this.genderList = this.page.locator('//input[@type=\'radio\' and @name=\'gender\']')
    this.daysList = this.page.locator('//div[contains(@class, \'form-group\')][4]//div[contains(@class, \'form-check\')]')
    this.countryDropdown = this.page.locator('//*[@id=\'country\']')
    this.colorsList = this.page.locator('//*[@id=\'colors\']')
    this.animalsList = this.page.locator('//*[@id=\'animals\']')
    this.staticTable = this.page.locator('//table[@name=\'BookTable\']')
    this.dynamicTable = this.page.locator('//table[@id=\'taskTable\']')
  }

  /**
   * Navigates to the homepage URL.
   * @returns {Promise<void>}
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('https://testautomationpractice.blogspot.com/')
  }

  /**
   * Fills out the registration form with the provided data.
   * @param {Object} formData - The data to fill into the form.
   * @param {string} formData.name - The name to enter.
   * @param {string} formData.email - The email to enter.
   * @param {string} formData.phone - The phone number to enter.
   * @param {string} formData.address - The address to enter.
   * @returns {Promise<void>}
   */
  async fillRegistrationForm({name, email, phone, address}: {
    name: string;
    email: string;
    phone: string;
    address: string
  }): Promise<void> {
    await this.commonElements.type(this.nameInput, name)
    await this.commonElements.type(this.emailInput, email)
    await this.commonElements.type(this.phoneInput, phone)
    await this.commonElements.type(this.addressInput, address)
  }

  /**
   * Validates that the registration form contains the expected data.
   * @param {Object} formData - The expected data in the form.
   * @param {string} formData.name - The expected name.
   * @param {string} formData.email - The expected email.
   * @param {string} formData.phone - The expected phone number.
   * @param {string} formData.address - The expected address.
   * @throws Will throw an error if any field does not match the expected data.
   * @returns {Promise<void>}
   */
  async validateRegistrationForm({name, email, phone, address}: {
    name: string;
    email: string;
    phone: string;
    address: string
  }): Promise<void> {
    await this.commonElements.validateInputText(this.nameInput, name)
    await this.commonElements.validateInputText(this.emailInput, email)
    await this.commonElements.validateInputText(this.phoneInput, phone)
    await this.commonElements.validateInputText(this.addressInput, address)
  }

  // region date picker

  /**
   * Opens the date picker widget.
   * @returns {Promise<void>}
   */
  async openDatePicker(): Promise<void> {
    await this.datePicker.openDatePicker()
  }

  /**
   * Selects a specific date in the date picker.
   * @param {string} day - The day to select (e.g., "20").
   * @returns {Promise<void>}
   */
  async selectDate(day: string): Promise<void> {
    await this.datePicker.selectDay(day)
  }

  /**
   * Validates that the selected date matches the expected value.
   * @param {string} day - The expected day (e.g., "20").
   * @throws Will throw an error if the selected date does not match.
   * @returns {Promise<void>}
   */
  async validateSelectedDate(day: string): Promise<void> {
    await this.datePicker.validateSelectedDay(day)
  }

  /**
   * Navigates to a specific month and year in the date picker.
   * @param {string} targetMonth - The target month (e.g., "February").
   * @param {string} targetYear - The target year (e.g., "2025").
   * @returns {Promise<void>}
   */
  async goToMonthAndYear(targetMonth: string, targetYear: string): Promise<void> {
    await this.datePicker.goToMonthAndYear(targetMonth, targetYear)
  }

  // endregion

  // region lists
  /**
   * Selects a gender option based on position.
   * @param {number} position - The position of the gender option (1-based index).
   * @returns {Promise<void>}
   */
  async chooseGenderByPosition(position: number): Promise<void> {
    await this.lists.clickByPosition(this.genderList, position)
  }

  /**
   * Selects a day of the week by its content.
   * @param {string} day - The day to select (e.g., "Monday").
   * @returns {Promise<void>}
   */
  async selectDayByContent(day: string): Promise<void> {
    await this.lists.clickByContent(this.daysList, day)
  }

  /**
   * Selects a country from the dropdown by its position.
   * @param {number} position - The position of the country in the dropdown (1-based index).
   * @returns {Promise<void>}
   */
  async selectCountryByPosition(position: number): Promise<void> {
    await this.lists.selectOptionByIndex(this.countryDropdown, position)
  }

  /**
   * Validates that a specific day is selected.
   * @param {string} day - The day to validate (e.g., "Monday").
   * @throws Will throw an error if the day is not selected.
   * @returns {Promise<void>}
   */
  async validateDaySelectedByContent(day: string): Promise<void> {
    await this.lists.validateVisibilityByContent(this.daysList, day)
  }

  /**
   * Checks a checkbox for a specific day by its content.
   * @param {string} day - The day to check (e.g., "Monday").
   * @returns {Promise<void>}
   */
  async checkDayByContent(day: string): Promise<void> {
    await this.lists.checkByContent(this.daysList, day)
  }

  /**
   * Unchecks a checkbox for a specific day by its content.
   * @param {string} day - The day to uncheck (e.g., "Monday").
   * @returns {Promise<void>}
   */
  async uncheckDayByContent(day: string): Promise<void> {
    await this.lists.uncheckByContent(this.daysList, day)
  }

  /**
   * Checks multiple days by their positions in the list.
   * @param {number[]} positions - An array of positions (1-based index) of the days to check.
   * @returns {Promise<void>}
   */
  async checkDaysByPositions(positions: number[]): Promise<void> {
    for (const position of positions) {
      await this.lists.checkByPosition(this.daysList, position)
    }
  }

  /**
   * Unchecks multiple days by their positions in the list.
   * @param {number[]} positions - An array of positions (1-based index) of the days to uncheck.
   * @returns {Promise<void>}
   */
  async uncheckDaysByPositions(positions: number[]): Promise<void> {
    for (const position of positions) {
      await this.lists.uncheckByPosition(this.daysList, position)
    }
  }

  /**
   * Selects a color by its visible text in the dropdown.
   * @param {string} color - The color to select (e.g., "Blue").
   * @returns {Promise<void>}
   */
  async checkColorByContent(color: string): Promise<void> {
    await this.lists.selectOptionByContent(this.colorsList, color)
  }

  /**
   * Validates that a specific color is selected in the dropdown.
   * @param {string} color - The color to validate (e.g., "Blue").
   * @throws Will throw an error if the color is not selected.
   * @returns {Promise<void>}
   */
  async validateColorSelectedByContent(color: string): Promise<void> {
    await this.lists.validateVisibilityByContent(this.colorsList, color)
  }

  /**
   * Validates that a specific color is not selected in the dropdown.
   * @param {string} color - The color to validate (e.g., "Red").
   * @throws Will throw an error if the color is selected.
   * @returns {Promise<void>}
   */
  async validateColorNotSelectedByContent(color: string): Promise<void> {
    await this.lists.validateVisibilityByContent(this.colorsList, color)
  }

  /**
   * Selects an animal by its visible text in the dropdown.
   * @param {string} animal - The animal to select (e.g., "Dog").
   * @returns {Promise<void>}
   */
  async selectAnimalByContent(animal: string): Promise<void> {
    await this.lists.clickByContent(this.animalsList, animal)
  }

  /**
   * Validates that a specific animal is selected in the dropdown.
   * @param {string} animal - The animal to validate (e.g., "Dog").
   * @throws Will throw an error if the animal is not selected.
   * @returns {Promise<void>}
   */
  async validateAnimalSelectedByContent(animal: string): Promise<void> {
    await this.lists.validateVisibilityByContent(this.animalsList, animal)
  }

  /**
   * Validates that a specific animal is not selected in the dropdown.
   * @param {string} animal - The animal to validate (e.g., "Cheetah").
   * @throws Will throw an error if the animal is selected.
   * @returns {Promise<void>}
   */
  async validateAnimalNotSelectedByContent(animal: string): Promise<void> {
    await this.lists.validateVisibilityByContent(this.animalsList, animal)
  }

  // endregion

  // region static table

  /**
   * Validates the content of a cell in the static table by its row and column positions.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @param {string} expectedContent - The expected content of the cell.
   * @throws Will throw an error if the cell content does not match the expected content.
   * @returns {Promise<void>}
   */
  async validateStaticTableCellContentByRowAndColumnPosition(
    rowPosition: number,
    columnPosition: number,
    expectedContent: string,
  ): Promise<void> {
    await this.tables.validateCellContentByPosition(
      this.staticTable,
      rowPosition,
      columnPosition,
      expectedContent,
    )
  }

  /**
   * Validates the visibility of a cell in the static table by its row and column positions.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateStaticTableElementVisibleByRowAndColumnPosition(
    rowPosition: number,
    columnPosition: number,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByPosition(
      this.staticTable,
      rowPosition,
      columnPosition,
    )
  }

  /**
   * Validates the content of a cell in the static table by the row content and column name.
   * @param {string} rowContent - The content of the row to locate.
   * @param {string} columnName - The name of the column.
   * @param {string} expectedContent - The expected content of the cell.
   * @throws Will throw an error if the cell content does not match the expected content.
   * @returns {Promise<void>}
   */
  async validateStaticTableCellContentByRowAndColumn(
    rowContent: string,
    columnName: string,
    expectedContent: string,
  ): Promise<void> {
    await this.tables.validateCellContentByContentAndColumnName(
      this.staticTable,
      rowContent,
      columnName,
      expectedContent,
    )
  }

  /**
   * Validates the content of a cell in the static table by the row position and column name.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {string} columnName - The name of the column.
   * @param {string} expectedContent - The expected content of the cell.
   * @throws Will throw an error if the cell content does not match the expected content.
   * @returns {Promise<void>}
   */
  async validateStaticTableCellContentByRowPositionAndColumnName(
    rowPosition: number,
    columnName: string,
    expectedContent: string,
  ): Promise<void> {
    await this.tables.validateCellContentByRowPositionAndColumnName(
      this.staticTable,
      rowPosition,
      columnName,
      expectedContent,
    )
  }


  async validateStaticTableCellContentByRowContentAndColumnPosition(
    rowContent: string,
    columnPosition: number,
    expectedContent: string,
  ): Promise<void> {
    await this.tables.validateCellContentByContentAndColumnPosition(
      this.staticTable,
      rowContent,
      columnPosition,
      expectedContent,
    )
  }

  /**
   * Validates the visibility of a cell in the static table by the row position and column name.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateStaticTableVisibilityByRowPositionAndColumnName(
    rowPosition: number,
    columnName: string,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByColumnName(
      this.staticTable,
      rowPosition,
      columnName,
    )
  }

  /**
   * Validates the visibility of a cell in the static table by the row content and column position.
   * @param {string} rowContent - The content of the row to locate.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateStaticTableVisibilityByRowContentAndColumnPosition(
    rowContent: string,
    columnPosition: number,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByRowContentAndColumnPosition(
      this.staticTable,
      rowContent,
      columnPosition,
    )
  }

  /**
   * Validates the visibility of a cell in the static table by the row content and column name.
   * @param {string} rowContent - The content of the row to locate.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateStaticTableVisibilityByRowContentAndColumnName(
    rowContent: string,
    columnName: string,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByRowContentAndColumnName(
      this.staticTable,
      rowContent,
      columnName,
    )
  }

  /**
   * Scrolls to the static table on the page to ensure it is visible.
   * @returns {Promise<void>}
   */
  async scrollToStaticTable(): Promise<void> {
    await this.staticTable.scrollIntoViewIfNeeded({
      timeout: 1000,
    })
  }

  // endregion

  // region dynamic table

  /**
   * Scrolls to the dynamic table on the page to ensure it is visible.
   * @returns {Promise<void>}
   */
  async scrollToDynamicTable(): Promise<void> {
    await this.dynamicTable.scrollIntoViewIfNeeded({
      timeout: 1000,
    })
  }

  /**
   * Validates the content of a cell in the dynamic table by its row position and column position.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @param {string} expectedContent - The expected content of the cell.
   * @throws Will throw an error if the cell content does not match the expected content.
   * @returns {Promise<void>}
   */
  async validateDynamicTableCellContent(
    rowPosition: number,
    columnPosition: number,
    expectedContent: string,
  ): Promise<void> {
    await this.tables.validateCellContentByPosition(
      this.dynamicTable,
      rowPosition,
      columnPosition,
      expectedContent,
    )
  }

  /**
   * Validates the content of a cell in the dynamic table by its row position and column name.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {string} columnName - The name of the column.
   * @param {string | RegExp} expectedContent - The expected content of the cell or a regular expression to match.
   * @throws Will throw an error if the cell content does not match the expected content.
   * @returns {Promise<void>}
   */
  async validateDynamicTableCellContentByRowPositionAndColumnName(
    rowPosition: number,
    columnName: string,
    expectedContent: string | RegExp,
  ): Promise<void> {
    await this.tables.validateCellContentByRowPositionAndColumnName(
      this.dynamicTable,
      rowPosition,
      columnName,
      expectedContent,
    )
  }

  /**
   * Validates the visibility of a cell in the dynamic table by its row content and column position.
   * @param {string} rowContent - The content of the row to locate.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateDynamicTableVisibilityByRowContentAndColumnPosition(
    rowContent: string,
    columnPosition: number,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByRowContentAndColumnPosition(
      this.dynamicTable,
      rowContent,
      columnPosition,
    )
  }

  /**
   * Validates the visibility of a cell in the dynamic table by its row position and column position.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {number} columnPosition - The 1-based column position of the cell.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateDynamicTableVisibilityByPosition(
    rowPosition: number,
    columnPosition: number,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByPosition(
      this.dynamicTable,
      rowPosition,
      columnPosition,
    )
  }

  /**
   * Validates the visibility of a cell in the dynamic table by its row position and column name.
   * @param {number} rowPosition - The 1-based row position of the cell.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateDynamicTableVisibilityByRowPositionAndColumnName(
    rowPosition: number,
    columnName: string,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByColumnName(
      this.dynamicTable,
      rowPosition,
      columnName,
    )
  }

  /**
   * Validates the visibility of a cell in the dynamic table by its row content and column name.
   * @param {string} rowContent - The content of the row to locate.
   * @param {string} columnName - The name of the column.
   * @throws Will throw an error if the cell is not visible.
   * @returns {Promise<void>}
   */
  async validateDynamicTableVisibilityByRowContentAndColumnName(
    rowContent: string,
    columnName: string,
  ): Promise<void> {
    await this.tables.validateElementVisibilityByRowContentAndColumnName(
      this.dynamicTable,
      rowContent,
      columnName,
    )
  }

  // endregion
}
