# Devlog Entry - 11/19/2023
## Introducing the team
Abraham Halim - **Tools Lead**  
Jimmy Nguyen - **Engine Lead**  
Madison Li - **Design Assistant**  
Josh Levano - **Design Lead**  
Pehara Vidanagamachchi -  **Engine Assistant**

## Tools and materials
**Engines:** Vite + Web Broswer  
    We chose to use a web browser, since all our group members would have experience working with Vite over the course of the quarter. Vite is also lightweight, so it won't take too much of a strain on our computers, especially compared to programs like Unity. So in short we chose our libraries, engines and platforms just due to personal convinience and not due to how they may be tailored to the task at hand, granted we did think of using some old code we did for this course to help expeidite development on this F0 assignment. If it does work out to be a solid base, wonderful. If not that's unfortante but we are certain that we should be able to make this work out somehow someway with the tools relative usefulness and flexibility. 
    
    
**Languages:** TypeScript  
    The reason we went for a web dev style engine and typescript as the langauge due to all parties having a fair amount of familiarity with the tools used. Also all of these tools we've selected are not only readily available but are also not too intesive on space or computation for our machines. So by extention we're really only using typscript and html. Again this is mainly due to the group's general comfort and shared familiarity with the not exactly the languages but the frameworks they are built upon. Again, there is some consideration given to prexisting projects to salvage. 
    
**Tools:** Prettier, ESLint, Clip Studio Paint Pro, Photoshop  
    The tools we will use will be vscode, clip studio paint and photoshop. Vscode is due to it's incredibly helpful plugins and other cool components. clip studio and photoshop due to the artists personal preferences. Everyone is fairly familiar with vscode and would prefer not to learn new things if we can avoid it. Also vscode has some cool plugins that allow for easy cleanup and quick debugging which is rather helpful for development. So again, it's just due to personal preference and that preference comes from familiarity instead of the tools being tailor picked for the task at hand. 

## Outlook
**What is your team hoping to accomplish that other teams might not attempt?**  
We're hoping to make a peaceful version of Plants vs. Zombies, where the focus is on growing plants that can help bolster other nearby plants. Certain tasks will need preconditions to be able to perform, such as collecting water to water plants. We can also "craft" by merging disparate plants into new plants. End goal of the game is to collect as many new plants as possible without killing all your plants.  

**What do you anticipate being the hardest or riskiest part of the project?**  
The stretch goals and the changing requirements seem to be the hardest/riskiest parts. The changing requirements are risky since we can't anticipate what the changes will be, and the stretch goals are by definition, a stretch beyond the basic requirements, and will depend on the time we have remaining after we satisfy the initial requirements. The spatial awareness also seems challenging since it requires different cells to interact with one another, which may be complex depending on how our grid is set up.  

**What are you hoping to learn by approaching the project with the tools and materials you selected above?**  
We're hoping to learn refactoring, especially with the changing requirements, and to -- as a result -- learn more SOLID principles of software design.  

# Devlog Entry 11/22/2023
## How we satisfied the software requirements
* [F0.a] You control a character moving on a 2D grid.
    * The character, represented by a tile image, moves to a grid cell based on mouse click. The player can move to any grid cell without limit, but can still only access nearby tiles for sowing/reaping plants.
* [F0.b] You advance time in the turn-based simulation manually.
    * Every time the player moves, a.k.a. when the player clicks on the grid with their mouse, time moves by one step. Each time step will re-randomize the sun levels, add a random amount of water to each grid cell, and call the advanceTime() function on a plant if one exists for that grid cell.  
