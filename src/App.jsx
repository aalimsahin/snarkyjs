import React, {// useCallback, useEffect, 
  useState } from 'react';
import { render } from 'react-dom';
//import { generatePuzzle } from './sudoku-lib.js';

// some style params
// let grey = '#cccccc';
//let darkGrey = '#999999';
// let lightGrey = '#f6f6f6';
// let thick = 'black solid 4px';
// let thin = `${grey} solid 1px`;
// let sudokuWidth = 450;
// let rightColumnWidth = 275;

//let Sudoku; // this will hold the dynamically imported './sudoku-snapp.ts'

render(<App />, document.querySelector('#root'));

function App() {
  let [puzzle, setPuzzle] = useState([]);
  // let [ease, setEase] = useState(0.5);

  // let [view, setView] = useState(1);
  // let goForward = () => setView(2);
  // let goBack = () => setView(1);
  return (
    <Container>

        <GenerateSudoku {...{ setPuzzle, puzzle }} />

    </Container>
  );
}

function GenerateSudoku(
  //{setPuzzle: setDeployedPuzzle,puzzle}/*{
  //setSudoku: setDeployedSudoku,
 // ease,
 // setEase,
  //goForward,
//}*/
) {/*
  let [sudoku, setSudoku] = useState(() => generateSudoku(1 - ease));
  useEffect(() => {
    setSudoku(generateSudoku(1 - ease));
  }, [ease]);
*/
  //var [isLoading, setLoading] = useState(false);

  // async function deploy() {
  //   if (isLoading) return;
  //   setLoading(true);
  //   puzzle = await import('../dist/sudoku-snapp.js');// burada p yi küçülttüm ama tekrar bir kontorl et
  //   await Sudoku.deploy(puzzle);
  //   setLoading(false);
  //   setDeployedPuzzle(puzzle);
  // }
  
  // let [solution, setSolution] = useState(puzzle ?? []);
  // let [snappState, pullSnappState] = useSnappState();


  // async function submit() {
  //   if (isLoading) return;
  //   setLoading(true);
  //   await Sudoku.submitSolution(solution);
  //   await pullSnappState();
  //   setLoading(false);
  // }

  return (
    <Layout>
      
      
      <div className="game">
      <div className="grid">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>10</button>
        <button>11</button>
        <button>12</button>
        <button>13</button>
        <button>14</button>
        <button>15</button>
        <button></button>
      </div>

      <div className="footer">
        <button>Deploy</button>
        <span id="move">Move: 100</span>
        <span id="time">Time: 100</span>
      </div>
    </div>
    <script src="script.js"></script>
    
    </Layout>
  );
}

class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  }

  getRightBox() {
    if (this.x === 3) return null;
    return new Box(this.x + 1, this.y);
  }

  getBottomBox() {
    if (this.y === 3) return null;
    return new Box(this.x, this.y + 1);
  }

  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  }

  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox()
    ].filter(box => box !== null);
  }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
  }
}

const swapBoxes = (grid, box1, box2) => {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
};

const isSolved = grid => { //çözümdeki gridleri kontrol ediyor. Birinci
  return (                // grid 1 mi? ikinci iki mi şeklinde.
    grid[0][0] === 1 &&
    grid[0][1] === 2 &&
    grid[0][2] === 3 &&
    grid[0][3] === 4 &&
    grid[1][0] === 5 &&
    grid[1][1] === 6 &&
    grid[1][2] === 7 &&
    grid[1][3] === 8 &&
    grid[2][0] === 9 &&
    grid[2][1] === 10 &&
    grid[2][2] === 11 &&
    grid[2][3] === 12 &&
    grid[3][0] === 13 &&
    grid[3][1] === 14 &&
    grid[3][2] === 15 &&
    grid[3][3] === 0
  );
};

const getRandomGrid = () => {
  let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

  // Shuffle
  let blankBox = new Box(3, 3);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(grid, blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }

  if (isSolved(grid)) return getRandomGrid();
  return grid;
};

