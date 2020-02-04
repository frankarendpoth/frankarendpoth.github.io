/* Frank Poth 2020/01/17 */

const MAP = {

  columns:0,
  height:0,
  region:undefined,
  regions:[],
  rows:0,
  tile_indices:undefined,
  width:0,

  setup(columns, rows, regions_data, tile_indices) {

    this.columns      = columns;
    this.height       = rows    * TILE_SIZE;
    this.rows         = rows;
    this.tile_indices = tile_indices;
    this.width        = columns * TILE_SIZE;

    TOOL.constructMultiple(Region, this.regions, regions_data);

  },

  selectRegionByPoint(x, y) {

    for (var index = this.regions.length - 1; index > -1; -- index) if (this.regions[index].containsPoint(x, y)) {

      if (this.region) this.regions.push(this.region);
      
      this.region = this.regions.splice(index, 1)[0];

      return;

    }

  },

  changeRegionByPoint(x, y) {

    if (!this.region.containsPoint(x, y)) {

      for (var index = this.regions.length - 1; index > -1; -- index) {

        var region = this.regions[index];
        
        if (region.containsPoint(x, y)) {

          this.regions.push(this.region);
          
          this.region = this.regions.splice(index, 1)[0];

          return true;

        }

      }

    }

    return false;

  }

};