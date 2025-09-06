import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { useAsync } from "react-async";
import redux from "@src/tools/redux";

import Loader from "@src/Popup/Components/Loader";
import RedirectComponent from "./RedirectComponent";

const App: React.FC<{}> = () => {
  const { data, error, isPending } = useAsync({
    promiseFn: redux,
  });

  if (error) return <>Redux error</>;
  if (isPending) return <Loader />;
  if (data) {
    return (
      <Provider store={data}>
        <RedirectComponent />
      </Provider>
    );
  }

  return <></>;
};

document.body.prepend(document.createElement("div"));
const root = createRoot(document.querySelector("body > div"));
root.render(<App />);
