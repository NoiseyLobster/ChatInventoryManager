const chatCommands = {
    commandPrefix: "!",
    addToInventory: "!add",
    removeFromInventory: "!del",
    newPotionType: "!addPotionType",
    newBattleItemType: "!addBattleItemType",
    removeItemType: "!removeItemType"
}

const inventoryManager = {
    init: () => {
        inventoryManager.client = new tmi.Client({
            options: { debug: false },
            connection: { cluster: "aws", reconnect: true },
            channels: [inventoryManager.channel]
            //channels: ["noiseylobster13"]
        })
        inventoryManager.client.connect();
        inventoryManager.client.on('chat', function (channel, user, message, self) {
            //if (user['username'] === "noiseylobster13") {
            if ((user['username'] === inventoryManager.channel || user.mod)) {
                if (message.toLowerCase().startsWith(chatCommands.commandPrefix)) {
                    //extract the command
                    var command = message.split(' ')[0];

                    //extract the portion in quotes that should have our item (includes quotes)
                    var itemNameInQuotes = message.match(/"(.*?)"/);
                    var itemName = itemNameInQuotes != null ? itemNameInQuotes[1].replace(/["]/g, "").trim() : null;

                    //if a quantity is provided extract that as well
                    var quantityString = message.match(/\d+$/);
                    var quantity = quantityString != null ? parseInt(quantityString[0]) : null;

                    switch (command) {
                        case chatCommands.addToInventory:
                            inventoryManager.addItemToInventory(itemName, quantity);
                            break;
                        case chatCommands.removeFromInventory:
                            inventoryManager.removeItemFromInventory(itemName, quantity);
                            break;
                        case chatCommands.newPotionType:
                            inventoryManager.createNewItemType(itemName, "potion", quantity);
                            break;
                        case chatCommands.newBattleItemType:
                            inventoryManager.createNewItemType(itemName, "battleItem", quantity);
                            break;
                        case chatCommands.removeItemType:
                            inventoryManager.removeItemType(itemName);
                            break;
                    }
                }
                else if (user['username'].toLowerCase() === "streamlootsbot") {
                //else {
                    inventoryManager.magicItems.forEach(item => {
                        if (message.includes(item.name)) {
                            inventoryManager.addItemToInventory(item.name);
                        }
                    });
                }
            }
        })
    },
    magicItems: [
        {
            "name": "Potion of Chaos Magic",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Potion of Elemental Resistance",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Potion of Enlightenment",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Vim Potion",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Hale Potion",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Purification Potion",
            "type": "potion",
            "amount": 0
        },
        {
            "name": "Bucket of Swamp Water",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Blister Berry",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Swamp Glider Legs",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Nethergill Puffcap",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Moss Covered Pebble",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Blightsurge Fruit",
            "type": "battleItem",
            "amount": 0
        },
        {
            "name": "Mirebind Creeper Vine",
            "type": "battleItem",
            "amount": 0
        }
    ],
    uncategorizedItems: [
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
    isMagicItem: function (itemName) {
        var isMagicItem = false;

        if (itemName != null && itemName != "") {
            this.magicItems.forEach(item => {
                if (item.name == itemName) {
                    isMagicItem = true;
                }
            });
        }

        return isMagicItem;
    },
    itemTemplate: ({ title, amount }) => `
    <div class="row inventory-item" id="${title.toLowerCase().replace(/ /g, "-")}">
        <div class="col-auto">${title} (${amount})</div>
    </div>
    `,
    addItemToInventory: function (itemName, quantityToAdd = 1) {
        if (this.isMagicItem(itemName) && quantityToAdd > 0) {
            this.magicItems.forEach(item => {
                if (item.name == itemName) {
                    var isInitialPurchase = item.amount == 0;
                    item.amount += quantityToAdd;

                    if (isInitialPurchase) {
                        var categoryID = item.type == "potion" ? "#potion-inventory" : "#battle-item-inventory";

                        $("#inventory " + categoryID).append([
                            { title: itemName, amount: item.amount }
                        ].map(this.itemTemplate).join(''));
                    }
                    else {
                        var itemID = itemName.toLowerCase().replace(/ /g, "-");

                        $("#" + itemID).replaceWith([
                            { title: itemName, amount: item.amount }
                        ].map(this.itemTemplate).join(''));
                    }
                }
            });
        }
    },
    removeItemFromInventory: function (itemName, quantityToRemove = 1) {
        if (this.isMagicItem(itemName) && quantityToRemove > 0) {
            this.magicItems.forEach(item => {
                if (item.name == itemName) {
                    item.amount = Math.max(item.amount - quantityToRemove, 0);

                    var itemID = item.name.toLowerCase().replace(/ /g, "-");
                    if (item.amount > 0) {
                        $("#" + itemID).replaceWith([
                            { title: itemName, amount: item.amount }
                        ].map(this.itemTemplate).join(''));
                    }
                    else {
                        $("#" + itemID).remove();
                    }
                }
            });
        }
    },
    createNewItemType: function (itemName, itemType, initialAmount = 0) {
        if (itemName != null && itemName != "" && itemType != null && itemType != "") {
            this.magicItems.push({
                "name": itemName,
                "type": itemType,
                "amount": 0
            });

            if (initialAmount > 0) {
                this.addItemToInventory(itemName, initialAmount);
            }
        }
    },
    removeItemType: function (itemName) {
        var indexToRemove = -1;

        this.magicItems.forEach((item, itemIndex) => {
            if (item.name == itemName) {
                this.removeItemFromInventory(item.name, item.amount);
                indexToRemove = itemIndex;
            }
        });

        if (indexToRemove >= 0) {
            this.magicItems.splice(indexToRemove, 1);
        }
    },
    client: {},
    channel: window.location.hash.slice(1).toLowerCase()
}