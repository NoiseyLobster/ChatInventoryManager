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
            channels: ["noiseylobster13"]
        })
        inventoryManager.client.connect();
        inventoryManager.client.on('chat', function (channel, user, message, self) {
            if (user['username'] === "noiseylobster13") {
                var foundItem = false;

                inventoryManager.items.forEach(item => {
                    if (message.includes(item)) {
                        foundItem = true;

                        if ($(".item-name").is("#" + item.replace(/ /g,"_"))) {
                            console.log("already there");
                        }
                        else {
                            $("#inventory").append([
                                { title: item }
                            ].map(inventoryManager.itemTemplate).join(''));
                        }
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
    itemTemplate: ({ url, title }) => `
    <a class="nav-link inventory-item" href="#">
        <h2 class="item-name" id="${title.replace(/ /g,"_")}">${title}</h2>
    </a>
    `,
    client: {},
}