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

    drawClosed(container) {
        this.isOpen = false;
        container.classList.remove("open");


        container.innerHTML = "";
        container.className = "appliance";

        const applianceDoor = document.createElement("div");
        applianceDoor.className = "appliance-door";

        const applianceHandle = document.createElement("div");
        applianceHandle.className = "appliance-handle";
        applianceDoor.appendChild(applianceHandle);

        const title = document.createElement("h3");
        title.textContent = `${this.location} ${this.name}`;
        applianceDoor.appendChild(title);

        // Click to open
        applianceDoor.addEventListener("click", () => {
            applianceDoor.classList.add("open");

            // delay inside redraw so animation is seen
            setTimeout(() => this.drawOpen(container), 450);
        });

        container.appendChild(applianceDoor);
    }

    drawOpen(container) {
        this.isOpen = true;
        container.classList.add("open");

        container.innerHTML = "";
        container.className = "appliance";

        // Door remains to allow closing animation
        const applianceDoor = document.createElement("div");
        applianceDoor.className = "appliance-door open"; // already open

        const applianceHandle = document.createElement("div");
        applianceHandle.className = "appliance-handle";
        applianceDoor.appendChild(applianceHandle);

        // Click to close
        applianceDoor.addEventListener("click", () => {
            applianceDoor.classList.remove("open");

            setTimeout(() => this.drawClosed(container), 450);
        });

        container.appendChild(applianceDoor);

        // Drawers & interior

        for (let j = 0; j < this.numOfDraws; j++) {
            const drawer = new Drawer(j + 1, container);
            drawer.drawClosed();
        }
    }
}

class Drawer{
    constructor(num, container){
        this.num = num;
        this.container = container;
        this.isOpen = false;
        this.items = [];
    }
    drawClosed(){
        this.isOpen = false;
        const drawerElement = document.createElement("div");
        drawerElement.className = "drawer-closed";
        drawerElement.textContent = `Drawer ${this.num}: ${this.items.length} items`;
        this.container.appendChild(drawerElement);
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
        const applianceDiv = document.createElement('div');
        item.drawClosed(applianceDiv);
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

const freezer = new Appliance('Freezer', 'Kitchen', 3);
const freezerGarage = new Appliance('Freezer', 'Garage', 5);
showAppliances();