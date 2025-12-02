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

        // Persistent delete button overlay (red X)
        const delBtn = document.createElement("button");
        delBtn.textContent = "✕";
        delBtn.className = "delete-item-button";
        delBtn.title = "Delete appliance";
        delBtn.onclick = () => {
            if (typeof this._index === 'number') {
                delAppliance(this._index);
            }
        };
        // Ensure container positioned for absolute button
        container.style.position = 'relative';

        // Click to open
        applianceDoor.addEventListener("click", () => {
            applianceDoor.classList.add("open");

            // delay inside redraw so animation is seen
            setTimeout(() => this.drawOpen(container), 450);
        });

        container.appendChild(applianceDoor);
        container.appendChild(delBtn);
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

        // Persistent delete button overlay (red X)
        const delBtn = document.createElement("button");
        delBtn.textContent = "✕";
        delBtn.className = "delete-item-button";
        delBtn.title = "Delete appliance";
        delBtn.onclick = () => {
            if (typeof this._index === 'number') {
                delAppliance(this._index);
            }
        };
        container.style.position = 'relative';
        container.appendChild(delBtn);

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
            this.toggleItems(draw);
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
        // Reset any previous handler to avoid stacking
        draw.onclick = null;

        draw.classList.add("open");

        draw.innerHTML = "";
        draw.className = "drawer open";
        draw.textContent = `Drawer ${this.num}: ${this.items.length} items`;

        // Click to Close (debounced during animation)
        draw.onclick = () => {
            if (this.animating) return;
            this.toggleItems(draw);
            this.animating = true;

            draw.classList.remove("open");

            setTimeout(() => {
                this.drawClosed(draw);
                this.animating = false;
            }, 450);

        };

    }

    toggleItems(draw, loop=false){
        const itemPopup = document.getElementById('item-popup');
        
        if (!loop){
            itemPopup.classList.toggle("show");
        }
        
        // Clear and rebuild popup content
        itemPopup.innerHTML = "";
        
        // Add title and item list
        const title = document.createElement("h3");
        title.textContent = `Drawer ${this.num}`;
        itemPopup.appendChild(title);
        
        const itemList = document.createElement("div");
        itemList.className = "item-list";
        if (this.items.length > 0) {
            this.items.forEach((item, index) => {
                const itemCard = document.createElement("div");
                itemCard.className = "item-card";
                itemCard.innerHTML = `<h4>${item.name}</h4><p>${item.type}</p>`;
                
                const delButton = document.createElement("button");
                delButton.textContent = "✕";
                delButton.className = "delete-item-button";
                delButton.title = "Delete item";
                delButton.onclick = () => {
                    this.items.splice(index, 1);
                    autoSave();
                    this.toggleItems(draw, true); // Refresh popup
                };
                itemCard.appendChild(delButton);
                itemList.appendChild(itemCard);
            });
        } else {
            itemList.textContent = "No items in this drawer.";
        }
        itemPopup.appendChild(itemList);
        
        // Add Item button
        const addItem = document.createElement("button");
        addItem.textContent = "Add Item";
        addItem.className = "popup-button";
        itemPopup.appendChild(addItem);
        addItem.onclick = () => {
            this.showAddItemForm(draw, itemPopup);
        };

        // Close button
        const closeDrawer = document.createElement("button");
        closeDrawer.textContent = "Close";
        closeDrawer.className = "popup-button";
        itemPopup.appendChild(closeDrawer);
        closeDrawer.onclick = () => {
            this.drawClosed(draw);
            itemPopup.classList.remove("show");
        };
    }

    showAddItemForm(draw, itemPopup) {
        // Clear popup and show form
        itemPopup.innerHTML = "";
        
        const formContainer = document.createElement("div");
        formContainer.className = "add-item-form";
        
        const title = document.createElement("h3");
        title.textContent = `Add Item to Drawer ${this.num}`;
        formContainer.appendChild(title);
        
        const form = document.createElement("form");
        
        // Item Name
        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Item Name:";
        form.appendChild(nameLabel);
        
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "itemName";
        nameInput.required = true;
        nameInput.placeholder = "e.g., Ice Cream";
        form.appendChild(nameInput);
        
        // Item Type
        const typeLabel = document.createElement("label");
        typeLabel.textContent = "Item Type:";
        form.appendChild(typeLabel);
        
        const typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.name = "itemType";
        typeInput.required = true;
        typeInput.placeholder = "e.g., Frozen Food";
        form.appendChild(typeInput);
        
        // Submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Add Item";
        submitButton.className = "popup-button";
        form.appendChild(submitButton);
        
        // Cancel button
        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.className = "popup-button cancel";
        form.appendChild(cancelButton);
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const newItemName = nameInput.value.trim();
            const newItemType = typeInput.value.trim();
            if (newItemName && newItemType) {
                const newItem = new Item(newItemName, newItemType);
                this.items.push(newItem);
                autoSave(); // Save to server
                this.toggleItems(draw, true); // Refresh popup
            }
        };
        
        cancelButton.onclick = () => {
            this.toggleItems(draw, true); // Go back to item list
        };
        
        formContainer.appendChild(form);
        itemPopup.appendChild(formContainer);
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
    autoSave(); // Save to server
    return appliance;
}

