define(['primitives', 'components', 'render'], function(primitives, components, render){
    class TileType{
        constructor(image){
            this.image = image;
        }
    }

    class TileTerrainComponent extends components.Component{
        constructor(tileWidth, tileHeight, tiles, tileTypes){
            super();
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.tiles = tiles;
            this.tileTypes = tileTypes;
            this.width = tiles[0].length * tileWidth;
            this.height = tiles.length * tileHeight;
        }
    }

    class TileTerrainDrawer extends components.RenderingComponent{
        render(entity, renderer){
            var terrain = entity.getComponent(TileTerrainComponent);
            if(terrain){
                var halfWidth = terrain.width / 2;
                var halfHeight = terrain.height / 2;

                for(let i = 0; i < terrain.tiles.length; i++){
                    let row = terrain.tiles[i];
                    for(let j = 0; j < row.length; j++){
                        let tileCode = row[j];
                        let tileType = terrain.tileTypes.get(tileCode);
                        if(tileType){
                            var position = new primitives.Point3D(j * terrain.tileWidth - halfWidth, i * terrain.tileHeight - halfHeight);
                            renderer.pushMatrix(position);

                            if(tileType.image){
                                var sprite = new render.Sprite(tileType.image);
                                renderer.addPrimitive(sprite);
                            }

                            renderer.popMatrix();
                        }
                    }
                }
            }
        }
    }

    return {
        TileType,
        TileTerrainComponent,
        TileTerrainDrawer
    }
});