import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/homepage'

test.describe('Homepage Tests', () => {
  test('Fill in registration form and validate', async ({page}) => {
    const homePage = new HomePage(page)

    await homePage.navigateTo()

    const formData = {
      name: 'Ana Test',
      email: 'anatest@test.com',
      phone: '123456789',
      address: 'TestxxxxTest',
    }

    // Fill and validate form
    await homePage.fillRegistrationForm(formData)
    await homePage.validateRegistrationForm(formData)
  })

  test('Select future date on date picker and validate', async ({page}) => {
    const homePage = new HomePage(page)

    await homePage.navigateTo()

    // Interact with date picker
    await homePage.openDatePicker()
    await homePage.goToMonthAndYear('February', '2026')
    await homePage.selectDate('20')

    // wait a bit to re-open the date picker, otherwise it will click
    // while the date picker is still animating and the click will not work
    await page.waitForTimeout(2000)
    await homePage.openDatePicker()
    await homePage.validateSelectedDate('20')
  })

  test('should perform all list-related operations', async ({page}) => {
    const homePage = new HomePage(page)

    // Navigate to the test page
    await homePage.navigateTo()

    // Test: Choose gender by position (1 = Male, 2 = Female)
    await homePage.chooseGenderByPosition(2)

    // Test: Select days of the week
    await homePage.selectDayByContent('Monday')
    await homePage.selectDayByContent('Tuesday')

    // Validate day is selected
    await homePage.validateDaySelectedByContent('Monday')
    await homePage.validateDaySelectedByContent('Tuesday')

    // Uncheck selected days
    await homePage.uncheckDayByContent('Monday')
    await homePage.uncheckDayByContent('Tuesday')

    // Check multiple days by positions (1 = Sunday, 2 = Monday, 5 = Thursday)
    await homePage.checkDaysByPositions([1, 2, 5])

    // Uncheck multiple days by positions
    await homePage.uncheckDaysByPositions([2, 5])

    // Test: Select country by position (1=United States, 7=Japan)
    await homePage.selectCountryByPosition(7)

    // Test: Select colors (Blue, Yellow)
    await homePage.checkColorByContent('Blue')
    await homePage.checkColorByContent('Yellow')
    await homePage.validateColorSelectedByContent('Blue')
    await homePage.validateColorSelectedByContent('Yellow')
    await homePage.validateColorNotSelectedByContent('Red')

    // Test: Select animals (Dog, Cat)
    await homePage.selectAnimalByContent('Dog')
    await homePage.selectAnimalByContent('Cat')
    await homePage.validateAnimalSelectedByContent('Dog')
    await homePage.validateAnimalSelectedByContent('Cat')
    await homePage.validateAnimalNotSelectedByContent('Cheetah')
    await homePage.validateAnimalNotSelectedByContent('Deer')
    await homePage.validateAnimalNotSelectedByContent('Zebra')
  })

  test('should validate elements in static table', async ({page}) => {
    const homePage = new HomePage(page)

    // Navigate to the test page
    await homePage.navigateTo()

    // Validate static table elements
    await homePage.scrollToStaticTable()
    await homePage.validateStaticTableCellContentByRowAndColumn('Learn JS', 'Price', '300')
    await homePage.validateStaticTableElementVisibleByRowAndColumnPosition(1, 2)
    await homePage.validateStaticTableVisibilityByRowPositionAndColumnName(2, 'Author')
    await homePage.validateStaticTableVisibilityByRowContentAndColumnName('Learn Java', 'Author')
    await homePage.validateStaticTableVisibilityByRowContentAndColumnPosition('Learn Java', 1)
    await homePage.validateStaticTableCellContentByRowAndColumnPosition(5, 1, 'Master In Selenium')
    await homePage.validateStaticTableCellContentByRowPositionAndColumnName(5, 'BookName', 'Master In Selenium')
    await homePage.validateStaticTableCellContentByRowAndColumn('Master In Selenium', 'BookName', 'Master In Selenium')
    await homePage.validateStaticTableCellContentByRowContentAndColumnPosition('Master In Selenium', 1, 'Master In Selenium')
  })

  test('should validate elements in dynamic table', async ({page}) => {
    const homePage = new HomePage(page)

    // Navigate to the test page
    await homePage.navigateTo()

    // Validate dynamic table elements
    await homePage.scrollToDynamicTable()
    await homePage.validateDynamicTableCellContentByRowPositionAndColumnName(3, 'Disk (MB/s)', /\d+\.\d+\sMB\/s/)
    await homePage.validateDynamicTableVisibilityByRowContentAndColumnPosition('Chrome', 3)
    await homePage.validateDynamicTableVisibilityByPosition(3, 3)
    await homePage.validateDynamicTableVisibilityByRowPositionAndColumnName(2, 'Disk (MB/s)')
    await homePage.validateDynamicTableVisibilityByRowContentAndColumnName('Firefox', 'Disk (MB/s)')
    await homePage.validateDynamicTableVisibilityByRowContentAndColumnPosition('Internet Explorer', 2)
    await homePage.validateDynamicTableVisibilityByPosition(2, 2)
  })
})
