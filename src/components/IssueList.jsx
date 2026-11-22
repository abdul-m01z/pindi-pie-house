// List of things that block checkout, each with a plain message.
export default function IssueList({ issues, id }) {
  if (issues.length === 0) return null
  return (
    <div className="issue-list" id={id} role="alert">
      <h3>Before you can check out</h3>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>{issue.message}</li>
        ))}
      </ul>
    </div>
  )
}
