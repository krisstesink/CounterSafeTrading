class Item {
  constructor(name) {
    this.name = name;
  }
}

export class Profile {
  constructor(online, steamId, name, avatar) {
    this.user = {
      isOnline: online,
      userData: {
        steamId: steamId,
        name: name,
        avatar: avatar,
      },
    };
    this.inventory = [];
  }

  // Getter for online
  getIsOnline() {
    return this.user.isOnline;
  }

  // Setters for online
  setOnline(online) {
    this.user.isOnline = online;
  }

  // Getters and setters for user data attributes
  getSteamId() {
    return this.user.userData.steamId;
  }

  setSteamId(steamId) {
    this.user.userData.steamId = steamId;
  }

  getName() {
    return this.user.userData.name;
  }

  setName(name) {
    this.user.userData.name = name;
  }

  getAvatar() {
    return this.user.userData.avatar;
  }

  setAvatar(avatar) {
    this.user.userData.avatar = avatar;
  }

  // Helper function to add an item to the inventory
  addItemToInventory(name) {
    const newItem = new Item(name);
    this.inventory.push(newItem);
  }

  // Helper function to get the inventory
  getInventory() {
    return this.inventory;
  }

  // Helper function to find an item in the inventory by name
  findItemByName(name) {
    return this.inventory.find((item) => item.name === name);
  }
}

