import {
  matrixProp,
  CircuitValue,
  Field,
  SmartContract,
  PublicKey,
  method,
  PrivateKey,
  Mina,
  Bool,
  state,
  State,
  isReady,
  Poseidon,
  UInt64,
  Party,
} from 'snarkyjs';

export { deploy, submitSolution, getSnappState };

await isReady;

class Puzzle extends CircuitValue {
  @matrixProp(Field, 4, 4) value : Field[][];
  constructor(value: number[][]) {
    super();
    this.value = value.map((row) => row.map(Field));
  }

  hash() {
    return Poseidon.hash(this.value.flat());
  }
}
/*
class Sudoku extends CircuitValue {
  @matrixProp(Field, 9, 9) value: Field[][];

  constructor(value: number[][]) {
    super();
    this.value = value.map((row) => row.map(Field));
  }

  hash() {
    return Poseidon.hash(this.value.flat());
  }
}
*/
class PuzzleSnapp extends SmartContract {
  puzzle: Puzzle;
  @state(Field) puzzleHash: State<Field>;
  @state(Bool) isSolved: State<Bool>;

  constructor(address: PublicKey, initialBalance: UInt64, puzzle: Puzzle) {
    super(address);
    this.balance.addInPlace(initialBalance);

    this.puzzle = puzzle;
    this.puzzleHash = State.init(this.puzzle.hash());
    this.isSolved = State.init(Bool(false));
  }

  @method async submitSolution(solutionInstance: Puzzle) {
    let puzzle = this.puzzle.value;
    let solution = solutionInstance.value;

    // first, we check that the passed solution is a valid sudoku

    // define helpers
    function isItSame(array){
    let trueArray = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
      return trueArray = array;
    }

    function checkOurPuzzle(array: Field[]) {
      isItSame(array).assertEquals(true);
    }


    // finally, we check that the sudoku is the one that was originally deployed
    let puzzleHash = await this.puzzleHash.get(); // get the hash from the blockchain
    this.puzzle.hash().assertEquals(puzzleHash);

    // all checks passed => the sudoku is solved!
    this.isSolved.set(Bool(true));
  }

}
/*
class SudokuSnapp extends SmartContract {
  sudoku: Sudoku;
  @state(Field) sudokuHash: State<Field>;
  @state(Bool) isSolved: State<Bool>;

  constructor(address: PublicKey, initialBalance: UInt64, sudoku: Sudoku) {
    super(address);
    this.balance.addInPlace(initialBalance);

    this.sudoku = sudoku;
    this.sudokuHash = State.init(this.sudoku.hash());
    this.isSolved = State.init(Bool(false));
  }

  @method async submitSolution(solutionInstance: Sudoku) {
    let sudoku = this.sudoku.value;
    let solution = solutionInstance.value;

    // first, we check that the passed solution is a valid sudoku

    // define helpers
    let range9 = Array.from({ length: 9 }, (_, i) => i);
    let oneTo9 = range9.map((i) => Field(i + 1));

    function assertHas1To9(array: Field[]) {
      oneTo9
        .map((k) => range9.map((i) => array[i].equals(k)).reduce(Bool.or))
        .reduce(Bool.and)
        .assertEquals(true);
    }

    // check all rows
    for (let i = 0; i < 9; i++) {
      let row = solution[i];
      assertHas1To9(row);
    }
    // check all columns
    for (let j = 0; j < 9; j++) {
      let column = solution.map((row) => row[j]);
      assertHas1To9(column);
    }
    // check 3x3 squares
    for (let k = 0; k < 9; k++) {
      let [i0, j0] = divmod(k, 3);
      let square = range9.map((m) => {
        let [i1, j1] = divmod(m, 3);
        return solution[3 * i0 + i1][3 * j0 + j1];
      });
      assertHas1To9(square);
    }

    // next, we check that the solution extends the initial sudoku
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let cell = sudoku[i][j];
        let solutionCell = solution[i][j];
        // either the sudoku has nothing in it (indicated by a cell value of 0),
        // or it is equal to the solution
        Bool.or(cell.equals(0), cell.equals(solutionCell)).assertEquals(true);
      }
    }

    // finally, we check that the sudoku is the one that was originally deployed
    let sudokuHash = await this.sudokuHash.get(); // get the hash from the blockchain
    this.sudoku.hash().assertEquals(sudokuHash);

    // all checks passed => the sudoku is solved!
    this.isSolved.set(Bool(true));
  }
}
*/
// setup
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const account1 = Local.testAccounts[0].privateKey;
const account2 = Local.testAccounts[1].privateKey;

let snapp: PuzzleSnapp;
let isDeploying = false;
let snappAddress: PublicKey;

async function deploy(sudoku: number[][]) {
  if (isDeploying) return;
  isDeploying = true;
  const snappPrivkey = PrivateKey.random(); //{"s":"21073432976781482710517588516033071416877042776021764153467132202800626350001"}
  snappAddress = snappPrivkey.toPublicKey();//{"g":{"x":"21594361586439110233965608279692099097503904158417590018191776501079626027660","y":"28218238683623920324716847748433238617566762224739725342890026093639769039788"}}
  let tx = Mina.transaction(account1, async () => {
    console.log('Deploying Sudoku...');
    const initialBalance = UInt64.fromNumber(1000000);// 1000000
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(initialBalance);
    snapp = new PuzzleSnapp(snappAddress, initialBalance, new Puzzle(sudoku));
  });
  await tx.send().wait();

  isDeploying = false;
}

async function submitSolution(solution: number[][]) { // buradaki fonksiyonu direk entegre edebiliriz
  let tx = Mina.transaction(account2, async () => {   // Oyunun sonunda direk bittiğini söylemesin sormak zorunda olsun
    console.log('Submitting solution...');
    await snapp.submitSolution(new Puzzle(solution));
  });
  try {
    await tx.send().wait();
  } catch (err) {
    console.log('Solution rejected!');
  }
}

async function getSnappState() {
  let snappState = (await Mina.getAccount(snappAddress)).snapp.appState; //23633837411351609851457476207677918097847359350093999631655394953329416556566,0,0,0,0,0,0,0
  let sudokuHash = fieldToHex(snappState[0]); // ekranda gözüken hash'e çeviriyor => 31014f2b16ac76a843f9ed3ed0ee981eb8b249bca6c2fe6c31819ea19146357c
  let isSolved = snappState[1].equals(true).toBoolean(); // snap çözülmeidğinde 0, çözülünce 1
  return { sudokuHash, isSolved };
}

// helpers
/*
function divmod(k: number, n: number) {
  let q = Math.floor(k / n);
  return [q, k - q * n];
}
*/
function fieldToHex(field: Field) {
  return BigInt(field.toString()).toString(16);
}
