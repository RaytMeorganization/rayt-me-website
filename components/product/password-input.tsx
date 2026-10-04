'use client'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function PasswordInput({
  id,
  value,
  onChange,
  className,
  ...rest
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        className={cn('min-h-11 pe-11', className)}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute inset-y-0 end-1 my-auto size-9 text-muted-foreground"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible(current => !current)}
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Button>
    </div>
  )
}
