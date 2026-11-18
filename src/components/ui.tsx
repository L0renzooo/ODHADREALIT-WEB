import { useId, useState, type ComponentProps, type ReactNode } from "react"
import {
  ArrowRight,
  ChevronDown,
  FlaskConical,
  type LucideIcon,
} from "lucide-react"
import { Link } from "@/lib/router"

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

/* ---------- Buttons ---------- */

type Variant = "lime" | "brand" | "light" | "outline" | "ghost-dark"
type Size = "md" | "lg" | "sm"

const variants: Record<Variant, string> = {
  lime: "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:bg-[var(--btn-primary-bg-hover)] shadow-[var(--btn-primary-shadow)]",
  brand: "bg-brand text-white hover:bg-brand-deep",
  light: "bg-white text-ink hover:bg-surface",
  outline:
    "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft",
  "ghost-dark":
    "border border-white/30 text-white hover:bg-white/10 hover:border-white/60",
}
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-[0.95rem] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
}

export function buttonClass(
  variant: Variant = "lime",
  size: Size = "md",
  extra?: string,
) {
  return cx(
    "group inline-flex shrink-0 items-center justify-center rounded-full font-bold tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,transform,box-shadow] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    extra,
  )
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden
      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      strokeWidth={2.4}
    />
  )
}

type ButtonLinkProps = {
  to: string
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  children: ReactNode
  onClick?: () => void
}

export function ButtonLink({
  to,
  variant,
  size,
  arrow = true,
  className,
  children,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={buttonClass(variant, size, className)}
      onClick={onClick}
    >
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant
  size?: Size
  arrow?: boolean
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

/* ---------- Typography ---------- */

export function Eyebrow({
  children,
  tone = "brand",
}: {
  children: ReactNode
  tone?: "brand" | "light"
}) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.14em] uppercase",
        tone === "brand" ? "text-olive" : "text-lime",
      )}
    >
      <span
        aria-hidden
        className={cx("h-px w-6", tone === "brand" ? "bg-sage" : "bg-lime")}
      />
      {children}
    </p>
  )
}

export function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <Tag
      className={cx(
        "text-title font-extrabold text-ink text-balance-safe",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-olive">{children}</span>
}

/* ---------- Badges & icons ---------- */

export function DemoBadge({
  tone = "light",
  label = "Ukážkové údaje",
}: {
  tone?: "light" | "dark"
  label?: string
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase",
        tone === "light"
          ? "bg-lime-soft text-lime-ink"
          : "bg-white/12 text-lime ring-1 ring-white/20",
      )}
    >
      <FlaskConical aria-hidden className="size-3" strokeWidth={2.4} />
      {label}
    </span>
  )
}

export function IconBadge({
  icon: Icon,
  tone = "brand",
}: {
  icon: LucideIcon
  tone?: "brand" | "lime" | "dark"
}) {
  return (
    <span
      className={cx(
        "inline-flex size-12 items-center justify-center rounded-2xl",
        tone === "brand" && "bg-brand-soft text-brand",
        tone === "lime" && "bg-lime text-ink",
        tone === "dark" && "bg-white/10 text-lime ring-1 ring-white/15",
      )}
    >
      <Icon aria-hidden className="size-[22px]" strokeWidth={1.7} />
    </span>
  )
}

/* ---------- Accordion ---------- */

type FaqItem = {
  q: string
  a: string
}

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${baseId}-b${i}`
        const panelId = `${baseId}-p${i}`
        return (
          <div key={item.q}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[1.05rem] font-bold text-ink transition-colors hover:text-brand sm:py-7 sm:text-[1.2rem]"
              >
                <span>{item.q}</span>
                <span
                  className={cx(
                    "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-180 border-brand bg-brand text-white"
                      : "border-line text-brand group-hover:border-brand/40",
                  )}
                >
                  <ChevronDown
                    aria-hidden
                    className="size-4"
                    strokeWidth={2.4}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cx(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-3xl pr-14 pb-7 text-[1rem] leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Form fields ---------- */

const controlBase =
  "w-full rounded-2xl border bg-white px-4 text-[0.98rem] text-ink placeholder:text-muted/70 transition-[border-color,box-shadow] outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgb(103_134_148/0.2)]"

type FieldShellProps = {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}

export function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-sm font-bold text-ink"
      >
        {label}
        {optional && (
          <span className="text-xs font-medium text-muted">nepovinné</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type InputFieldProps = Omit<ComponentProps<"input">, "id"> & {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

export function InputField({
  id,
  label,
  error,
  hint,
  optional,
  className,
  ...rest
}: InputFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional={optional}
    >
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cx(
          controlBase,
          "h-13",
          error ? "border-danger bg-danger-soft/40" : "border-line",
          className,
        )}
        {...rest}
      />
    </FieldShell>
  )
}

type TextareaFieldProps = Omit<ComponentProps<"textarea">, "id"> & {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

export function TextareaField({
  id,
  label,
  error,
  hint,
  optional,
  ...rest
}: TextareaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional={optional}
    >
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cx(
          controlBase,
          "min-h-32 py-3.5",
          error ? "border-danger bg-danger-soft/40" : "border-line",
        )}
        {...rest}
      />
    </FieldShell>
  )
}

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = Omit<ComponentProps<"select">, "id"> & {
  id: string
  label: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function SelectField({
  id,
  label,
  error,
  options,
  placeholder,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cx(
            controlBase,
            "h-13 appearance-none pr-11",
            error ? "border-danger" : "border-line",
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
        />
      </div>
    </FieldShell>
  )
}

/* ---------- Choice cards (radio) ---------- */

type ChoiceOption = {
  value: string
  label: string
  description?: string
  icon?: LucideIcon
}

export function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = 2,
}: {
  name: string
  legend: string
  options: ChoiceOption[]
  value: string
  onChange: (v: string) => void
  error?: string
  columns?: 2 | 3
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 text-sm font-bold text-ink">{legend}</legend>
      <div
        className={cx(
          "grid gap-3",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((o) => {
          const checked = value === o.value
          const Icon = o.icon
          return (
            <label
              key={o.value}
              className={cx(
                "relative flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                checked
                  ? "border-brand shadow-[0_0_0_3px_rgb(103_134_148/0.2)]"
                  : error
                    ? "border-danger/60"
                    : "border-line hover:border-brand/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {Icon && (
                <span
                  className={cx(
                    "inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    checked ? "bg-brand text-white" : "bg-surface text-brand",
                  )}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.8} />
                </span>
              )}
              <span className="flex flex-col">
                <span className="font-bold text-ink">{o.label}</span>
                {o.description && (
                  <span className="mt-0.5 text-sm text-muted">
                    {o.description}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className={cx(
                  "absolute top-4 right-4 size-5 rounded-full border-2 transition-all",
                  checked
                    ? "border-brand bg-brand shadow-[inset_0_0_0_3px_white]"
                    : "border-line",
                )}
              />
            </label>
          )
        })}
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm font-semibold text-danger"
        >
          {error}
        </p>
      )}
    </fieldset>
  )
}