class Sttate {
  constructor(grid,  status) {//move, time,
    this.grid = grid;
    //this.move = move;
    //this.time = time;
    this.status = status;
  }

  static ready() {
    return new Sttate(
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      //0,
      //0,
      "ready"
    );
  }

  static start() {
    return new Sttate(getRandomGrid(),  "playing");//0,0,
  }
}

// function SnappState({ state = {} }) {

//   let { puzzleHash = '', isSolved = false } = state;
//   document.getElementById("move").textContent = {puzzleHash};//${isResult}

//       // Render time
//       document.getElementById("time").textContent ={isSolved};//$puzzleHash}
//    return //<div>
//   //   {
//   //     //document.getElementById("move").textContent = puzzleHash;//${isResult}

//   //     // Render time
//   //     //document.getElementById("time").textContent =isSolved;//$puzzleHash}
//   //   }
//   // </div>
  
// }


class Game {
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
  }

  static ready() {
    return new Game(Sttate.ready());
  }

  tick() {
    this.setState({ time: this.state.time + 1 });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleClickBox(box) {
    return function() {
      const nextdoorBoxes = box.getNextdoorBoxes();
      const blankBox = nextdoorBoxes.find(
        nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
      );
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox);
        if (isSolved(newGrid)) {
          clearInterval(this.tickId);
          this.setState({
            status: "won",
            grid: newGrid,
            //move: this.state.move + 1
          });
        } else {
          this.setState({
            grid: newGrid,
            //move: this.state.move + 1
          });
        }
      }
    }.bind(this);
  }

  render() {
    const { grid,  status } = this.state; //move, time,

    // Render grid
    const newGrid = document.createElement("div");
    newGrid.className = "grid";
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const button = document.createElement("button");

        if (status === "playing") {
          button.addEventListener("click", this.handleClickBox(new Box(j, i)));
        }

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        newGrid.appendChild(button);
      }
    }
    document.querySelector(".grid").replaceWith(newGrid);

    // Render button
    const newButton = document.createElement("button");
    if (status === "ready") newButton.textContent = "Deploy";
    if (status === "playing") newButton.textContent = "Submit";
    if (status === "won") newButton.textContent = "Play";
    newButton.addEventListener("click", () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      this.setState(Sttate.start());
    });
    document.querySelector(".footer button").replaceWith(newButton);
    //let [puzzleHash,isSolved] = SnappState();
    // Render move
    //console.log("puzzlehash ve issolved"+puzzleHash,isSolved.toString());
    document.getElementById("move").textContent = "false";//{puzzleHash};//${isResult}

    // Render time
    document.getElementById("time").textContent ="32scsf..."//{isSolved};//${puzzleHash}

    // Render message
    if (status === "won") {
      document.querySelector(".message").textContent = "You win!";
    } else {
      document.querySelector(".message").textContent = "";
    }
  }
}

const GAME = Game.ready();

// function useSnappState() {
//   let [state, setState] = useState();
//   let pullSnappState = useCallback(async () => {
//     let state = await Sudoku?.getSnappState();
//     setState(state);
//     return state;
//   });
//   useEffect(() => {
//     Sudoku?.getSnappState().then(setState);
//   }, []);
//   return [state, pullSnappState];
// }


