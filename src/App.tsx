import LogoMasters from "./components/logo/logo-masters"
import RoundButton from "./components/round-button/round-button"

function App() {

  return (
    <div>
      <h1>Build Ryujin web-app with Vite, React and Typescript.</h1>
      <RoundButton>Sign Up</RoundButton>
      <RoundButton>Login</RoundButton>
      <div>
        <LogoMasters/>
      </div>
      <p>hello world</p>
    </div>
  )
}

export default App
