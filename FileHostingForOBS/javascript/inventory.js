const chatCommands = {
    commandPrefix: "!",
    addToInventory: "!add",
    removeFromInventory: "!del",
    newPotionType: "!addPotionType",
    newBattleItemType: "!addBattleItemType",
    removeItemType: "!removeItemType"
}

const magicItemStorageKey = "MAGIC_ITEM_STORAGE";
const twitchUsernameStorageKey = "TWITCH_USERNAME_STORAGE_KEY";

const inventoryManager = {
    init: () => {
        var magicItemsInStorage = inventoryManager.getMagicItemsFromLocalStorage();
        if (magicItemsInStorage != null) {
            inventoryManager.magicItems = magicItemsInStorage;
        }

        inventoryManager.refreshUI();
        inventoryManager.wireSettingsMenu();

        var twitchUsername = inventoryManager.getTwitchChannelName();
        if (twitchUsername == null || twitchUsername == "") {
            $("#settings").show();
            $("#username").focus();
        }
        else {
            inventoryManager.connectToTwitchChat();
        }

    },
    wireSettingsMenu: function () {
        var twitchUsername = inventoryManager.getTwitchChannelName();
        if (twitchUsername != null) {
            $("#username").val(twitchUsername);
        }

        $("#settings-icon").on("click", function () {
            $("#settings").show();
        });

        $("#close-settings").on("click", function () {
            $("#settings").hide();
        });

        $("#show-username").on("click", function () {
            $("#username").attr("type") == "text" ? $("#username").attr("type", "password") : $("#username").attr("type", "text");
        });

        $("#username-form").on("submit", function (e) {
            e.preventDefault();

            var username = $(this).find("#username").val();
            inventoryManager.saveTwitchChannelName(username);
            
            inventoryManager.connectToTwitchChat();
            $("#settings").hide();
        });
    },
    connectToTwitchChat: function () {
        //disconnect from any open connections first
        if (inventoryManager.isClientConnected()) {
            inventoryManager.client.disconnect();
            inventoryManager.client = null;
        }

        inventoryManager.client = new tmi.Client({
            options: { debug: false },
            connection: { cluster: "aws", reconnect: true },
            channels: [inventoryManager.getTwitchChannelName()]
        });

        inventoryManager.client.connect();

        inventoryManager.client.on('chat', function (channel, user, message, self) {
            if ((user['username'] === inventoryManager.getTwitchChannelName() || user.mod)) {
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
                            inventoryManager.addItemToInventory(itemName, quantity ?? 1);
                            break;
                        case chatCommands.removeFromInventory:
                            inventoryManager.removeItemFromInventory(itemName, quantity ?? 1);
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
                    inventoryManager.magicItems.forEach(item => {
                        if (message.includes(item.name)) {
                            inventoryManager.addItemToInventory(item.name);
                        }
                    });
                }
            }
        });
    },
    refreshUI: function () {
        var potionInventoryID = "#potion-inventory";
        var battleItemID = "#battle-item-inventory";

        //save the items being polled so they're not lost on the refresh
        var currentPolledItems = [];
        $('.inventory-item').each(function() { 
             var isInCurrentPoll = $(this).find(".vote").hasClass("selected-vote");
             if(isInCurrentPoll) {
                currentPolledItems.push($(this).attr("id"));
             }
        });

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

        //attach click listeners
        $(".inventory-item").on("click", function () {
            $(this).toggleClass("on-selected");
            $(this).find(".vote").toggleClass("selected-vote").toggleClass("unselected-vote");

            var voteCount = 1;
            $(".selected-vote").each(function () {
                $(this).html(voteCount);
                voteCount++;
            })
        });

        //restore the polling choices from before the refresh
        $('.inventory-item').each(function() { 
            var itemID = $(this).attr("id");
            var isInCurrentPoll = currentPolledItems.includes(itemID);
            if(isInCurrentPoll) {
                $(this).click();
            }
       });
    },
    itemTemplate: ({ title, amount }) => `
    <div class="row inventory-item" id="${title.toLowerCase().replace(/ /g, "-")}">
        <div class="col-11">${title} (${amount})</div>
        <div class="col-1 vote unselected-vote"></div>
    </div>
    `,
    addItemToInventory: function (itemName, quantityToAdd = 1) {
        if (quantityToAdd > 0) {
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
        if (quantityToRemove > 0) {
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
        if (itemName && itemType && !this.magicItems.some(item => item.name === itemName)) {
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
    saveMagicItemsInLocalStorage: function () {
        localStorage.setItem(magicItemStorageKey, JSON.stringify(this.magicItems));
    },
    getMagicItemsFromLocalStorage: function () {
        return JSON.parse(localStorage.getItem(magicItemStorageKey));
    },
    client: null,
    isClientConnected: function () {
        var isConnected = false;
        if (this.client != null) {
            isConnected = this.client.readyState().toLowerCase() == "open";
        }

        return isConnected;
    },
    saveTwitchChannelName: function (channelName) {
        localStorage.setItem(twitchUsernameStorageKey, channelName);
    },
    getTwitchChannelName: function () {
        return localStorage.getItem(twitchUsernameStorageKey);
    }
}