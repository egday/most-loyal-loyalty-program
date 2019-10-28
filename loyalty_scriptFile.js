/*
* A transaction processor function description
* @param {org.acme.loyalty.purchaseGame} purchaseGameData
* @transaction
*/
async function purchaseGame(purchaseGameData) {
    const { customer, store, game, redeemedPoints } = purchaseGameData;
    
    // Subtract redeemed points from game price
    const adjustedTotal = game.price - redeemedPoints;

    // Subtract redeemed points from customer point balance
    customer.pointBalance = customer.pointBalance - redeemedPoints;

    // Add new point balance from purchasing game
    customer.pointBalance = customer.pointBalance + game.pointValue;
    
    // Subtract remaining game total from customer account balance
    customer.accountBalance = customer.accountBalance - adjustedTotal;

    // Remove game from store inventory
    console.log(store.games);
    for(var i = 0; i < store.games.length; i++) {
      		console.log("gameID");
            console.log(game.gameID);
            console.log("store games before");
            console.log(store.games);
      		console.log("store.games ID");
      		console.log(store.games[i].gameID);
      		console.log("store games i");
      		console.log(store.games[i]);
      		console.log("game.gameID");
      		console.log(game.gameID);
        if (store.games[i] == game.gameID) {
            //store.games = store.games.splice(i, 1);
          	store.games.splice(i, 1);
            console.log("games afterwards");
            console.log(store.games);
            break;
        }
    }
    

    // Transfer game to customer inventory
    customer.games.push(game.gameID);

    // Get participant registry for customer
    /* return getParticipantRegistry('org.acme.loyalty.customer')
        .then(function (customerRegistry) {

            // Get participant registry for store
            return getParticipantRegistry('org.acme.loyalty.store')
                .then(function (storeRegistry) {
                    
                    // Update customer registry
                    return customerRegistry.updateAll([customer])
                        .then(function () {

                            // Update store registry
                            return storeRegistry.updateAll([store]);

                        });
                });
        });*/
  
  	 //Actually update the registries
     const customerRegistry = await getParticipantRegistry('org.acme.loyalty.customer'); 
     await customerRegistry.update(customer);
     
      
     const storeRegistry = await getParticipantRegistry('org.acme.loyalty.store');
     await storeRegistry.update(store); 

  
  
}

/*
* A transaction processor function description
* @param {org.acme.loyalty.returnGame} returnGameData
* @transaction
*/
function returnGame(returnGameData) {
    const { customer, store, game } = returnGameData;
    
    // Remove game from customer inventory
    for(var i = 0; i < customer.games.length; i++) {
        if (customer.games[i].gameID === game.gameID) {
            customer.games = customer.games.splice(i, 1);
            break;
        }
    }

    // Transfer game to store inventory
    store.games.push(game.gameID);

    // Return half of game price to customer
    customer.accountBalance = customer.accountBalance + game.price / 2;

    // Get participant registry for customer
    return getParticipantRegistry('org.acme.loyalty.customer')
        .then(function (customerRegistry) {

            // Get participant registry for store
            return getParticipantRegistry('org.acme.loyalty.store')
                .then(function (storeRegistry) {
                    
                    // Update customer registry
                    return customerRegistry.updateAll([customer])
                        .then(function () {

                            // Update store registry
                            return storeRegistry.updateAll([store]);

                        });
                });
        });
}