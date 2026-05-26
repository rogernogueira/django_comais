import * as React from 'react'
import { Paperclip, Upload } from 'lucide-react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const [fileName, setFileName] = React.useState('Nenhum arquivo selecionado')

  if (type === 'file') {
    const { disabled, multiple, accept, onChange, id: idProp, ...rest } = props
    const inputId = idProp ?? React.useId()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) {
        setFileName('Nenhum arquivo selecionado')
      } else if (files.length === 1) {
        setFileName(files[0]!.name)
      } else {
        setFileName(`${files.length} arquivos selecionados`)
      }
      onChange?.(e)
    }

    return (
      <div className={cn('w-full', className)}>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          {...rest}
        />
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'opacity-50',
          )}
        >
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium',
              'hover:bg-accent hover:text-accent-foreground transition-colors',
              'cursor-pointer select-none',
              disabled && 'pointer-events-none cursor-not-allowed',
            )}
          >
            <Upload className="h-4 w-4" />
            Selecionar arquivo
          </label>
          <span className="inline-flex min-w-0 items-center gap-2 text-muted-foreground">
            <Paperclip className="h-4 w-4 shrink-0" />
            <span className="truncate">{fileName}</span>
          </span>
        </div>
      </div>
    )
  }

  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
