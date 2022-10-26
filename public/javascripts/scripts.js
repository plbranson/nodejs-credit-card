/*
 *  Copyright 2022 Patrick L. Branson
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const logo = document.querySelector('[data-logo]')
const expirationSelect = document.querySelector('[data-expiration-year]')

const currentYear = new Date().getFullYear()
for (let index = currentYear; index < currentYear + 10; ++index) {
  const option = document.createElement('option')
  option.value = index
  option.innerText = index
  expirationSelect.append(option)
}

document.addEventListener('keydown', (event) => {
  const input = event.target
  const key = event.key
  if (!isConnectedInput(input)) return

  switch (key) {
    case 'ArrowLeft': {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const previous = input.previousElementSibling
        previous.focus()
        previous.selectionStart = previous.value.length - 1
        previous.selectionEnd = previous.value.length - 1
        event.preventDefault()
      }
      break
    }
    case 'ArrowRight': {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.focus()
        next.selectionStart = 1
        next.selectionEnd = 1
        event.preventDefault()
      }
      break
    }
    case 'Delete': {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.value = next.value.substring(1, next.value.length)
        next.focus()
        next.selectionStart = 0
        next.selectionEnd = 0
        event.preventDefault()
      }
      break
    }
    case 'Backspace': {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const previous = input.previousElementSibling
        previous.value = previous.value.substring(0, previous.value.length - 1)
        previous.focus()
        previous.selectionStart = previous.value.length
        previous.selectionEnd = previous.value.length
        event.preventDefault()
      }
      break
    }
    default: {
      if (event.ctrlKey || event.altKey) {
        return
      }

      if (key.length > 1) {
        return
      }

      if (key.match(/^[^0-9]$/)) {
        return event.preventDefault()
      }

      event.preventDefault()
      onInputChange(input, key)
    }
  }
})

document.addEventListener('paste', (event) => {
  const input = event.target
  const data = event.clipboardData.getData('text')

  if (!isConnectedInput(input)) return
  if (!data.match(/^[0-9]+$/)) return event.preventDefault()

  event.preventDefault()
  onInputChange(input, data)
})

function onInputChange(input, newValue) {
  const start = input.selectionStart
  const end = input.selectionEnd
  updateInputValue(input, newValue, start, end)
  focusInput(input, newValue.length + start)
  const firstFour = input
    .closest('[data-connected-inputs]')
    .querySelector('input').value

  if (firstFour.startsWith('4')) {
    logo.src = '../images/visa.svg'
  } else if (firstFour.startsWith('5')) {
    logo.src = '../images/mastercard.svg'
  }
}

function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start
  )}${extraValue}${input.value.substring(end, 4)}`
  input.value = newValue.substring(0, 4)
  if (newValue > 4) {
    const next = input.nextElementSibling
    if (next == null) return
    updateInputValue(next, newValue.substring(4))
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength
  let currentInput = input
  while (addedChars > 4 && currentInput.nextElementSibling != null) {
    addedChars -= 4
    currentInput = currentInput.nextElementSibling
  }
  if (addedChars > 4) addedChars = 4

  currentInput.focus()
  currentInput.selectionStart = addedChars
  currentInput.selectionEnd = addedChars
}

function isConnectedInput(input) {
  const parent = input.closest('[data-connected-inputs]')
  return input.matches('input') && parent != null
}
