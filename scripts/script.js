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

function showAppliances(){
    const container = document.getElementById('appliance-list');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < ApplianceList.length; i++){
        const item = ApplianceList[i];
        const applianceDiv = document.createElement('div');
        applianceDiv.innerHTML = `<h3>${item.name} - ${item.location}</h3>
                                  <p>Number of Drawers: ${item.numOfDraws}</p>`;
        container.appendChild(applianceDiv);
    }
}

function toggleAddApplianceForm(){
    const form = document.getElementById('add-appliance-form');
    const btn = document.getElementById('toggle-add-form');
    if (!form || !btn) return;
    const isHidden = getComputedStyle(form).display === 'none';
    if (isHidden){
        form.style.display = 'block';
        btn.textContent = 'Hide Add Appliance Form';
    } else {
        form.style.display = 'none';
        btn.textContent = 'Show Add Appliance Form';
    }
}