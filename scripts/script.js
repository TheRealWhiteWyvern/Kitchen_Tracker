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
    const count = parseInt(numOfDraws, 10) || 0;
    const appliance = new Appliance(name, location, count);
    return appliance;
}

function showAppliances(){
    const container = document.getElementById('appliance-list');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < ApplianceList.length; i++){
        const item = ApplianceList[i];
        const appliance = document.createElement('div');
        appliance.setAttribute("class", `appliance`);
        const applianceDoor = document.createElement('div');
        applianceDoor.setAttribute("class", `appliance-door`);
        const applianceHandle = document.createElement('div');
        applianceHandle.setAttribute("class", `appliance-handle`);
        applianceDoor.appendChild(applianceHandle);
        appliance.appendChild(applianceDoor);
        const title = document.createElement('h3');
        title.textContent = `${item.name} - ${item.location}`;
        appliance.appendChild(title);

        // appliance.innerHTML = `<h3>${item.name} - ${item.location}</h3>
        //                           <p>Number of Drawers: ${item.numOfDraws}</p>`;
        // for (let j = 0; j < item.numOfDraws; j++){
        //     appliance.innerHTML += `<p>Drawer ${j+1}: ${item[`drawer${j+1}`].items.length} items</p>`;
        // }
        container.appendChild(appliance);
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

const freezer = new Appliance('Freezer', 'Kitchen', 3);
const freezerGarage = new Appliance('Freezer', 'Garage', 5);
showAppliances();