const twitch = window.Twitch.ext;

twitch.onContext(function (context) {
    //do something
});

twitch.onAuthorized(function (auth) {
    inventoryManager.init();
});

const chatCommands = {
    addToInventory: "!add",
    removeFromInventory: "!del"
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
                if (message.toLowerCase().startsWith(chatCommands.addToInventory)) {
                    //extract the portion in quotes that should have our item and then remove the quotes
                    var itemNameInQuotes = message.match(/"(.*?)"/);
                    if (itemNameInQuotes != null) {
                        var itemName = itemNameInQuotes[1].replace(/["]/g, "").trim();

                        //extract the quantity number from the end of the command
                        var quantity = message.match(/\d+$/);
                        if(quantity != null) {
                            var quantityAsInt = parseInt(quantity[0]);

                            inventoryManager.addItemToInventory(itemName, quantityAsInt);
                        }
                    }
                }
                else if(user['username'].toLowerCase() === "streamlootsbot") {
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
        "Potion of Chaos Magic"
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
    client: {},
    channel: window.location.hash.slice(1).toLowerCase()
}