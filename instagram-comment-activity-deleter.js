;(async function () {
  // Constants
  /** @const {number} - The number of comments to delete in each batch. */
  const DELETION_BATCH_SIZE = 3
  /** @const {number} - The delay between actions in milliseconds. */
  const DELAY_BETWEEN_ACTIONS_MS = 1000
  /** @const {number} - The delay between clicking the checkboxes in milliseconds. */
  const DELAY_BETWEEN_CHECKBOX_CLICKS_MS = 300
  /** @const {number} - The maximum number of retries for waiting operations */
  const MAX_RETRIES = 60

  /**
   * Utility function that delays execution for a given amount of time.
   * @param {number} ms - The milliseconds to delay.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   */
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  /**
   * Utility function that waits for an element to appear in the DOM before resolving.
   * @param {string} selector - The CSS selector of the element to wait for.
   * @param {number} [timeout=30000] - The maximum time to wait in milliseconds.
   * @returns {Promise<Element>} A promise that resolves with the found element.
   * @throws {Error} If the element is not found within the timeout period.
   */
  const waitForElement = async (selector, timeout = 30000) => {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector)
      if (element) return element
      await delay(100)
    }
    throw new Error(`Element with selector "${selector}" not found within ${timeout}ms`)
  }

  /**
   * Utility function that clicks on a given element.
   * @param {Element} element - The element to click.
   * @throws {Error} If the element is not found.
   */
  const clickElement = async (element) => {
    if (!element) throw new Error('Element not found')
    element.click()
  }

  /**
   * Waits for the "Select" button to reappear after the page loads more comments
   * following the deletion of a batch of comments when the "Select" button
   * is hidden while a spinner indicates that more comments are loading.
   * @returns {Promise<void>} A promise that resolves when the select button reappears.
   * @throws {Error} If the select button is not found after maximum retries.
   */
  const waitForSelectButton = async () => {
    for (let i = 0; i < MAX_RETRIES; i++) {
      const buttonCount = document.querySelectorAll('[role="button"]')?.length
      if (buttonCount > 1) return
      await delay(1000)
    }
    throw new Error('Select button not found after maximum retries')
  }

  /**
   * Deletes the currently selected comments.
   * @returns {Promise<void>} A promise that resolves when the comments are deleted.
   */
  const deleteSelectedComments = async () => {
    try {
      const deleteButton = await waitForElement('[aria-label="Delete"]')
      await clickElement(deleteButton)
      await delay(DELAY_BETWEEN_ACTIONS_MS)
      const confirmButton = await waitForElement('button[tabindex="0"]')
      await clickElement(confirmButton)
    } catch (error) {
      console.error('Error during comment deletion:', error.message)
    }
  }

  /**
   * Deletes all user comments by selecting comments in batches.
   * @returns {Promise<void>} A promise that resolves when all comments are deleted.
   */
  const deleteActivity = async () => {
    try {
      while (true) {
        const [, selectButton] = document.querySelectorAll('[role="button"]')
        if (!selectButton) throw new Error('Select button not found')

        await clickElement(selectButton)
        await delay(DELAY_BETWEEN_ACTIONS_MS)

        const checkboxes = document.querySelectorAll('[aria-label="Toggle checkbox"]')
        if (checkboxes.length === 0) {
          console.log('No more comments to delete')
          break
        }

        for (let i = 0; i < Math.min(DELETION_BATCH_SIZE, checkboxes.length); i++) {
          await clickElement(checkboxes[i])
          await delay(DELAY_BETWEEN_CHECKBOX_CLICKS_MS)
        }

        await delay(DELAY_BETWEEN_ACTIONS_MS)
        await deleteSelectedComments()
        await delay(DELAY_BETWEEN_ACTIONS_MS)
        await waitForSelectButton()
        await delay(DELAY_BETWEEN_ACTIONS_MS)
      }
    } catch (error) {
      console.error('Error in deleteActivity:', error.message)
    }
  }

  // Start the deletion process
  try {
    await deleteActivity()
    console.log('Activity deletion completed')
  } catch (error) {
    console.error('Fatal error:', error.message)
  }
})()
Course Hero logo
Search and extract from study contents
Search a term, phrase, question - directly from the page

Simply select text, right click, and find “Ask Course Hero to search from study resources” from the dropdown menu.


Additionally, use the search bar or or ask a tutor button to find what you need, fast.

Make the most of your study experience


Login or sign up
Course Hero logo
Study Assistant
BETA

Course Hero on the go
Find solutions to your questions, study course content, get help from expert tutors or our AI Study Assistant and more!

Ready to get started? Please


Login or sign up

Learn more about Course Hero
