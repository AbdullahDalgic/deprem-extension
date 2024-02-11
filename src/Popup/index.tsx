import React from "react";
import { useAsync } from "react-async";
import { createRoot } from "react-dom/client";
import reduxedStore from "@src/tools/redux";
import { Provider } from "react-redux";
import Navigation from "./Navigation";

import "./style.scss";
import Loader from "./Components/Loader";

const App: React.FC<{}> = () => {
  const { data, error, isPending } = useAsync({ promiseFn: reduxedStore });

  if (isPending) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  if (data) {
    return (
      <Provider store={data}>
        <Navigation />
      </Provider>
    );
  }

  return <Loader />;
};

const rootDiv = document.createElement("div");
rootDiv.id = "root";
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<App />);
