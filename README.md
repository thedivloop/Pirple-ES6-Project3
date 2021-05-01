# Project #3

# Implementation

# ====== Overall approach ======

## Classes definition

Lifts are to be instances of class **Lift**.  
_Properties_

- Name
- Position
- Doors position
- is Idle (not working)
- Is Active (not in emergency state)
- Next destination stops (array) with number of passengers for every stop. (use a simple array of size 12 and content is the number of passengers)
- next pick-up stops
- number of passengers inside
- isgoing down
- isgoing up

_Methods_

- Open doors
- Close doors
- Go up to max floor X
- Go down to min floor Y
- Add floor Z to next destination stops
- Sent to floor V
- Set emergency
- Reset
- number of entering passengers
- number of exiting passengers

Passengers are to be instances of class **Passenger**.

_Properties_

- ID
- starting floor
- destination floor
- call lift to go up
- call lift to go down
- travel time (from lift call)
- is Waiting (after lift call)
- is in the lift A/B

_Methods_

- enter the lift A/B
- select the destination floor
- exit the lift

## Constants Definition

- MIN_FLOOR_A = -1
- MAX_FLOOR_A = 9
- MIN_FLOOR_B = 0
- MAX_FLOOR_B = 10
- TRAVEL_TIME_PER_FLOOR = 1000
- DOORS_OPENING_TIME = 2000
- DOORS_CLOSING_TIME = 2000
- MAXIMUM_LIFT_CAPACITY = 10

## Other variables

- number of waiting passengers per floor (array of )

## Overall algorithm

### Initialization

### Running

After the initialization the algorithm will run on an infinite loop and/or until there is no more passengers to deliver.

When a passenger calls the lift, the system will decide on what lift to select based on the following:

- if 1 lift is idle it gets used for the requesting passenger.
- if the requesting passenger is on the floor located on the current stops of a lift (next stops)
- if lift is full capacity it doesnt stop to pick up additional passengers unless there are exiting passengers
- depending if the lift can access the requested floor

When the floor stops at the passenger floor the doors open and the passenger enters the lift.

When the passenger is inside the lift he presses the destination floor. The next destination stops are incremented accordingly.

The lift continues its journey based on the isgoing down or up properties.

At the new position (floor) it is checked if it is in the list of destination or pick-up stops.
If it is in the destination stops list it stops and open the doors to let the passengers get out and waiting passengers get in.
Otherwise if the lift is not full and there are calling passengers it stops. It lets only get in the number of passengers until the lift is full. It then continues its journey until it reaches the last destination stop.
The lifts go either up or down to last destination/pick-up stop before changing direction.
Should there be no passengers calling the lift goes into idle at the floor it is and with doors closed.

### Pseudo code

There will be different threads:

- Main
- 1 per Lift instance
- 1 per passenger instance
  Lift threads keep running until user stops the program.
  Passengers thread stops when passenger arrives at destination floor.

#### Construction/Initialization

Create 2 lifts as new object instances of Lift class
Initialize the lifts as follows:

- Idle, active, not descending, not going up, min_floor, max_floor
- Random floor (position)
  Create X passengers as new object instances of Passenger class
  Initialize the passengers as follows:
- Random position
- Random timeOffset
- Random destination
- Randomize if the passenger will press emergency (1/20 chances) and randomize the time offset to press the button after entering the lift. Also randomize after how long the it will be reset.

Get the 2 lifts objects into the Passengers instances.

#### Passengers threads

Started by main at construction
Wait for the timeOffset
Start the passenger timer
Call the lift and get the selected Lift
Add the floor to the pick-up stops list
Start the lift thread if the lift is idle.
When their lift arrives at their floor, enter the lift.
add the destination floor to the list
when the lift arrives at the passenger's destination, passenger exits the lift.
Timer stops and prints the total E2E time in seconds to console.

#### Lifts threads

Start the thread only if a passenger calls and the lift is idle. This means this thread is started from the passenger instance (check if this is possible).
Then -> while the list of pick-ups and destination stops is not all 0

- Goes to the closest position of the next stops list.
- Set the direction of the lift to either up or down.
- Set the Final floor (meaning the floor the lift needs to go before changing direction)

-> While do

- if the position is in final floor toggle the direction
- close the doors
- Move to next stop (1sec) (combine in a single method up and down by inputting the direction)
- At every floor check if it is a position to either pick-up or deliver a passenger. If it is, then broadcast to all passengers the lift position (if there is a list of calling passengers and loaded passengers then broadcast only to that list). Open the doors to let the passengers in and out.
  Update the pick-ups and destination lists
- Set the Final floor (meaning the floor the lift needs to go before changing direction)


# Pirple specs

## Details
 
You've been hired by a construction firm to help build the "brain" for a set of elevators in a new building. Your task is to write the code that will control the elevators, and tell each elevator which floor to travel to next.

## Building Description

The building is 10 stories tall and the floors are numbered 0 - 10 inclusive. The lobby is floor 0, and the penthouse is floor 10. The building contains one basement (floor -1).

The building contains 2 elevators: A and B.

Elevator A: Goes to all floors except the penthouse (floor 10).

Elevator B: Goes all the way up (including 10) but does not go to the basement (-1).



## Calling the Elevators

The residents of the building can call the elevators by clicking the call buttons located next to the elevator shafts on their floor:

Floors 1 - 9 contain two buttons to call the elevators: An "up" button and a "down" button.

Floor 10 contains only a "down" button

Floor -1 contains only an "up" button.



## Riding In the Elevators

Once inside of the elevators, a passenger can click the number of the floor that they wish to travel to.

It takes each elevator 1 second to travel past each floor. For example: traveling from floor 0 to floor 4 would take 4 seconds.

There is an emergency button inside each elevator. When that is pushed, the elevators go to their nearest floor and open their doors. The doors remain open until a reset button is pushed inside of the elevator.

## Design Goals

The goal of your code is to design a system that will get passengers from their starting floor, to their destination floor as quickly as possible. The timer on each passenger starts the moment they request the elevator. There are an unknown number of passengers in the building, on unknown floors, and they will be requesting to go in random directions (up or down) to random floors, at random times.

You can design this system in any number of ways (a library, a class, a set of event handlers or standalone functions, whatever). It's up to you. Just make sure you document your code (either as comments or by including a Readme in your repository) so that the elevator engineers know how to plug your "brain" code into the elevator's control logic.

## Input

You can expect that the other engineers are handling the user-interface part (the actual buttons). But when those buttons are clicked, they need to be able to call the methods that you define. So make sure your documentation explains what methods should be called when all the different buttons are pushed (and the syntax they should use to call those methods).

## Output

If you think elevator A or B should take an action, you should log that action to the console. The actions available to you are:

1. Move to a different floor
2. Open doors
3. Close doors

So, for example: If you think elevator A should move to floor #5 and open it's doors you could log:

console.log("A move to 5")
console.log("A open doors")

## Extra Credit

Write a script that simulates 100 passengers requesting elevators at random times, from random floors, and then requesting to go to random floors once they're inside the elevators. This script should execute over the course of 180 seconds. While the script is running you should keep track of how long each passenger waits from the moment they request the elevator to the moment they get off at their destination. Use the Math.random() function to simulate the randomness.
