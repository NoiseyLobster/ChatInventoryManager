const chatCommands = {
    commandPrefix: "!",
    addToInventory: "!add",
    removeFromInventory: "!del",
    newPotionType: "!addPotionType",
    newBattleItemType: "!addBattleItemType",
    removeItemType: "!removeItemType"
}

const magicItemStorageKey = "MAGIC_ITEM_STORAGE";

const inventoryManager = {
    init: () => {
        var magicItemsInStorage = inventoryManager.getMagicItemsFromLocalStorage();
        if (magicItemsInStorage != null) {
            inventoryManager.magicItems = magicItemsInStorage;
        }

        inventoryManager.refreshUI();

        inventoryManager.client = new tmi.Client({
            options: { debug: false },
            connection: { cluster: "aws", reconnect: true },
            channels: [inventoryManager.channel]
            //channels: ["noiseylobster13"]
        });

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
    saveMagicItemsInLocalStorage: function () {
        localStorage.setItem(magicItemStorageKey, JSON.stringify(this.magicItems));
    },
    getMagicItemsFromLocalStorage: function () {
        return JSON.parse(localStorage.getItem(magicItemStorageKey));
    },
    refreshUI: function () {
        var potionInventoryID = "#potion-inventory";
        var battleItemID = "#battle-item-inventory";

        //clear the existing UI so we can repopulate it
        $(potionInventoryID).empty();
        $(battleItemID).empty();

        //check magic items for any inventory to load into the UI
        this.magicItems.forEach(item => {
            var currentItemCategoryID = item.type == "potion" ? potionInventoryID : battleItemID;

            if (item.amount > 0) {
                $("#inventory " + currentItemCategoryID).append([
                    { title: item.name, amount: item.amount }
                ].map(this.itemTemplate).join(''));
            }
        });
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
                    item.amount += quantityToAdd;
                }
            });

            this.refreshUI();
            this.saveMagicItemsInLocalStorage();
        }
    },
    removeItemFromInventory: function (itemName, quantityToRemove = 1) {
        if (this.isMagicItem(itemName) && quantityToRemove > 0) {
            this.magicItems.forEach(item => {
                if (item.name == itemName) {
                    item.amount = Math.max(item.amount - quantityToRemove, 0);
                }
            });

            this.refreshUI();
            this.saveMagicItemsInLocalStorage();
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
            else {
                this.saveMagicItemsInLocalStorage();
            }
        }
    },
    removeItemType: function (itemName) {
        var indexToRemove = -1;

        this.magicItems.forEach((item, itemIndex) => {
            if (item.name == itemName) {
                indexToRemove = itemIndex;
            }
        });

        if (indexToRemove >= 0) {
            this.magicItems.splice(indexToRemove, 1);

            this.refreshUI();
            this.saveMagicItemsInLocalStorage();
        }
    },
    client: {},
    channel: window.location.hash.slice(1).toLowerCase()
}