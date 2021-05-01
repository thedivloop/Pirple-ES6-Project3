const colors = require('colors');

const MIN_FLOOR_A = -1;
const MAX_FLOOR_A = 9;
const MIN_FLOOR_B = 0;
const MAX_FLOOR_B = 10;
const TRAVEL_TIME_PER_FLOOR = 1000;
const DOORS_OPENING_TIME = 2000;
const DOORS_CLOSING_TIME = 2000;
const MAXIMUM_LIFT_CAPACITY = 10;
const TOTAL_PAX = 10;

const paxx = [];
var lifta;
var liftb;

var counter = 10;

LiftAllInstances = [];

class Lift {
    
    constructor(ID,minF,maxF,position=0) {
        LiftAllInstances.push(this);
        this.ID= ID;
        this.minF =minF;
        this.maxF =maxF;
        this.position = position;
        this.doorIsOpen = false;
        this.isActive = false;
        this.nextDestinationStops = [];
        this.nextPickUpStops = [];
        this.passengersInside = [];
        this.direction = "up";
        this.lastFloor;
    }

    static getLift(pax) {
        console.log("Selecting lift...".yellow);
        console.log("The passenger " + pax.id + " is at floor " + pax.startFloor + " and wants to go " + pax.direction + " to floor " + pax.destFloor);
        var assignedLift;
        if (pax.destFloor == -1 || pax.startFloor == -1) {
            assignedLift = lifta;
        }
         else if (pax.destFloor == 10 || pax.startFloor == 10) {
            assignedLift = liftb;
        } else if (lifta.direction == pax.direction && lifta.position > pax.startFloor && lifta.direction == "down") {
            assignedLift = lifta;
        } else if (lifta.direction == pax.direction && lifta.position < pax.startFloor && lifta.direction == "up") {
            assignedLift = lifta;
        } else if (liftb.direction == pax.direction && liftb.position > pax.startFloor && liftb.direction == "down") {
            assignedLift = liftb;
        } else if (liftb.direction == pax.direction && liftb.position < pax.startFloor && liftb.direction == "up") {
            assignedLift = liftb;
        } else if (!liftb.isActive) {
            assignedLift = liftb;
        } else {
            assignedLift = lifta;
        }

        pax.assignLift(assignedLift);
        assignedLift.addPickUpFloor(pax.startFloor);
        

    }

    openDoors(){
        if (!this.doorIsOpen) {
            console.log("Lift " + this.ID + " is opening the doors");
            this.doorIsOpen=true;
        }
    }

    closeDoors(){
        if (this.doorIsOpen) {
            console.log("Lift " + this.ID + " is closing the doors");
            this.doorIsOpen=false;
        }
    }

    goUptoFloor() {
        
        this.lastFloor = Math.max(Math.max.apply(Math, this.nextPickUpStops),Math.max.apply(Math, this.nextDestinationStops));
        //console.log("Lift is on floor " + this.position + " and last floor is " + this.lastFloor);
        if (this.position < this.lastFloor && this.position < (this.maxF)) {
            this.direction = "up";
            console.log("Lift " + this.ID + " is going " + this.direction);
            this.position++;
        } else {
            console.log("Lift is NOT going " + this.direction + " because it already reached the furthest floor for this journey!");
        }
    }

    goDownToFloor() {
        this.lastFloor = Math.min(Math.min.apply(Math, this.nextPickUpStops), Math.min.apply(Math, this.nextDestinationStops));
        //console.log("Lift is on floor " + this.position + " and last floor is " + this.lastFloor);
        if (this.position > this.lastFloor && this.position > (this.minF)) {
            this.direction = "down";
            console.log("Lift " + this.ID + " is going " + this.direction);
            this.position--;
        } else {
            console.log("Lift is NOT going " + this.direction + " because it already reached the furthest floor for this journey!");
        }
    }

    addDestFloor(destFloor) {
        if (this.nextDestinationStops .indexOf(destFloor) == -1) {
            this.nextDestinationStops.push(destFloor);
        }
    }

    removeDestFloor() {
        this.nextDestinationStops.splice(this.nextDestinationStops.indexOf(this.position),1);
    }

    addPickUpFloor(pickUpFloor) {
        if (this.nextPickUpStops.indexOf(pickUpFloor) == -1) {
            this.nextPickUpStops.push(pickUpFloor);
        }
    }

    removePickUpFloor() {
        this.nextPickUpStops.splice(this.nextPickUpStops.indexOf(this.position),1);
    }

    letPaxIn() {
        //console.log(pax);
        if (this.nextPickUpStops.indexOf(this.position) != -1) {
            for (i=0; i< paxx.length; i++) {
                if (paxx[i].lift != undefined && paxx[i].lift.ID == this.ID && paxx[i].startFloor == this.position && this.direction == paxx[i].direction)  {
                    this.openDoors();
                    console.log("Passenger " + paxx[i].id + " please get into lift " + this.ID);
                    this.removePickUpFloor();
                    this.passengersInside.push(paxx[i]);
                    this.addDestFloor(paxx[i].destFloor);
                }
            }
        }
    }

