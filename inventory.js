inventoryMain();

function inventoryMain() {

    const DEFAULT_OPTION = "Selector";
    
    var dateElem,
        plantElem,
        amountElem,
        addButton,
        selectElem,
        inventory = [];

    getElements();
    addListeners();
    load();
    renderRows();
    
    
    
    function getElements() {
        dateElem =document.getElementById("dateInput");
        plantElem =document.getElementById('plantInput');
        amountElem =document.getElementById('amountInput');
        addButton = document.getElementById("addButton");
        selectElem = document.getElementById("selectorFilter");
    }

    function addListeners() {
        addButton.addEventListener("click", addBatch, false);
        selectElem.addEventListener("change", filterBatch, false);
    }


    function addBatch() {

    
        let dateValue = dateElem.value;
        dateElem.value = "";

        let plantValue = plantElem.value;
        plantElem.value = "";

        let amountValue = amountElem.value;
        amountElem.value = "";

        let batch = {
            id: _uuid(),
            date: dateValue,
            plant: plantValue,
            amount: amountValue,
        };

        console.log(batch);

        inventory.push(batch);

        save();

        rendowRow(batch);
    
    }

    function filterBatch(){
        
        let selection = selectElem.value;
        
        if(selection == DEFAULT_OPTION){
            let rows = document.getElementsByTagName("tr");
            
            Array.from(rows).forEach((row, index)=>{
            row.style.display = "";
            });
            
        }else{
            let rows = document.getElementsByTagName("tr");
            
            Array.from(rows).forEach((row, index)=>{
            if(index == 0){
                return;
            }
            let category = row.querySelector(".selectorCell").innerText;
            if(category == selectElem.value){
                row.style.display = "";
            }else{
                row.style.display = "none";
            }
        });
        }
        
        
        
        
        }

    function removeBatch() {
        console.log("tetetet");
    }

    function save(){
        let stringified = JSON.stringify(inventory);
        localStorage.setItem("inventory", stringified);
    }

    function load(){
        let retrieved = localStorage.getItem("inventory");
        inventory = JSON.parse(retrieved);
        if (inventory == null)
            inventory = [];
        console.log(inventory);
    }

    function _uuid() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
          d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      }

    function renderRows(){
        inventory.forEach(inventoryBatch => {
            for (let keys in inventoryBatch){
                console.log(`${keys} -> ${inventoryBatch[keys]}`);
            }
            
            rendowRow(inventoryBatch);
        })
    }



    function rendowRow({date, plant: plantValue, id, amount: amountValue, done}){
        
        //let inputValue = obj.todo;
        //let inputValue2 = obj.category;
        
        //let {todo: inputValue, category: inputValue2} = obj;
        
        //add a new row
        
        let table = document.getElementById("inventoryTable");
        
        let trElem = document.createElement("tr");
        table.appendChild(trElem);
        
        //checkbox cell
        let checkboxElem = document.createElement("input");
        checkboxElem.type = "checkbox";
        checkboxElem.addEventListener("click", checkboxClickCallback, false);
        checkboxElem.dataset.id = id;
        let tdElem1 = document.createElement("td");
        tdElem1.appendChild(checkboxElem);
        trElem.appendChild(tdElem1);
        
        //date cell
        let dateElem = document.createElement("td");
        let dateObj = new Date(date);
        let formattedDate = dateObj.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        console.log(formattedDate);
        
        dateElem.innerText = formattedDate;
        trElem.appendChild(dateElem);
        
        //plant cell
        let plantElem = document.createElement("td");
        plantElem.innerText = plantValue;
        trElem.appendChild(plantElem);

        // amount cell
        let amountElem = document.createElement("td");
        amountElem.innerText = amountValue;
        trElem.appendChild(amountElem);
    
        //selector cell
        let tdElem3 = document.createElement("td");
        tdElem3.innerText = "placeholder";
        tdElem3.className = "selectorCell";
        trElem.appendChild(tdElem3);
        
        //delete cell
        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-icons";
        spanElem.addEventListener("click", deleteItem, false);
        spanElem.dataset.id = id;
        let tdElem4 = document.createElement("td");
        tdElem4.appendChild(spanElem);
        trElem.appendChild(tdElem4);
        
        console.log(done);
        checkboxElem.type = "checkbox";
        checkboxElem.checked = done;
        if(done){
            trElem.classList.add("strike");
        }else{
            trElem.classList.remove("strike");
        }
        
        function deleteItem() {
            trElem.remove();
            
            for (let i = 0; i < inventory.length; i++){
                if(inventory[i].id == this.dataset.id)
                 inventory.splice(i, 1);   
            }
            save();
            }
        
        function checkboxClickCallback() {
            trElem.classList.toggle("strike");
            for (let i = 0; i < inventory.length; i++){
                if(inventory[i].id == this.dataset.id)
                 inventory[i]["done"] = this.checked;   
            }
            save();
        }
    }
}