import { Locator } from '@playwright/test'
import { Page } from 'playwright'

/**
 * Class representing a utility for interacting with individual elements in a Playwright test.
 */
export class Elements {
  /**
   * Initializes the `Elements` class with the provided Playwright page instance.
   * @param {Page} page - The Playwright page instance.
   */
  constructor(private page: Page) {
  }

  /**
   * Clicks on an element specified by a selector or locator.
   * @param {string | Locator} selector - The CSS selector or Locator for the element.
   * @returns {Promise<void>}
   */
  async click(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.click(selector)
    } else {
      await selector.click()
    }
  }

  /**
   * Types text into an element specified by a selector or locator.
   * @param {string | Locator} selector - The CSS selector or Locator for the element.
   * @param {string} text - The text to type into the element.
   * @returns {Promise<void>}
   */
  async type(selector: string | Locator, text: string): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.fill(selector, text)
    } else {
      await selector.fill(text)
    }
  }

  /**
   * Validates that the input value of an element matches the expected text.
   * @param {string | Locator} selector - The CSS selector or Locator for the element.
   * @param {string} expectedText - The expected text value of the input.
   * @throws Will throw an error if the text does not match.
   * @returns {Promise<void>}
   */
  async validateInputText(selector: string | Locator, expectedText: string): Promise<void> {
    let text: string
    if (typeof selector === 'string') {
      text = await this.page.inputValue(selector)
    } else {
      text = await selector.inputValue()
    }

    if (text !== expectedText) {
      throw new Error(`Expected text to be ${expectedText}, but got ${text}`)
    }
  }

  /**
   * Validates that an element specified by a selector is visible.
   * @param {string} selector - The CSS selector for the element.
   * @throws Will throw an error if the element is not visible.
   * @returns {Promise<void>}
   */
  async validateVisibility(selector: string): Promise<void> {
    const isVisible = await this.page.isVisible(selector)
    if (!isVisible) {
      throw new Error(`Expected element ${selector} to be visible, but it is not.`)
    }
  }
}