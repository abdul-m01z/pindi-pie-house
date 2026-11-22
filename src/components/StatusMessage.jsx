// Loading, error and empty messages share one layout so they are easy to recognise.
export default function StatusMessage({ kind, title, children, action }) {
  const role = kind === 'error' ? 'alert' : 'status'
  return (
    <div className={`status-message status-message--${kind}`} role={role}>
      <h2 className="status-message__title">{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
