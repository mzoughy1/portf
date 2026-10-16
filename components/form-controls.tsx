export function PrivacyNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-muted">{children}</p>;
}

export function TextField({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field min-h-36 resize-y"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Honeypot({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Company</label>
      <input
        id={id}
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
