<h2>Inventory Manager Commands</h2>

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
