import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./App.css";
import "./Main.scss";
import Grid from "./components/Grid/Grid";
import Header from "./components/Header/Header";

const useInterval = (callback, delay, duration) => {
  const durationRef = useRef(duration);
  const durationIntervalRef = useRef();

  const handler = () => {
    callback(durationRef);
  };

  useEffect(() => {
    const durationInterval = setInterval(handler, delay);
    durationIntervalRef.current = durationInterval;
    return () => {
      clearInterval(durationInterval);
    };
  }, [delay]);

  return durationIntervalRef;
};

const App = () => {
  const baseUrl = "https://api.eyeem.com/v2/photos/popular";
  const cliendId = "9iNUTAc4FCsRj5Co6vJgzVySHxuJtL3Y";
  const photosUrl = `${baseUrl}?client_id=${cliendId}&limit=9`;
  const [newGame, setNewGame] = useState(false);
  const [list, setList] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [duration, setDuration] = useState(0);

  const [finishedItems, setFinishedItems] = useState([]);
  const [winner, setWinner] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [count, setCount] = useState(0);
  const [countTwo, setCountTwo] = useState(0);
  const [turn, setTurn] = useState(0);

  const checkItems = (firstIndex, secondIndex) => {
    if (
      firstIndex !== secondIndex &&
      list[firstIndex].url === list[secondIndex].url
    ) {
      setFinishedItems([...finishedItems, firstIndex, secondIndex]);
      if (isMultiple) {
        if (turn === 0) {
          setCount(count + 1);
        } else {
          setCountTwo(countTwo + 1);
        }
      } else {
        setCount(count + 1);
      }
    } else {
      setTimeout(() => {
        setVisibleItems([]);
        if (isMultiple) {
          if (turn === 0) {
            setTurn(1);
          } else {
            setTurn(0);
          }
        } else {
          setTurn(0);
        }
      }, 500);
    }
  };

  useEffect(() => {
    axios.get(photosUrl).then((res) => {
      const newList = res.data.photos.items.map((item) => {
        return {
          id: item.id,
          url: item.photoUrlPublic,
          description: item.alt_description,
        };
      });
      setList(
        newList
          .concat(
            newList.map((item) => {
              return {
                ...item,
                id: item.id + "1",
              };
            })
          )
          .sort(() => {
            return 0.5 - Math.random();
          })
      );
    });
  }, [newGame]);

  const durationIntervalRef = useInterval(
    (durationRef) => {
      durationRef.current++;
      setDuration(durationRef.current);
    },
    1000,
    duration
  );

  useEffect(() => {
    if (finishedItems.length > 0 && finishedItems.length === list.length) {
      setWinner(true);
      clearInterval(durationIntervalRef.current);
    }
  }, [finishedItems]);

  return (
    <div className="wrapper">
      <Header />
      <div className="buttons">
        <button
          onClick={() => {
            setNewGame(!newGame);
            setVisibleItems([]);
            setFinishedItems([]);
            setWinner(false);
            setIsMultiple(false);
            setDuration(0);
            setCount(0);
            setCountTwo(0);
            setTurn(0);
          }}
          className="btn"
        >
          New Game
        </button>
        <button
          onClick={() => {
            setNewGame(!newGame);
            setVisibleItems([]);
            setFinishedItems([]);
            setWinner(false);
            setIsMultiple(true);
            setDuration(0);
            setCount(0);
            setCountTwo(0);
            setTurn(0);
          }}
          className="btn"
        >
          Play Two Player
        </button>
      </div>

      <div className="scores">
        <div>
          {isMultiple ? (
            <div className="player-scores">
              <div className={`first-player ${turn === 0 ? "your-turn" : ""}`}>
                Player1 Score: <b>{count}</b>
              </div>

              <div className={`second-player ${turn === 1 ? "your-turn" : ""}`}>
                Player2 Score: <b>{countTwo}</b>
              </div>
            </div>
          ) : (
            <div className="scores">
              <div className="first-player">
                Player1 Score: <b>{count}</b>
              </div>
            </div>
          )}
          {winner && (
            <div className="score-board">
              {!isMultiple ? (
                <span>
                  <b>You</b> Win !
                </span>
              ) : countTwo > count ? (
                <span>
                  <b>Player 2</b> Win !
                </span>
              ) : countTwo === count ? (
                <span>
                  <b>Draw.</b> Play again.
                </span>
              ) : (
                <span>
                  <b>Player 1</b> Win !
                </span>
              )}
              <br />
              Finished in {duration} seconds.
            </div>
          )}
        </div>
      </div>
      {list.length === 0 ? (
        <div>...Loading</div>
      ) : (
        <div>
          <Grid
            list={list}
            visibleItems={visibleItems}
            setVisibleItems={setVisibleItems}
            finishedItems={finishedItems}
            checkItems={checkItems}
          />
        </div>
      )}
    </div>
  );
};

export default App;
