import { Page, Locator } from '@playwright/test'

/**
 * Class representing a utility for interacting with lists in a Playwright test.
 */
export class Lists {
  private page: Page

  /**
   * Initializes the `Lists` class with the provided Playwright page instance.
   * @param {Page} page - The Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Clicks on an element at a specific position in a list.
   * @param {Locator} locator - The locator for the list elements.
   * @param {number} position - The position (1-based index) of the element to click.
   * @throws Will throw an error if the position is invalid.
   * @returns {Promise<void>}
   */
  async clickByPosition(locator: Locator, position: number): Promise<void> {
    const elements = await locator.elementHandles() // Get all elements matching the locator
    if (position <= 0 || position > elements.length) {
      throw new Error(`Invalid position: ${position}`) // Validate position is within bounds
    }
    await elements[position - 1].click() // Click on the element at the specified position
  }

  /**
   * Clicks on an element in a list that contains specific text.
   * @param {Locator} locator - The locator for the list elements.
   * @param {string} content - The text content to search for.
   * @returns {Promise<void>}
   */
  async clickByContent(locator: Locator, content: string): Promise<void> {
    const element = locator.filter({hasText: content}) // Filter elements with matching text
    await element.click() // Click the element
  }

  /**
   * Checks a checkbox at a specific position in a list.
   * @param {Locator} locator - The locator for the list elements.
   * @param {number} position - The position (1-based index) of the checkbox.
   * @throws Will throw an error if the position is invalid or the checkbox is already checked.
   * @returns {Promise<void>}
   */
  async checkByPosition(locator: Locator, position: number): Promise<void> {
    const elements = await locator.getByRole('checkbox').elementHandles() // Get all elements matching the locator and being a checkbox
    if (position <= 0 || position > elements.length) {
      throw new Error(`Invalid position: ${position}`) // Validate position is within bounds
    }
    const element = elements[position - 1]
    if (!(await element.isChecked())) { // Check if the element is not already checked
      await element.check() // Check the element
    }
  }

  /**
   * Checks a checkbox in a list that contains specific text.
   * @param {Locator} locator - The locator for the list elements.
   * @param {string} content - The text content to search for.
   * @throws Will throw an error if the checkbox is already checked.
   * @returns {Promise<void>}
   */
  async checkByContent(locator: Locator, content: string): Promise<void> {
    const element = locator.filter({hasText: content}) // Filter elements with matching text
    if (!(await element.isChecked())) { // Check if the element is not already checked
      await element.check() // Check the element
    }
  }

  /**
   * Unchecks a checkbox at a specific position in a list.
   * @param {Locator} locator - The locator for the list elements.
   * @param {number} position - The position (1-based index) of the checkbox.
   * @throws Will throw an error if the position is invalid or the checkbox is already unchecked.
   * @returns {Promise<void>}
   */
  async uncheckByPosition(locator: Locator, position: number): Promise<void> {
    const elements = await locator
      .getByRole('checkbox')
      .elementHandles() // Get all elements matching the locator
    if (position <= 0 || position > elements.length) {
      throw new Error(`Invalid position: ${position}`) // Validate position is within bounds
    }
    const element = elements[position - 1]
    if (await element.isChecked()) { // Check if the element is currently checked
      await element.uncheck() // Uncheck the element
    }
  }

  /**
   * Unchecks a checkbox in a list that contains specific text.
   * @param {Locator} locator - The locator for the list elements.
   * @param {string} content - The text content to search for.
   * @throws Will throw an error if the checkbox is already unchecked.
   * @returns {Promise<void>}
   */
  async uncheckByContent(locator: Locator, content: string): Promise<void> {
    const element = locator.filter({hasText: content})// Filter elements with matching text
      .getByRole('checkbox')

    if (await element.isChecked()) { // Check if the element is currently checked
      await element.uncheck() // Uncheck the element
    }
  }

  /**
   * Validates the text content of an element at a specific position in a list.
   * @param {Locator} locator - The locator for the list elements.
   * @param {number} position - The position (1-based index) of the element.
   * @param {string} expectedText - The expected text content.
   * @throws Will throw an error if the text content does not match.
   * @returns {Promise<void>}
   */
  async validateTextByPosition(locator: Locator, position: number, expectedText: string): Promise<void> {
    const elements = await locator.elementHandles() // Get all elements matching the locator
    if (position <= 0 || position > elements.length) {
      throw new Error(`Invalid position: ${position}`) // Validate position is within bounds
    }
    const actualText = await elements[position - 1].textContent() // Get text content of the element
    if (actualText?.trim() !== expectedText) { // Compare with expected text
      throw new Error(`Text mismatch. Expected: ${expectedText}, Found: ${actualText}`)
    }
  }

  /**
   * Validates the text content of an element in a list that contains specific text.
   * @param {Locator} locator - The locator for the list elements.
   * @param {string} content - The text content to search for.
   * @param {string} expectedText - The expected text content.
   * @throws Will throw an error if the text content does not match.
   * @returns {Promise<void>}
   */
  async validateTextByContent(locator: Locator, content: string, expectedText: string): Promise<void> {
    const element = locator.filter({hasText: content}) // Filter elements with matching text
    const actualText = await element.textContent() // Get text content of the element
    if (actualText?.trim() !== expectedText) { // Compare with expected text
      throw new Error(`Text mismatch. Expected: ${expectedText}, Found: ${actualText}`)
    }
  }

  /**
   * Validates the visibility of an element at a specific position in a list.
   * @param {Locator} locator - The locator for the list elements.
   * @param {number} position - The position (1-based index) of the element.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateVisibilityByPosition(locator: Locator, position: number): Promise<void> {
    const elements = await locator.elementHandles() // Get all elements matching the locator
    if (position <= 0 || position > elements.length) {
      throw new Error(`Invalid position: ${position}, only ${elements.length} positions available`) // Validate position is within bounds
    }
    if (!(await elements[position - 1].isVisible())) { // Check if the element is visible
      throw new Error(`Element at position ${position} is not visible.`)
    }
  }

  /**
   * Validates the visibility of an element in a list that contains specific text.
   * @param {Locator} locator - The locator for the list elements.
   * @param {string} content - The text content to search for.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateVisibilityByContent(locator: Locator, content: string): Promise<void> {
    const element = locator.filter({hasText: content}) // Filter elements with matching text
    if (!(await element.isVisible())) { // Check if the element is visible
      throw new Error(`Element with content "${content}" is not visible.`)
    }
  }

  /**
   * Selects an option from a dropdown by its index.
   * @param {Locator} locator - The locator for the dropdown element.
   * @param {number} index - The index (0-based) of the option to select.
   * @returns {Promise<void>}
   */
  async selectOptionByIndex(locator: Locator, index: number): Promise<void> {
    await locator.selectOption({index: index})
  }

  /**
   * Selects an option from a dropdown by its visible label.
   * @param {Locator} locator - The locator for the dropdown element.
   * @param {string} content - The visible label of the option to select.
   * @returns {Promise<void>}
   */
  async selectOptionByContent(locator: Locator, content: string): Promise<void> {
    await locator.selectOption({label: content})
  }
}