/*
function SolveSudoku({ sudoku, goBack }) {
  let [solution, setSolution] = useState(sudoku ?? []);
  let [snappState, pullSnappState] = useSnappState();

  let [isLoading, setLoading] = useState(false);

  async function submit() {
    if (isLoading) return;
    setLoading(true);
    await Sudoku.submitSolution(solution);
    await pullSnappState();
    setLoading(false);
  }

  return (
    <Layout>
      <Header goBack={goBack}>Step 2. Solve the Sudoku</Header>

      <SudokuTable
        sudoku={sudoku}
        editable
        solution={solution}
        setSolution={setSolution}
      />

      <div style={{ width: rightColumnWidth + 'px' }}>
        <p>Snapp state:</p>
        <Space h=".5rem" />

        <SnappState state={snappState} />
        <Space h="2.5rem" />

        <Button onClick={submit} disabled={isLoading}>
          Submit solution
        </Button>
      </div>
    </Layout>
  );
}

function useSnappState() {
  let [state, setState] = useState();
  let pullSnappState = useCallback(async () => {
    let state = await Sudoku?.getSnappState();
    setState(state);
    return state;
  });
  useEffect(() => {
    Sudoku?.getSnappState().then(setState);
  }, []);
  return [state, pullSnappState];
}

// pure UI components

function Header({ goBack, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <h1 style={{ fontSize: '36px', textAlign: 'center' }}>{children}</h1>
      {goBack && (
        <div
          onClick={goBack}
          title="Back to step 1"
          style={{
            position: 'absolute',
            cursor: 'pointer',
            left: '25px',
            top: 0,
            fontSize: '40px',
          }}
        >
          👈
        </div>
      )}
    </div>
  );
}

function SudokuTable({ sudoku, editable, solution, setSolution }) {
  let cellSize = sudokuWidth / 9 + 'px';
  let fontSize = sudokuWidth / 18 + 'px';
  return (
    <table
      style={{
        border: thin,
        borderCollapse: 'collapse',
        fontSize,
      }}
    >
      <tbody>
        {sudoku.map((row, i) => (
          <tr key={i}>
            {row.map((x, j) => (
              <td
                key={j}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRight: j === 2 || j === 5 ? thick : thin,
                  borderBottom: i === 2 || i === 5 ? thick : thin,
                }}
              >
                {!!x || !editable ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {x || ''}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={solution[i][j] || ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      textAlign: 'center',
                      fontSize,
                      backgroundColor: lightGrey,
                      border: thin,
                    }}
                    onChange={(e) => {
                      let newSudoku = cloneSudoku(solution);
                      newSudoku[i][j] = Number(e.target.value);
                      setSolution(newSudoku);
                    }}
                  ></input>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SnappState({ state = {} }) {
  let { sudokuHash = '', isSolved = false } = state;
  return (
    <div
      style={{
        backgroundColor: lightGrey,
        border: thin,
        padding: '8px',
      }}
    >
      <pre style={{ display: 'flex', justifyContent: 'space-between' }}>
        <b>sudokuHash</b>
        <span
          title={sudokuHash}
          style={{
            width: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sudokuHash}
        </span>
      </pre>
      <Space h=".5rem" />
      <pre style={{ display: 'flex', justifyContent: 'space-between' }}>
        <b>isSolved</b>
        <span style={{ color: isSolved ? 'green' : 'red' }}>
          {isSolved.toString()}
        </span>
      </pre>
    </div>
  );
}

function Button({ disabled = false, ...props }) {
  return (
    <button
      className="highlight"
      style={{
        color: disabled ? darkGrey : 'black',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: disabled ? 'white !important' : 'white',
        borderRadius: '10px',
        paddingTop: '10px',
        paddingBottom: '10px',
        width: '100%',
        border: disabled ? `4px ${darkGrey} solid` : '4px black solid',
        boxShadow: `${grey} 3px 3px 3px`,
        cursor: disabled ? undefined : 'pointer',
      }}
      disabled={disabled}
      {...props}
    />
  );
}


*/

function Container(props) {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: 'auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: '2rem',
      }}
      {...props}
    />
  );
}

function Layout({ children }) {
  let [header, left, right] = children;
  return (
    <>
      {header}
      <Space h="4rem" />
      <div style={{ display: 'flex' }}>
        {left}
        <Space w="4rem" />
        {right}
      </div>
    </>
  );
}

function Space({ w, h }) {
  return <div style={{ width: w, height: h }} />;
}
