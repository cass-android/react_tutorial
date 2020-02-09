import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
          <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
  }

// generate rows of squares with two loops
  render() {
    let output_outer = [];
    for(let i=0; i < 7; i+=3) {
      let output_inner = [];
      for(let k=0; k < 3; k++) {
        output_inner.push(this.renderSquare(i+k))
        }
      output_outer.push(<div className="board-row">
        {output_inner}</div>)
      }
    return <div>{output_outer}</div>;
    }
  }


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moveNumber: 0,
      xIsNext: true,
      isAscending: true,

    };
  }

  //use toggle to sort moves
  handleToggle() {
    this.setState({
        isAscending: !this.state.isAscending
      });

    }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        // saves the index of the square (0-8)
        locate: i,
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,

    });
  }

  jumpTo(move) {
    this.setState({
      moveNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.isAscending;

    const moves = history.map((step, move) => {
      // converts the index of the square into column, row

      const col = step.locate % 3
      const row = step.locate < 3 ? 0 : step.locate < 6 ? 1 : 2

      const desc = move ?
        '('+ col +','+ row + ') ' +
        'Go to move #' + move :
        'Go to game start';
      
      return (
        <ul key={move}>
          <button id="button"
            // bolds move corresponding to the current state (which changes as selected)
            className = {
              move === this.state.moveNumber ? "selected-button" : "button"
            }
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </ul>
      );
    });

    // reverse order of moves if descending is selected
    if (!ascending) {moves.reverse()};

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.handleToggle()}>
            {ascending ? 'sort descending' : 'sort ascending'}
          </button>
          <ul>
          {moves}
          </ul>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,

  document.getElementById('root')
);

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
