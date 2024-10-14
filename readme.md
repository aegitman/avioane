## Paint the game   
menu bar - with score ( hold in a simple var )

## General rules: 
    - (css) all the actions are made with click on cells that update the classes of the cell
        - board - the 10 x 10 table of user and pc
        - user-board - the specific board of the user
        - pc-board  the specific board of the pc
        - row       the class of each individual row in the table
        - cell      the class of each individual cell in table
        - cell-p    the class that identifies all the cells of a plane
        - cell-p-cp the class that identifies the cockpit of plane
        - cell-hit  the class that identifies a hit cell of the plane
        - cell-c    the class that identifies all the cells of a crashed plane
    
    - state of game (vars)
        - isNew before clicking the Start game button, user places the pieces
        - userIdlePlanes the number of planes the user has to still place
        - activePlane - once the user clicks a square to place a plane, hold the details in this object
            - x, y, direction
        - placedPlanes - a list of former activePlanes
        - isGameReadyToStart - flag that becomes true when all the user's planes are places 

        after the game starts we have more states of the game
        - activeTurn - [user, pc]
        - plane Class
            - holds the points relative to the cockpit
            - holds the orientation of the plane
            - holds the state of the parts of the plane, 8 points
                - isHit, isCrashed, countHit
                - takeFire return true if hit, else false
        - board Class
            - var planes[]
            - placePlane (x,y,d)
            - takeFire (x,y) - delegates to the planes and returns miss hit ot crashed
            - allPlanesCrashed(): [0,1] - cumulates the result from planes
        
        - AILogic Class
            - given a Board - figure out next probable place to fire upon (x,y)
            - placeInitialPlanes - return 3 planes positions (x,y,d)
        
    
        - TheGame - Class
            takes care of all the communication with the HTML/CSS via hooks
            functions to draw on the UI (show/hide elements, add classes, listen to clicks)
            click action trigger class action ( userBoard.fire() ) -> updates the UI
            updates the state of the game


## Start new game
    - draw a table 10 x 10
    - user clicks on a square ( place a plane on N direction with cockpit in that cell)
        - consecutive clicks on the same square (cockpit) changes the direction of the plane ( rotate )
        - if the plane is in a invalid position, it becomes transparent and no new plane can be positioned 
        - click on an empty square places a new plane until 3 planes are on the board
        - click on any plane cockpit rotates the plane 
        - click for one second deletes the plane ( use a timer https://stackoverflow.com/questions/12927667/html-trigger-event-if-mouse-clicked-for-few-seconds/12927686#12927686 )
    - button to generate a valid positioning of 3 planes
        - use can still click to rotate and delete and manually place a plane

### Click start the game ! ( finally )

    - user's click actions on it't own board are locked
    - computer generates it's own board with 3 planes
    - show a new table 10 X 10 bellow the user's
    - inform the user to start shooting and wait

#### turn by turn:
    - user's turn
        - click on enemy board
        - if it is a hit on the plane
            - mark hit 
            - if is cockpit - show all plane and mark it as crashed
            - shoot again
        - if it is a miss
            - pc takes it turn
            
    - pc's turn
        - read the user's board and find out
        - randomly choose a good shot and fire
        - if it hits - repeat the process
        - if it misses - user takes turn

#### End Game 
    each time a plane is crashed check if is the last plane 
    standing for the opposite player, if yes -declare the current player the winner
        


