import "./App.css";
import { Link, Route, Switch } from "react-router-dom";
import UserAuthen from "./component/UserAuthen";
import UserRegister from "./component/UserRegister";

function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Register</Link>
        </li>
        <li>
          <Link to="/auth">Login</Link>
        </li>
      </ul>
      <Switch>
        <Route path="/auth" component={UserAuthen} />
        <Route exact path="/" component={UserRegister} />
      </Switch>
    </div>
  );
}

export default App;