    letPaxOut() {
        

        if (this.nextDestinationStops.indexOf(this.position) != -1) {
            for (i=0; i< paxx.length; i++) {
                if (paxx[i].lift != undefined && paxx[i].lift.ID == this.ID && paxx[i].destFloor == this.position)  {
                    if (!this.doorIsOpen) {
                        this.openDoors();
                    }
                    console.log("Passenger " + paxx[i].id + " please get out of the lift " + this.ID);
                    paxx[i].endTimer = new Date ();
                    paxx[i].duration = paxx[i].endTimer.getTime() - paxx[i].startTimer.getTime();
                    console.log("Passenger " + paxx[i].id + " journey last " + paxx[i].duration/1000 + " seconds");
                    this.passengersInside.splice(this.passengersInside.indexOf(paxx[i]),1);
                    this.removeDestFloor();
                }
            }
        }
        if (this.doorIsOpen) {
            this.closeDoors();
        }
    }

    start() {
        if (this.checkQueue()) {
            console.log("Lift " + this.ID + " is starting.");
            this.isActive = true; 
        } else {
            console.log("Lift " + this.ID + " cannot start because job queues are empty.");
            return;
        }
    }

    checkQueue() {
        //console.log("checking Queue");
        if (this.nextPickUpStops.length != 0 || this.nextDestinationStops.length !=0) {
            this.isActive = true;
            return true;
        }
        this.setIdle();
        return false;
    }

    setIdle() {
        if (this.isActive) {
            console.log("Lift " + this.ID + " is idling.");
            this.isActive = false;
        }
    }

}



class Pax {
    constructor(id){
        while(true) {
            this.id = id;
            this.startFloor = Math.floor(Math.random()*(MAX_FLOOR_B+2) -1);
            this.destFloor = Math.floor(Math.random()*(MAX_FLOOR_B+1));
            if ((this.destFloor != this.startFloor) && Math.abs(this.startFloor-this.destFloor) < 11) break;
        }
        this.direction = "";
        this.startFloor>this.destFloor? this.direction = "down" : this.direction = "up";
        this.travelTime = 0;
        this.status = "queuing";
        this.lift;
        this.startTimer;
        this.endTimer;
    }

    assignLift(lift) {
        this.startTimer = new Date();
        this.lift = lift;
        

        //this.endTimer = new Date ();

        //this.duration = this.endTimer.getTime() - this.startTimer.getTime();
        console.log("Passenger " + this.id + " got lift " + this.lift.ID + " assigned.")
        
    }
    getOut() {
        this.endTimer = new Date ();
        this.duration = this.endTimer.getTime() - this.startTimer.getTime();
        console.log("Passenger " + this.id + " journey last " + this.duration + "ms.");
    }
}

function initialize() {
    // create the different objects Pax and Lifts

    console.log("Initializing...")
    for (i=0;i< TOTAL_PAX; i++) {
        paxx.push(new Pax(i+1));
    }
    lifta = new Lift("A",MIN_FLOOR_A,MAX_FLOOR_A);
    liftb = new Lift("B",MIN_FLOOR_B,MAX_FLOOR_B);

    for (i=0; i< paxx.length; i++) {
        var offset = Math.floor(Math.random()*5000);
        const p = paxx[i];
        setTimeout((function(p) { 
            return function() {
                console.log("Passenger " + p.id + " is pressing on the button " +p.direction);
                Lift.getLift(p);
                
                if (!p.lift.isActive) p.lift.isActive = true;
            };
        })(p), offset );
    
        // setTimeout((function(p) { 
        //     return function() {
        //         p.getOut();
        //     };
        // })(p), offset );
    }

    console.log("Initialized");

    console.log("Lifts are starting...");
    lifta.start();
    liftb.start();



}

// function to be run every second from setInterval
function runtime() {
    //console.log("Runtime runs");
    
    if (counter==-20) {
        clearInterval(intervalID);
        console.log("Interval cleared");
        return;
    }

    // Check the queue arrays of the lifts if the 2 arrays of 1 lift are empty the array should idle and the interval cleared
    for (l of LiftAllInstances) {
        if (l.checkQueue())  {
            //console.log(l.nextPickUpStops);
            //console.log(l.nextDestinationStops);
            console.log("The lift " + l.ID + " is on floor " + l.position);
            l.letPaxIn();
            l.letPaxOut();
            
            if (l.position != l.lastFloor) {
                l.direction == "up" ? l.goUptoFloor() : l.goDownToFloor();
            } else {
                if (l.direction == "up") {
                    l.direction = "down";
                    l.lastFloor= Math.min(Math.min.apply(Math, this.nextPickUpStops),Math.min.apply(Math, this.nextDestinationStops));
                } else {
                    l.direction = "up";
                    l.lastFloor= Math.max(Math.max.apply(Math, this.nextPickUpStops),Math.max.apply(Math, this.nextDestinationStops));
                }
                
                
                //console.log("direction reversal");
            }

        } else {
            console.log(l.ID + " is already idle.");
        }
    }


    counter--;
}

initialize();
const intervalID = setInterval(runtime,1000);
