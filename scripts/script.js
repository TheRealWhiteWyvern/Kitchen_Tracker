ApplianceList = [];

class Appliance{
    constructor(name, location, numOfDraws){
        this.name = name;
        this.location = location;
        this.numOfDraws = numOfDraws;
        for (let i = 0; i < numOfDraws; i++){
            this[`drawer${i+1}`] = new Drawer(false);
        }
        console.log(this);
        ApplianceList.push(this);
    }

}

class Drawer{
    constructor(isOpen){
        this.isOpen = isOpen;
        this.items = [];
    }
}

class Item{
    constructor(name, type){
        this.name = name;
        this.type = type;
    }
}


function AddAppliance(name, location, numOfDraws){
    const fridge = new Appliance(name, location, numOfDraws);
}

function ListAppliances(){
    // code to list appliances
    console.log(ApplianceList);
}