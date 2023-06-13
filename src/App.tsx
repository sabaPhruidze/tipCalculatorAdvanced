import { useReducer, useRef, useMemo, useCallback, useEffect } from "react";
import "./App.css";

import SPLITTER from "./assets/SPLITTER.png";
import DOLLAR from "./assets/icons/icon-dollar.svg";
import PERSON from "./assets/icons/icon-person.svg";

type initialState = {
  bill: number | null;
  tip: number | null;
  nop: number | null; //number of people
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
    case "GetTipValue":
    case "ChangePercent":
      change.tip = action.payload;
      return change;
    case "GetNOP":
      change.nop = action.payload;
      return change;
    default:
      return change;
  }
};

function App() {
  const [start, dispatch] = useReducer(reducer, initialState);
  const whenRef = useRef<boolean>(false);
  const billRef = useRef<any>();
  const tipRef = useRef<any>();
  const peopleRef = useRef<any>();
  const buttonRef = useRef<any>();

  const dispatchUse = useCallback(
    (type: string, payload: number) => {
      dispatch({
        type: type,
        payload: payload,
      });
    },
    [dispatch] // So when the dispach changes this function will be called else it won't which will improve the performance of the app
  );

  const allRight = useMemo(
    () => start.bill !== null && start.tip !== null && start.nop !== null,
    [start.bill, start.tip, start.nop]
  );

  const TipCalculation = useMemo(() => {
    if (
      allRight &&
      start.bill !== null &&
      start.tip !== null &&
      start.nop !== null
    ) {
      return ((start.bill * start.tip) / start.nop).toFixed(2);
    }
    return "0.00";
  }, [allRight, start.bill, start.tip, start.nop]);

  const total = useMemo(() => {
    if (
      allRight &&
      start.bill !== null &&
      start.tip !== null &&
      start.nop !== null
    ) {
      return ((start.bill * (1 + start.tip)) / start.nop).toFixed(2);
    }
    return "0.00";
  }, [allRight, start.bill, start.tip, start.nop]);

  const showTotal = useMemo(
    () => !(total === "NaN" || total === "Infinity"),
    [total]
  );
  const showTip = useMemo(
    () => !(TipCalculation === "NaN" || TipCalculation === "Infinity"),
    [TipCalculation]
  );

  type TipData = {
    value: number;
    content: string;
  }[];

  const tipData: TipData = useMemo(
    () => [
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
    ],
    []
  );

  const rightSideData = useMemo(
    () => [
      {
        name: "Tip Amount",
        content: showTip ? TipCalculation : "0.00",
      },
      {
        name: "Total",
        content: showTotal ? total : "0.00",
      },
    ],
    [showTip, TipCalculation, showTotal, total]
  );
  useEffect(() => {
    if (
      (start.bill !== null && start.bill !== 0) ||
      (start.tip !== null && start.tip !== 0) ||
      (start.nop !== null && start.nop !== 0)
    ) {
      buttonRef.current.style.backgroundColor = "#9FE8DF";
      buttonRef.current.style.color = "#00474B";
    } else {
      buttonRef.current.style.backgroundColor = "#0D686D";
      buttonRef.current.style.color = "#096166";
    }
  }, [start.bill, start.tip, start.nop]);
  return (
    <div className="main-body">
      <img src={SPLITTER} className="splitter" />
      <div className="container">
        <div className="left-side">
          <img src={DOLLAR} alt="dollar" className="common-icon-size dollar" />
          <img src={PERSON} alt="person" className="common-icon-size person" />
          <label htmlFor="bill">Bill</label>
          <input
            className="firstLast"
            type="number"
            value={start.bill !== null ? start.bill : ""}
            placeholder="0"
            id="bill"
            onKeyDown={(e) => {
              if (e.key === "." || e.key === ",") {
                e.preventDefault();
              }
            }}
            ref={billRef}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              dispatchUse("GetBillValue", value);
              if (value === 0) {
                e.target.style.border = "1px solid red";
              } else {
                e.target.style.border = "1px solid green";
              }
            }}
            dir="rtl"
          />
          <label htmlFor="Tip" className="mt-40">
            Select Tip %
          </label>
          <div className="Whole-percent-box">
            {tipData.map((data: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  const value = data.value;
                  dispatchUse("GetTipValue", value);
                  whenRef.current = false;
                }}
                className="percent-box"
              >
                {data.content}
                {data.TipbolChange}
              </div>
            ))}

            <input
              type="number"
              min={0}
              id="Tip"
              max={100}
              ref={tipRef}
              onKeyDown={(e) => {
                if (e.key === "." || e.key === ",") {
                  e.preventDefault();
                }
              }}
              value={
                whenRef.current && start.tip !== 0 && start.tip !== null
                  ? start.tip * 100
                  : ""
              }
              placeholder="Custom"
              onChange={(e) => {
                const value = Math.min(
                  Math.max(e.target.valueAsNumber, 0),
                  100
                ); // Clamp the value between 0 and 100
                dispatchUse("ChangePercent", value / 100);
                whenRef.current = true;
                if (value === 0) {
                  e.target.style.border = "1px solid red";
                } else {
                  e.target.style.border = "1px solid green";
                }
              }}
              dir="rtl" // this makes it write from right to left
            />
          </div>
          <label htmlFor="people" className="mt-40">
            Number of People
          </label>
          <input
            className="firstLast"
            type="number"
            id="people"
            value={start.nop !== null ? start.nop : ""}
            placeholder="0"
            dir="rtl"
            ref={peopleRef}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === ",") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              dispatchUse("GetNOP", value);
              if (value === 0) {
                e.target.style.border = "1px solid red";
              } else {
                e.target.style.border = "1px solid green";
              }
            }}
          />
        </div>
        <div className="right-side">
          <div>
            {rightSideData.map((data: any, idx: number) => (
              <div className="d-flex-row" key={idx}>
                <div>
                  <h4>{data.name}</h4>
                  <h5>/ person</h5>
                </div>
                <p>${data.content}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              dispatchUse("GetBillValue", 0);
              dispatchUse("GetTipValue", 0);
              dispatchUse("GetNOP", 0);
              billRef.current.style.border = 0;
              tipRef.current.style.border = 0;
              peopleRef.current.style.border = 0;
            }}
            ref={buttonRef}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
