import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import Signup from "./Signup";

function App() {
  return (
    <main>
        <Switch>
            <Route path='/signup'>
                <Signup />
            </Route>
        </Switch>
    </main>
  );
}

export default App;