function delAppliance(name, location, numOfDraws){
    for (let i = 0; i < ApplianceList.length; i++){
        if (ApplianceList[i].name === name && ApplianceList[i].location === location && ApplianceList[i].numOfDraws === numOfDraws) {
            ApplianceList.splice(i, 1);
            autoSave(); // Save to server
            break;
        }
        else {
            console.log("No matching appliance found.");
        }
    }
}

function showAppliances(){
    const container = document.getElementById('appliance-list');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < ApplianceList.length; i++){
        const item = ApplianceList[i];
        const applianceDiv = document.createElement('div');
        // Pass index to appliance for internal delete button handling
        item._index = i;
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

// Delete an appliance by index
function delAppliance(index){
    if (index >= 0 && index < ApplianceList.length){
        const appliance = ApplianceList[index];
        const label = `${appliance.name}`.trim();
        const confirmName = prompt(`Type the appliance name to delete:\n${label}`);
        if (!confirmName) {
            return; // cancelled
        }
        const normalizedInput = confirmName.trim().toLowerCase();
        const normalizedName = appliance.name.trim().toLowerCase();
        if (normalizedInput !== normalizedName) {
            alert('Name mismatch. Deletion cancelled.');
            return;
        }
        ApplianceList.splice(index, 1);
        autoSave();
        showAppliances();
    }
}

// Load appliances from server on page load
async function loadAppliances() {
    try {
        const response = await fetch('/api/appliances', { credentials: 'same-origin' });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error('Failed to load appliances');
        }
        
        const appliancesData = await response.json();
        
        // Reconstruct appliances from saved data
        ApplianceList = [];
        appliancesData.forEach(data => {
            const appliance = new Appliance(data.name, data.location, data.numOfDraws);
            // Restore drawer items
            for (let i = 0; i < data.numOfDraws; i++) {
                const drawerKey = `drawer${i+1}`;
                if (data[drawerKey] && data[drawerKey].items) {
                    appliance[drawerKey].items = data[drawerKey].items.map(item => 
                        new Item(item.name, item.type)
                    );
                }
            }
        });
        
        showAppliances();
    } catch (error) {
        console.error('Error loading appliances:', error);
    }
}

// Save appliances to server
async function saveAppliances() {
    try {
        const response = await fetch('/api/appliances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(ApplianceList)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save appliances');
        }
        
        console.log('Appliances saved successfully');
    } catch (error) {
        console.error('Error saving appliances:', error);
        alert('Failed to save data. Please try again.');
    }
}

// Auto-save when data changes
function autoSave() {
    saveAppliances();
}

// Load appliances when page loads
loadAppliances();