ApplianceList = [];

class Appliance{
    constructor(name, location, numOfDraws){
        this.name = name;
        this.location = location;
        this.numOfDraws = numOfDraws;
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
            const drawerElement = document.createElement("div");
            drawer.drawClosed(drawerElement);
            // Append each drawer once in order so updates don't reorder
            container.appendChild(drawerElement);
        }
    }
}

class Drawer{
    constructor(num, container){
        this.num = num;
        this.container = container;
        this.isOpen = false;
        this.items = [];
        this.animating = false;
    }
    drawClosed(draw){
        this.isOpen = false;
        // Reset any previous handler to avoid stacking
        draw.onclick = null;

        draw.classList.remove("open");
        draw.innerHTML = "";
        draw.className = "drawer";
        draw.textContent = `Drawer ${this.num}: ${this.items.length} items`;

        // Click to Open (debounced during animation)
        draw.onclick = () => {
            if (this.animating) return;
            this.animating = true;

            // Optional visual state before redraw
            draw.classList.add("open");

            setTimeout(() => {
                this.drawOpen(draw);
                this.animating = false;
            }, 450);
        };

        // Do not append here; appending moves the node to the end and reorders drawers
    }

    drawOpen(draw){
        this.isOpen = true;
        const item1 = new Item("Chips", "Frozen1");
        const item2 = new Item("Veggies", "Frozen2");
        this.items.push(item1, item2);
        this.listItems();
        // Reset any previous handler to avoid stacking
        draw.onclick = null;

        draw.classList.add("open");

        draw.innerHTML = "";
        draw.className = "drawer open";
        draw.textContent = `Drawer ${this.num}: ${this.items.length} items`;

        // Click to Close (debounced during animation)
        draw.onclick = () => {
            if (this.animating) return;
            this.animating = true;

            draw.classList.remove("open");

            setTimeout(() => {
                this.drawClosed(draw);
                this.animating = false;
            }, 450);

        };

    }

    listItems(){
        console.log(`Items in Drawer ${this.num}:`);
        for (let i = 0; i < this.items.length; i++){
            console.log(`- ${this.items[i].name} (${this.items[i].type})`);
        };
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