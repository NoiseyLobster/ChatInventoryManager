const chatCommands = {
    commandPrefix: "!",
    addToInventory: "!add",
    removeFromInventory: "!del",
    addItemType: "!newItem",
    removeItemType: "!removeItem"
}

const inventoryManager = {
    init: () => {
        inventoryManager.client = new tmi.Client({
            options: { debug: false },
            connection: { cluster: "aws", reconnect: true },
            channels: [vote.channel]
            //channels: ["noiseylobster13"]
        })
        inventoryManager.client.connect();
        inventoryManager.client.on('chat', function (channel, user, message, self) {
            //if (user['username'] === "noiseylobster13") {
            if ((user['username'] === vote.channel || user.mod)) {
                if (message.toLowerCase().startsWith(chatCommands.commandPrefix)) {
                    //extract the portion in quotes that should have our item and then remove the quotes
                    var itemNameInQuotes = message.match(/"(.*?)"/);

                    if (itemNameInQuotes != null) {
                        var itemName = itemNameInQuotes[1].replace(/["]/g, "").trim();

                        //extract the quantity number from the end of the command
                        var quantity = message.match(/\d+$/);
                        if (quantity != null) {
                            var quantityAsInt = parseInt(quantity[0]);

                            if (message.toLowerCase().startsWith(chatCommands.addToInventory)) {
                                inventoryManager.addItemToInventory(itemName, quantityAsInt);
                            }
                            else if (message.toLowerCase().startsWith(chatCommands.removeFromInventory)) {
                                inventoryManager.removeItemFromInventory(itemName, quantityAsInt);
                            }
                        }
                    }
                }
                else if (user['username'].toLowerCase() === "streamlootsbot") {
                    //else {
                    inventoryManager.items.forEach(item => {
                        if (message.includes(item)) {
                            inventoryManager.addItemToInventory(item);
                        }
                    });
                }
            }
        })
    },
    items: [
        "Orange Julius",
        "Potion of Chaos Magic",
        "Bucket of Swamp Water",
        "Swamp Glider Legs",
        "Nethergill Puffcap",
        "Moss Covered Pebble",
        "Blister Berry",
        "Blightsurge Fruit",
        "Mirebind Creeper Vine",
        "Potion of Enlightenment",
        "Potion of Elemental Resistance",
        "Purification Potion",
        "Hale Potion",
        "Vim Potion",
        "Potion of Chaos Magic",
        "Potion of Hubris",
        "Golden Crested Finch Song",
        "Whispering Wind Crystal",
        "Scroll of Deathlight",
        "Orange Julius",
        "Awkward Antony",
        "Swamp Carrot",
        "Letter of Commendation",
        "Liminal Halite",
        "Nibiru Leaf"
    ],
    inventory: [],
    itemTemplate: ({ title, amount }) => `
    <div class="row inventory-item" id="${title.toLowerCase().replace(/ /g, "-")}">
        <div class="col-1 text-center">${amount}</div>
        <div class="col-1 text-center">-</div>
        <div class="col-10">${title}</div>
    </div>
    `,
    addItemToInventory: function (itemName, quantityToAdd = 1) {
        var itemIndex = inventoryManager.items.indexOf(itemName);
        var formattedItemName = itemName.toLowerCase().replace(/ /g, "-");

        if (itemIndex != -1) {
            if ($(".inventory-item").is("#" + formattedItemName)) {  //we already have at least one of these in inventory
                inventoryManager.inventory[itemIndex] += quantityToAdd;

                $("#" + formattedItemName).replaceWith([
                    { title: itemName, amount: inventoryManager.inventory[itemIndex] }
                ].map(inventoryManager.itemTemplate).join(''));
            }
            else {                                                   //we dont have any in inventory yet
                inventoryManager.inventory[itemIndex] = quantityToAdd;

                $("#inventory").append([
                    { title: itemName, amount: inventoryManager.inventory[itemIndex] }
                ].map(inventoryManager.itemTemplate).join(''));
            }
        }
        else {
            console.log("Not among allowed inventory items");
        }

        console.log(inventoryManager.inventory);
    },
    removeItemFromInventory: function (itemName, quantityToRemove = 1) {
        var itemIndex = inventoryManager.items.indexOf(itemName);
        var formattedItemName = itemName.toLowerCase().replace(/ /g, "-");

        if (itemIndex != -1 && inventoryManager.inventory[itemIndex] >= 0) {
            inventoryManager.inventory[itemIndex] = Math.max(inventoryManager.inventory[itemIndex] - quantityToRemove, 0);

            if (inventoryManager.inventory[itemIndex] > 0) {
                $("#" + formattedItemName).replaceWith([
                    { title: itemName, amount: inventoryManager.inventory[itemIndex] }
                ].map(inventoryManager.itemTemplate).join(''));
            }
            else {
                $("#" + formattedItemName).remove();
            }
        }
        else {
            console.log("Not among allowed inventory items");
        }

        console.log(inventoryManager.inventory);
    },
    client: {},
    channel: window.location.hash.slice(1).toLowerCase()
}