* [F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.
    * Grid cells directly adjacent to the player (8 total) can be sowed with plants. Currently that means set to a different tile image based on the type of plant sowed. This can only be done provided that the tile in that spot is the default grass tile
    * Grid cells can be reaped from if the adjacent cell has a plant that has a growth level of 2 or more; the process resets the tile back to default (green grass tile, no plant).
* [F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
    * Using an array of CellData objects, sun and water levels are stored in each of the grid cells. Sun is randomly generated each time step, but water is aggregated over time.
* [F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
    * If a player plants a plant in a grid cell, then the plant has a type "species1-3" randomly generated. It starts at growth = 1.
* [F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
    * Plants increase their growth level when the amount of sun is greater than 50 and enough water has been aggregated (the requirement is 100 at first, and increments by 100 per each growth level achieved).
* [F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
    * If 10 plants have been harvested, a victory message is printed to console.


 ## Reflection
So far, Vite and TypeScript has been sufficient for implementing the F0 requirements, though we may want to change the right-click action to a different one, since currently it brings up an unneeded menu (even if the game does otherwise work as intended). As for team roles, since a few members were busy this week, it feels a bit as if roles had temporarily been swapped to accomodate, but it's likely that those roles will revert once all teammates are able to contribute again. This feels especially the case for the Design teammates, since the goal was to implement a barebones F0, so it felt that there was less designing to do. However, with our unique goals -- i.e. a plant crafting system -- still unfinished, that could be a place for design to think more creatively. 


# Devlog Entry 12/6/2023
## Available choices: How can a first-time player quickly identify what they are trying to do and how to achieve it?
* The player can click and move around the space, right clicking makes a different sprite come up. and also we have a little set of instructions in a text box on the page stating that m1 moves the player and m2 allows for reap and sowing.
* Have another text box to tell the player the goal of growing plants via right clicking and waiting and right clicking them again when ready
* WIP trying to make either a notifaction or textbox appear with game instructions of what the player can do

## Impacts of choices:
* When clicking around the player can be seen to be moving throughout the canvas. Also when right clicking the tiles change(currently with a placeholder no plant asset yet just tile colors). The player can also right click a plant tile to reap it and remove said plant tile, this reverts that tile's status to no plant and no plantGrowth and also the canvas back to the default green.
* WIP to make some notifcation pop up when a plant reaches full growth saying plant type x in coord [i,j].

## How we satisfied the software requirements
* [F0] our requirements for f0 stay largely the same. The plant type has been changed to a string literal, but otherwise implementation hasn't changed much. We still satisfy f0.a by clicking to move the player, f0.b by automatically incrementing time each step, f0.c by using right click on tiles next to the player to plant and harvest "plants", and f0.d by storing weather information inside a CellData object (with levels randomly re-generated each time step). F0.e is still satisfied through a string label, but as mentioned before that label has been defined as a "PlantType" which ensures the label will be only one of the three types defined, species1, species2, and species3. F0.f is satisfied by the plant interacting with the sun/water levels in the cell data, and f0.g is satisfied by the victory message printed after harvesting 10 plants
      
 * [F1.a] The important state of each cell of your game’s grid must be backed by a single contiguous byte array in AoS or SoA format. Your team must statically allocate memory usage for the whole grid.
    * All the cells of the grid have their data stored in a SOA style byte array that can be saved locally via the magic of JSON. It's statically done. On first boot up grid is saved as a blank grid. When the save button is pressed or Autosave is triggered it reads the whole grid and saves the data locally via JSON
* [F1.b] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times.
    * All actions are done sent into a stack. They can be undone via undo button and thrown into the stack. When this happens that action is thrown into redo. The same can be done via redo button. the stacks are also saved like the grid. it's inelegant but can work.
* [F1.c] The player must be able to manually save their progress in the game in a way that allows them to load that save and continue play another day. The player must be able to manage multiple save files (allowing save scumming).
    * there is a save button, it calls the save thing from f1.a and stores it in JSON. That json will first go to the save1 button, then save2 then save3 then discarded into the void because the programmer who was resposibile for this(me abraham) couldn't figure out how to do drop down menus. Also auto save has it's own button
* [F1.d] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.c.)
    * Auto save is periodically triggered and saved in the auto save button. It's pretty inelegant but it works, kinda. Couldn't figure out how to read when the player quited so it just does it every set interval. Also there is only one autosave because more than one felt strange for a game.
 
## Reflection
* Doesn't seem like our goal has really changed that much, it was and currently still is reach the requirments the best we can in a way that is first and foremost functional and to fix it later when we have breathing room(this didn't happen). Roles have kind of been thrown to the wind and people are just working on what they can when they can when they need it. We have instead elected for a task-esque system where each person is assigned a task to do. This unfortutely doesn't really work well here due to sometasks being essential for other tasks to work. This issue lead to some tighter than prefered deadlines where somethings either couldn't be worked on until a different memeber was finished or had to make a mock up of the dependent system and lead to some messy implementation. In short this was organizational hell due to A) a lack of organization and B) unfortunate deadlines coinciding with one another.
