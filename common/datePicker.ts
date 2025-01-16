import { Page } from 'playwright'

/**
 * Class representing a utility for interacting with date pickers in a Playwright test.
 */
export class DatePicker {
  private datePickerInputLocator = this.page.locator('#datepicker')
  private datePickerUiLocator = this.page.locator('#ui-datepicker-div')
  private selectedDayLocator = this.page.locator('#ui-datepicker-div .ui-state-active')
  private nextMonthButtonLocator = this.page.locator('#ui-datepicker-div a[title="Next"]')
  private previousMonthButtonLocator = this.page.locator('#ui-datepicker-div a[title="Prev"]')
  private monthLocator = this.page.locator('#ui-datepicker-div .ui-datepicker-month')
  private yearLocator = this.page.locator('#ui-datepicker-div .ui-datepicker-year')

  /**
   * Initializes the `DatePicker` class with the provided Playwright page instance.
   * @param {Page} page - The Playwright page instance.
   */
  constructor(private page: Page) {
  }

  /**
   * Opens the date picker on the page.
   * @returns {Promise<void>}
   */
  async openDatePicker(): Promise<void> {
    await this.datePickerInputLocator.click()
  }

  /**
   * Clicks the button to navigate to the next month in the date picker.
   * @returns {Promise<void>}
   */
  async clickNextMonth(): Promise<void> {
    await this.nextMonthButtonLocator.click()
  }

  /**
   * Clicks the button to navigate to the previous month in the date picker.
   * @returns {Promise<void>}
   */
  async clickPreviousMonth(): Promise<void> {
    await this.previousMonthButtonLocator.click()
  }

  /**
   * Validates that the currently displayed month and year in the date picker match the expected values.
   * @param {string} expectedMonth - The expected month (e.g., "January").
   * @param {string} expectedYear - The expected year (e.g., "2025").
   * @throws Will throw an error if the displayed month or year does not match the expected values.
   * @returns {Promise<void>}
   */
  async validateMonthAndYear(expectedMonth: string, expectedYear: string): Promise<void> {
    const month = await this.monthLocator.textContent()
    const year = await this.yearLocator.textContent()
    if (month !== expectedMonth || year !== expectedYear) {
      throw new Error(`Expected month/year to be ${expectedMonth}/${expectedYear}, but got ${month}/${year}`)
    }
  }

  /**
   * Selects a specific day in the currently displayed month in the date picker.
   * @param {string} day - The day to select (e.g., "20").
   * @returns {Promise<void>}
   */
  async selectDay(day: string): Promise<void> {
    await this.datePickerUiLocator.locator(`a[data-date="${day}"]`).click()
  }

  /**
   * Validates that the selected day in the date picker matches the expected value.
   * @param {string} expectedDay - The expected day (e.g., "20").
   * @throws Will throw an error if the selected day does not match the expected value.
   * @returns {Promise<void>}
   */
  async validateSelectedDay(expectedDay: string): Promise<void> {
    const selectedDay = await this.selectedDayLocator.textContent()
    if (selectedDay !== expectedDay) {
      throw new Error(`Expected day to be ${expectedDay}, but got ${selectedDay}`)
    }
  }

  /**
   * Navigates to a specific month and year in the date picker.
   * @param {string} targetMonth - The target month (e.g., "February").
   * @param {string} targetYear - The target year (e.g., "2025").
   * @returns {Promise<void>}
   */
  async goToMonthAndYear(targetMonth: string, targetYear: string): Promise<void> {
    let currentMonth = await this.monthLocator.textContent()
    let currentYear = await this.yearLocator.textContent()

    while (currentMonth !== targetMonth || currentYear !== targetYear) {
      if (parseInt(targetYear) > parseInt(currentYear) || (parseInt(targetYear) === parseInt(currentYear) && this.getMonthIndex(targetMonth) > this.getMonthIndex(currentMonth!))) {
        await this.clickNextMonth()
      } else {
        await this.clickPreviousMonth()
      }

      currentMonth = await this.monthLocator.textContent()
      currentYear = await this.yearLocator.textContent()
    }
  }

  /**
   * Gets the index of a given month from its name.
   * @param {string} month - The name of the month (e.g., "January").
   * @returns {number} - The index of the month (0-based, where January is 0).
   * @private
   */
  private getMonthIndex(month: string): number {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months.indexOf(month)
  }
}