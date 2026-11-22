// Standard page width and spacing. The Home page skips it so its hero can reach the screen edges.
export default function Page({ children }) {
  return <div className="container page">{children}</div>
}
