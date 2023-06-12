import { useReducer, useRef } from "react";
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
    case "ChangePercent":
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
  const whenRef = useRef<boolean>(false);
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
  type TipData = {
    value: number;
    content: string;
  }[];
  const tipData: TipData = [
    {
      value: 0.05,
      content: "5%",
    },
    {
      value: 0.1,
      content: "10%",
    },
    {
      value: 0.15,
      content: "15%",
    },
    {
      value: 0.25,
      content: "25%",
    },
    {
      value: 0.5,
      content: "50%",
    },
  ];
  console.log(whenRef.current);
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
        {tipData.map((data: any, idx: number) => (
          <div
            key={idx}
            onClick={() => {
              const value = data.value;
              dispatchUse("GetTipValue", value);
              whenRef.current = false;
            }}
          >
            {data.content}
            {data.TipbolChange}
          </div>
        ))}

        <p>{start.tip}</p>
        <input
          type="number"
          min={0}
          max={100}
          value={whenRef.current ? start.tip && start.tip * 100 : ""}
          onChange={(e) => {
            const value = Math.min(Math.max(e.target.valueAsNumber, 0), 100); // Clamp the value between 0 and 100
            dispatchUse("ChangePercent", value / 100);
            whenRef.current = true;
          }}
        />
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
