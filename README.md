<h2>Inventory Manager Startup</h2>

<p>The Inventory Manager is designed to work with the <a href="https://obsproject.com/kb/browser-source" target="_blank">OBS Browser Source</a>. First, copy the contents of the <a href="https://github.com/NoiseyLobster/ChatInventoryManager/tree/master/FileHostingForOBS" target="_blank">FileHostingForOBS</a> folder to a local drive OBS can access or a publicly accessible web location. Then, target the index.html file at that location as the Browser Source.</p>

<p>Note: The Inventory Manager will match the height and width dimensions specified when creating the OBS Browser Source instance. These can be later edited by updating the Browser Source properties.</p>

<p>On startup, the Inventory Manager will check the browser's <code>localStorage</code> for prior inventory history and will attempt to load that history for the current session if avaliable. The Inventory Manager will also connect to Twitch chat and begin listening for commands or Streamloots messages at this time.</p>

<h2>Twitch Chat Commands</h2>

<p>Note: Only the Twitch channel owner and their mod team are authorized to issue Inventory Manager commands.</p>

<h3>Add item(s) to the inventory</h3>
<code>!add "ItemName" [Amount]</code>
  
<ul>
  <li>ItemName: The name of the item in the inventory you are looking to increase the quantity of. Ensure the name is wrapped in quotes ("") when entering the command.</li>
  <li>[Optional] Amount: The amount of the item to add to the inventory. Only whole numbers are allowed and the number must be written as a digit (i.e. 2). Defaults to 1 if not provided.</li>
</ul>

<h3>Remove item(s) from the inventory</h3>
<code>!del "ItemName" [Amount]</code>

<ul>
  <li>ItemName: The name of the item in the inventory you are looking to decrease the quantity of. Ensure the name is wrapped in quotes ("") when entering the command.</li>
  <li>[Optional] Amount: The amount of the item to remove from the inventory. Only whole numbers are allowed and the number must be written as a digit (i.e. 2). Defaults to 1 if not provided.</li>
</ul>

<h3>Add new Potion type to inventory options</h3>
<code>!addPotionType "ItemName" [Amount]</code>

<ul>
  <li>ItemName: The name of the Potion type to be added as an option in the inventory. Ensure the name is wrapped in quotes ("") when entering the command.</li>
  <li>[Optional] Amount: The initial amount that should be assigned when the Potion type is created. Only whole numbers are allowed and the number must be written as a digit (i.e. 2). Defaults to 0 if not provided.</li>
</ul>

<h3>Add new Battle Item type to inventory options</h3>
<code>!addBattleItemType "ItemName" [Amount]</code>

<ul>
  <li>ItemName: The name of the Battle Item type to be added as an option in the inventory. Ensure the name is wrapped in quotes ("") when entering the command.</li>
  <li>[Optional] Amount: The initial amount that should be assigned when the Battle Item type is created. Only whole numbers are allowed and the number must be written as a digit (i.e. 2). Defaults to 0 if not provided.</li>
</ul>

<h3>Remove item type from inventory options</h3>
<code>!removeItemType "ItemName"</code>

<ul>
  <li>ItemName: The name of the item type to be removed as an option in the inventory. Ensure the name is wrapped in quotes ("") when entering the command.</li>
  <li>Note: Also deletes all current inventory for the item type when it is removed.</li>
</ul>

<h2>Streamloots Integration</h2>

<h3>Adding new items from Streamloots crafting during Twitch stream</h3>

<p>Streamloots integration for item crafting is automated to begin running at the start of the OBS Browser session without need for user input. On startup, this feature will monitor Twitch chat for messages coming from the <code>streamlootsbot</code> that include announcements of new inventory items becoming avaliable after a user crafts one. These items will be immediately added to the inventory and made visible in the UI.</p>

<p>Only messages from the <code>streamlootsbot</code> will be within scope of this feature.</p>

<p>Note: Item types must already belong to the inventory for the Streamloots integration to add them successfully. If an item type is needed that is not part of the startup item inventory, see the corresponding Twitch chat command to add that item type.</p>
