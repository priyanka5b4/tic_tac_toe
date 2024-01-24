import { useState } from "react";
import { Button, CardHeader, ThemeProvider, createTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const theme = createTheme({
    palette: {
        primary: {
            main: '#61dafb',
        },
       },
});


export default function GameBoard() {
    let [winner, setWinner] = useState(null);
    let [counter, setCounter] = useState(0);
    let [board, setBoard] = useState(Array(9).fill(null));
    let [curState, setCurrentState] = useState("X");
   // let [moves , setMoves] = useState(Array(9).fill(null));
    let [jsonMoves , setJsonMoves] = useState([]);

    const winner_seq =
        [
            [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
        ]
    
    
 



    function checkWinner(updatedboard) {

        for (var i = 0; i < winner_seq.length; i++) {
            var [a, b, c] = winner_seq[i];
            if (updatedboard[a] && updatedboard[a] === updatedboard[b] && updatedboard[a] === updatedboard[c]) {
                return true;
            }

        }
        return false;

    }


    function getOtherState(state){
        if(state === "X")
            return "O";
        else return "X";
    }

    function calculate_WinningMove(updatedBoard , state)
    {
        for(let i=0;i<winner_seq.length;i++)
        {
            var [a, b , c] = winner_seq[i];
            if(((updatedBoard[a] === state)  && ((updatedBoard[a] === updatedBoard[b]) || (updatedBoard[a] === updatedBoard[c])) ) || 
             ((updatedBoard[b] === state) && ((updatedBoard[b] === updatedBoard[c]) || (updatedBoard[b] === updatedBoard[a])))||
                (((updatedBoard[c] === state) && ((updatedBoard[c] === updatedBoard[a]) || (updatedBoard[c] === updatedBoard[b])))))
            {
                if(updatedBoard[a] === null)
                {
                    return a;
                }
                else if(updatedBoard[b] === null)
                {
                    return b;
                }
                else if(updatedBoard[c] === null)
                {
                    return c;
                }
            }
            
        }
        state = getOtherState(state);

        for(let i=0;i<winner_seq.length;i++)
        {
            var [a, b , c] = winner_seq[i];
            if(((updatedBoard[a] === state)  && ((updatedBoard[a] === updatedBoard[b]) || (updatedBoard[a] === updatedBoard[c])) ) || 
             ((updatedBoard[b] === state) && ((updatedBoard[b] === updatedBoard[c]) || (updatedBoard[b] === updatedBoard[a])))||
                (((updatedBoard[c] === state) && ((updatedBoard[c] === updatedBoard[a]) || (updatedBoard[c] === updatedBoard[b])))))
            {
                if(updatedBoard[a] === null)
                {
                    return a;
                }
                else if(updatedBoard[b] === null)
                {
                    return b;
                }
                else if(updatedBoard[c] === null)
                {
                    return c;
                }
            }
            
        }



        return -1;
    }

    

    function calculate_probablility(game_board  , state)
    {
        
          
          let probablities = [];
          let cnt = 0;
        // calculate probability of current state for each empty grid. 
        for(let i = 0 ; i < game_board.length;i++)
        {
            if(game_board[i] !== null)
              continue;
            
            let current_probability = {};
            game_board[i] = state;
            cnt=cnt+1;
            let otherstate = getOtherState(state);
            if(checkWinner(game_board))
            {
                
                 current_probability =  { [state] : 1 , [otherstate] : 0 , "Draw" : 0};
            }
            else 
            {
            
            
            current_probability =  calculate_probablility(game_board , otherstate);

            }

            probablities.push(current_probability);

            game_board[i] = null;
            
        }

        if(cnt === 0) {
            return  { [state] : 1 , [getOtherState(state)] : 0, "Draw" : 1};
        }

        let final_probability = {"X" : 0 , "O" : 0 , "Draw" : 0};
        for(let i = 0 ; i<probablities.length;i++)
        {
                final_probability["X"]  = final_probability["X"] + probablities[i]["X"];
                final_probability["O"] = final_probability["O"] + probablities[i]["O"];
                final_probability["Draw"] = final_probability["Draw"] + probablities[i]["Draw"];

        }
        final_probability["X"] = final_probability["X"]/cnt;
        final_probability["O"] = final_probability["O"]/cnt;
        final_probability["Draw"] = final_probability["Draw"]/cnt;

        return final_probability;
        
       
    }


    function get_position(game_board , state)
    {
        let probablities = [];
        let null_positions = [];

        if(counter === 0)
        {
              if(game_board[0] !== null || game_board[2] !== null || game_board[6] !== null || game_board[8] !== null)
              {
                return 4;
              }
           

        }

        if(counter === 2)
        {
            if(((game_board[0] === "X") && (game_board[8] === "X")) || ((game_board[2] == "X") && (game_board[6] == "X")) && game_board[4] === "O")
            return 3;
        }

        let winning_move_index = calculate_WinningMove(game_board , state);
       
        if(winning_move_index !== -1)
        return winning_move_index;
        
        for(let i = 0;i<game_board.length;i++)
        {     
            
               if(game_board[i] === null)
               {
                  game_board[i] =  state;

               
               
               if(checkWinner(game_board))
               {
                return i;
               }
              
                null_positions.push(i);
                let current_probability = calculate_probablility(game_board.slice() , getOtherState(state));
                current_probability["index"] = i;
                game_board[i] = null;
                probablities.push(current_probability);
            
              }
        }

        let max_probability = 0 , index = -1;

        // // check the winning case of current state
        // for(let i =0;i<probablities.length;i++)
        // {
        //     if(probablities[i][state] === 1){
        //         return probablities[i]["index"];
        //     }
        // }

        // // check the winning case of other state
        // for(let i =0;i<probablities.length;i++)
        // {
              
        //       if(probablities[i][getOtherState(state)] === 1)
        //       {
        //          return probablities[i]["index"];
        //       }
        // }

          
        for(let i =0;i<probablities.length;i++)
        {
           
              //optimal strategy to take the max of p(current) / p(other)
              // winning case 
             let probability = probablities[i][state]/probablities[i][getOtherState(state)];
           if(probability  > max_probability)
           {
             max_probability = probability;
             index = probablities[i]["index"];
           }    
        }
        if(index === -1)
        {
            // no winningcase pick draw case
           for(let i=0;i< probablities.length;i++)
           {
            if(probablities[i]["Draw"] > max_probability)
            {
                max_probability = probablities[i][state];
                index = probablities[i]["index"];
            }
           
           } 
        }
        if(index === -1) {
            // pick random from current null values 
            //const randomIndex = Math.floor(Math.random() * null_positions.length);
            return null_positions[0];
            
        }
        return index;

    } 
    
    
    
  function addToMoves(Item)
  {
    setJsonMoves((previousData) => [...previousData, Item]);
    console.log(board);
  }

  function updateOnclick(event) {
    
       
        
        // updating the user move 
       
        let id = event.target.parentNode.id;
        let updatedBoard = [...board];
        updatedBoard[id] = curState;
         //setBoard(updatedBoard);
        event.target.innerText = curState;
        event.target.disabled = true;

        // appending into movesdata
        const newItem = { key : Number(id) , value:curState};
        addToMoves(newItem);
       

         
       // console.log(checkWinner());
        if (checkWinner(updatedBoard)) {
            setWinner(curState);
            Game_Complete();
            return;
        }
        

        if(counter < 8)
        {

           // making the system move 
        
           let position = get_position(updatedBoard.slice() , getOtherState(curState));
           let element = document.getElementById(position).childNodes[0];
           element.innerText = getOtherState(curState);
           element.disabled = true;
           updatedBoard[position] = getOtherState(curState);
           setBoard(updatedBoard);
           
        // add to moves 
        const SystemnewItem = { key : position , value:getOtherState(curState)};
        addToMoves(SystemnewItem);
        if (checkWinner(updatedBoard)) {
            setWinner(getOtherState(curState));
            Game_Complete();
            return;
        }
      
         // update the board
       
          setCounter(counter+2);

        }

        else {
            setCounter(counter+1);
        }
       
}


function Game_Complete()
{
    for(let i=0;i<board.length;i++)
    {
        if(board[i] === null)
        {
             let element = document.getElementById(i).childNodes[0];
             element.disabled = true;
        }
    }
   
}


    return (

        <ThemeProvider theme={theme}>
        <h2>Tic Tac Toe</h2>
       <div>
        { winner === "X" &&  
                
                    <p>
                        Congrats you won !!!
                        
                        <Button style={{ marginLeft: "10px"  }} variant="contained" color="primary" onClick={() => window.location.reload(false)} >Play Again</Button>
                    </p>
               
                
        }
        {
            winner === "O" && 
                
                    <p>
                        System Won !!!
                        
                        <Button style={{ marginLeft: "10px" }} variant="contained" color="primary" onClick={() => window.location.reload(false)}>Play Again</Button>
                    </p>
        }
        { winner === null  &&  counter === 9  && 
               
                    <p>
                        Game is Draw
                        
                        <Button style={{ marginLeft: "10px" }} variant="contained" color="primary"  onClick={() => window.location.reload(false)}>Play Again</Button>
                    </p>
               
            
            
        }


           
           <div className="board-container">
                   
                
                  <div className="game-board">
                   
                        <div className="board-row">
                            <div className="cell" id="0">
                                <button onClick={updateOnclick}>
                                    {board[0]}</button>
                            </div>

                            <div className="cell" id="1">
                                <button onClick={updateOnclick}>
                                    {board[1]}</button>
                            </div>
                            <div className="cell" id="2">
                                <button onClick={updateOnclick}>
                                    {board[2]}</button>
                            </div>

                        </div>

                        <div className="board-row">
                            <div className="cell" id="3">
                                <button onClick={updateOnclick}>
                                    {board[3]}</button>
                            </div>

                            <div className="cell" id="4">
                                <button onClick={updateOnclick}>
                                    {board[4]}</button>
                            </div>
                            <div className="cell" id="5">
                                <button onClick={updateOnclick}>
                                    {board[5]}</button>
                            </div>
                        </div>

                        <div className="board-row">
                            <div className="cell" id="6">
                                <button onClick={updateOnclick}>
                                    {board[6]}</button>
                            </div>

                            <div className="cell" id="7">
                                <button onClick={updateOnclick}>
                                    {board[7]}</button>
                            </div>
                            <div className="cell" id="8">
                                <button onClick={updateOnclick}>
                                    {board[8]}</button>
                            </div>
                        </div>
                    </div>


                    <div className="messages">
                      
                      {jsonMoves && jsonMoves.map((move , index) =>
                        {
                            //console.log("index is " , index , "counter is" ,move )
                           
                              
                                return (
                                   <div key={move.key} variant="info">
                                    {index+1} :  Grid {move.key+1}   is selected by {move.value}
                                   </div>
                                );
                                
                        })}
                    </div>

                </div>
        </div>  
      
        </ThemeProvider>   
    );
};

