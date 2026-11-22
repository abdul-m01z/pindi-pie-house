// Shown after delivery/pickup or area changes. It says the cart was kept and offers Undo.
export default function ChangeNotice({ notice, onUndo, onDismiss }) {
  if (!notice) return null
  return (
    <div className="change-notice" role="status">
      <h3>Cart kept</h3>
      <ul>
        {notice.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="change-notice__actions">
        <button type="button" className="btn btn--secondary" onClick={onUndo}>
          Undo this change
        </button>
        <button type="button" className="btn btn--secondary" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
