/* Frank Poth 2020-01-10 */

const LOADER = {

  level_data:null,

  loadLevel(name, callback) {

    fetch('game/levels/' + name + '.json').then(response => response.json()).then(data => {

      LOADER.level_data = data;

      let promises = [];

      for (let index = data.assets.length - 1; index > -1; -- index) {

        let name = data.assets[index];

        promises.push(LOADER.promisePiece(name));
        promises.push(LOADER.promiseImage(name));

      }

      return Promise.all(promises).then(() => {

        callback();
  
      });

    });

  },

  promiseImage(name) {

    return new Promise(resolve => {

      let image = new Image();

      image.addEventListener('load', () => { resolve(image); }, { once:true });

      image.src = 'media/images/pieces/' + name + '.png';

    }).then(image => {

      IMAGES[name] = image;
    
    });

  },

  promisePiece(name) {

    return import('../game/pieces/' + name + '.js').then(module => {

      PIECES[name] = module[name];

    });

  }

};