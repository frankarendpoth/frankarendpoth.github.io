/* Frank Poth 08/31/2018 */

class IndexedDB {

  constructor(database_name, version = 1) {

    this.database_name = database_name;
    this.database      = undefined;
    this.version       = version;

  }

  /* Add the specified object to the specified object store in the currently open database. */
  add(object, store_name) {

    this.database.transaction([store_name], "readwrite").objectStore(store_name).add(object);

  }

  /* Delete the object in the currently open database with the specified key from the specified object store. */
  delete(object, store_name) {

    var json_object = JSON.stringify(object);

    this.database.transaction([store_name], "readwrite").objectStore(store_name).openCursor().onsuccess = (event) => {
     
      var cursor = event.target.result;

      if (cursor) {

        if (JSON.stringify(cursor.value) == json_object) { // This is a slow way to test.
          
          cursor.delete();
          return;

        }

        cursor.continue();

      }

    };

  }

  /* Get all the objects in the specified object store and then return the result in the callback. */
  getAll(store_name, callback) {

    this.database.transaction([store_name]).objectStore(store_name).getAll().onsuccess = (event) => {

      callback(event.target.result);

    };
    
  }

  /* When initialize is called, the database request is made and the callback is called if the database is found.
  If an upgrade is needed, the upgrade parameter is called, allowing the specifics of the database structure to be determined outside of this function. */
  initialize(callback, upgrade) {

    if (!window.indexedDB) alert("Your browser does not support Indexed DB. You will lose your data when you close the browser.");

    var request = window.indexedDB.open(this.database_name, this.version);

    request.addEventListener("error", (event) => { alert("Error: Failed to connect to Indexed DB!"); }, { once:true });

    request.addEventListener("success", (event) => {

      this.database = event.target.result;

      this.database.onerror = (event) => { alert("Database error: " + event.target.errorCode); }

      callback(this.database);
            
    }, { once:true });

    request.addEventListener("upgradeneeded", (event) => {
      
      this.database = event.target.result;

      upgrade(this.database);
      
    }, { once: true });

  }

  update(old_object, new_object, store_name) {

    var json_object = JSON.stringify(old_object);

    this.database.transaction([store_name], "readwrite").objectStore(store_name).openCursor().onsuccess = (event) => {
     
      var cursor = event.target.result;

      if (cursor) {

        if (JSON.stringify(cursor.value) == json_object) { // This compares A LOT of text...
          
          cursor.update(new_object);
          return;

        }

        cursor.continue();

      }

    };

  }

}