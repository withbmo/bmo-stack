"use client"

import * as React from "react"

import { cn } from "@/ui/lib/utils"

type InputOTPContextValue = {
  value: string
  maxLength: number
  setCharAt: (index: number, char: string) => void
  focusSlot: (index: number) => void
  setSlotRef: (index: number, el: HTMLInputElement | null) => void
  id?: string
  disabled?: boolean
}

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null)

function useInputOTPContext() {
  const ctx = React.useContext(InputOTPContext)
  if (!ctx) {
    throw new Error("InputOTP slots must be used inside <InputOTP>")
  }
  return ctx
}

function InputOTP({
  className,
  maxLength,
  value,
  onChange,
  id,
  disabled,
  children,
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  maxLength: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([])

  const normalizedValue = React.useMemo(() => {
    return value.replace(/\D/g, "").slice(0, maxLength)
  }, [maxLength, value])

  React.useEffect(() => {
    if (normalizedValue !== value) {
      onChange(normalizedValue)
    }
  }, [normalizedValue, onChange, value])

  const setSlotRef = React.useCallback((index: number, el: HTMLInputElement | null) => {
    refs.current[index] = el
  }, [])

  const focusSlot = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= maxLength) return
      refs.current[index]?.focus()
      refs.current[index]?.select()
    },
    [maxLength]
  )

  const setCharAt = React.useCallback(
    (index: number, char: string) => {
      const next = normalizedValue.split("")
      next[index] = char
      onChange(next.join("").slice(0, maxLength))
    },
    [maxLength, normalizedValue, onChange]
  )

  const ctx = React.useMemo<InputOTPContextValue>(
    () => ({
      value: normalizedValue,
      maxLength,
      setCharAt,
      focusSlot,
      setSlotRef,
      id,
      disabled,
    }),
    [disabled, focusSlot, id, maxLength, normalizedValue, setCharAt, setSlotRef]
  )

  return (
    <InputOTPContext.Provider value={ctx}>
      <div data-slot="input-otp" className={cn("flex items-center gap-2", className)}>
        {children}
      </div>
    </InputOTPContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  className,
  index,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  index: number
}) {
  const { value, maxLength, setCharAt, focusSlot, setSlotRef, id, disabled } =
    useInputOTPContext()
  const slotValue = value[index] ?? ""

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, "")
    if (!raw) {
      setCharAt(index, "")
      return
    }
    const char = raw[raw.length - 1] ?? ""
    setCharAt(index, char)
    if (index < maxLength - 1) {
      focusSlot(index + 1)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (slotValue) {
        setCharAt(index, "")
      } else if (index > 0) {
        setCharAt(index - 1, "")
        focusSlot(index - 1)
      }
      return
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      focusSlot(index - 1)
      return
    }

    if (event.key === "ArrowRight" && index < maxLength - 1) {
      event.preventDefault()
      focusSlot(index + 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!pasted) return

    for (let i = 0; i < pasted.length && index + i < maxLength; i += 1) {
      const char = pasted[i]
      if (!char) continue
      setCharAt(index + i, char)
    }

    const nextIndex = Math.min(index + pasted.length, maxLength - 1)
    focusSlot(nextIndex)
  }

  return (
    <input
      {...props}
      ref={el => setSlotRef(index, el)}
      id={id && index === 0 ? id : undefined}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={1}
      value={slotValue}
      disabled={disabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={cn(
        "size-10 rounded-md border border-input bg-transparent text-center text-base outline-none transition-colors",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        className
      )}
    />
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot }
