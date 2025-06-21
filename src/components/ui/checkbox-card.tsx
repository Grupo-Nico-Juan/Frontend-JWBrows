import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxCardProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: string
  icon?: React.ReactNode
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const CheckboxCard = ({
  label,
  icon,
  description,
  className,
  ...props
}: CheckboxCardProps) => {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(
        "relative ring-[1px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary",
        className
      )}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <span className="font-medium text-base tracking-tight">{label}</span>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
        <CircleCheck className="fill-primary text-primary-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}