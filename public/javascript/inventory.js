const twitch = window.Twitch.ext;

twitch.onContext(function (context) {
    //do something
});

twitch.onAuthorized(function (auth) {
    inventoryManager.init();
});

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
            if ((user['username'] === vote.channel || user.mod) && message === "!vote") {
                var foundItem = false;

                inventoryManager.items.forEach(item => {
                    if (message.includes(item)) {
                        foundItem = true;
                        var itemIndex = inventoryManager.items.indexOf(item);

                        if ($(".inventory-item").is("#" + item.replace(/ /g, "_"))) {
                            var amount = inventoryManager.inventory[itemIndex] += 1;

                            $("#" + item.replace(/ /g, "_")).replaceWith([
                                { title: item, amount: amount }
                            ].map(inventoryManager.itemTemplate).join(''));
                        }
                        else {
                            var amount = inventoryManager.inventory[itemIndex] = 1;

                            $("#inventory").append([
                                { title: item, amount: amount }
                            ].map(inventoryManager.itemTemplate).join(''));
                        }

                        console.log(inventoryManager.inventory);
                    }
                });

                if (!foundItem) {
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
    <a class="nav-link inventory-item" id="${title.replace(/ /g, "_")}" href="#">
        <h2 class="item-name">${title} <span class="amount">(${amount})</span></h2>
    </a>
    `,
    client: {},
    channel: window.location.hash.slice(1).toLowerCase()
}