import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react'

const MultiInput = ({ code, onChange }: { code: string, onChange: (code: string) => void }) => {
  const [inputCode, setInputCode] = useState<string[]>(code.split('').concat(Array(6 - code.length).fill('')))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setInputCode(code.split('').concat(Array(6 - code.length).fill('')))
  }, [code])

  const handleChange = (index: number, value: string) => {
    const newCode = [...inputCode]
    newCode[index] = value
    setInputCode(newCode)
    onChange(newCode.join(''))

    // Move to next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !inputCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('')
    const newCode = [...inputCode]
    pastedData.forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char
      }
    })
    setInputCode(newCode)
    onChange(newCode.join(''))
    // Focus last input or first empty input
    const lastFilledIndex = newCode.findIndex(digit => !digit)
    inputRefs.current[lastFilledIndex !== -1 ? lastFilledIndex : 0]?.focus()
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      {inputCode.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          aria-label={`Digit ${index + 1} of 6-digit 2FA code`}
        />
      ))}
    </div>
  )
}

export default MultiInput

