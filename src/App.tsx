import { useReducer } from "react";
import "./App.css";

type initialState = {
  bill: number;
  tip: number;
  nop: number; //number of people
};
type State = typeof initialState;
type actionType = {
  type: string;
  payload: number;
};
const initialState: initialState = {
  bill: 0,
  tip: 0,
  nop: 0,
};
const reducer = (state: State, action: actionType) => {
  let change = { ...state };
  switch (action.type) {
    case "GetBillValue":
      change.bill = action.payload;
      return change;
      break;
    case "GetTipValue":
      change.tip = action.payload;
      return change;
      break;
    case "GetNOP":
      change.nop = action.payload;
      return change;
      break;
    default:
      return change;
  }
};

function App() {
  const [start, dispatch] = useReducer(reducer, initialState);
  function dispatchUse(type: string, payload: number) {
    dispatch({
      type: type,
      payload: payload,
    });
  }
  const allRight =
    start.bill !== null && start.tip !== null && start.nop !== null;

  const TipCalculation =
    allRight && ((start.bill * start.tip) / start.nop).toFixed(2);
  const total =
    allRight && ((start.bill * (1 + start.tip)) / start.nop).toFixed(2);

  const showTotal = !(TipCalculation === "NaN");
  const showTip = !(TipCalculation === "NaN");
  return (
    <div>
      <input
        type="number"
        value={start.bill}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          dispatchUse("GetBillValue", value);
        }}
      />
      <p>{start.bill}</p>
      <div>
        <div
          onClick={() => {
            const value = 0.05;
            dispatchUse("GetTipValue", value);
          }}
        >
          5%
        </div>
        <p>{start.tip}</p>
      </div>
      <input
        type="number"
        value={start.nop}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          dispatchUse("GetNOP", value);
        }}
      />
      <p>{start.nop}</p>

      <div>
        {showTip ? TipCalculation : "0.00"}
        <br />
        {showTotal ? total : "0.00"}
      </div>
    </div>
  );
}

export default App;
