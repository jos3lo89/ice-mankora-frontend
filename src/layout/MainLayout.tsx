import { Outlet } from "react-router-dom"

export const MainLayout = () => {
  return (
    <div>
      <header>
        main layout
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}