import { Link } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage.jsx'

export default function NotFound({ what = 'page' }) {
  return (
    <>
      <h1>We could not find that {what}</h1>
      <StatusMessage
        kind="empty"
        title={`This ${what} does not exist`}
        action={
          <Link to="/menu" className="btn btn--primary">
            Back to the menu
          </Link>
        }
      >
        The link may be old or mistyped. Choose a dish from the menu instead.
      </StatusMessage>
    </>
  )
}
