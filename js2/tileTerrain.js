define(['primitives', 'components', 'render', 'algorithms'], function(primitives, components, render, algorithms){
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
                let halfWidth = terrain.width / 2;
                let halfHeight = terrain.height / 2;

                for(let i = 0; i < terrain.tiles.length; i++){
                    let row = terrain.tiles[i];
                    for(let j = 0; j < row.length; j++){
                        let tileCode = row[j];
                        let tileType = terrain.tileTypes.get(tileCode);
                        if(tileType){
                            var position = new primitives.Point3D(j * terrain.tileWidth - halfWidth, i * terrain.tileHeight - halfHeight);
                            if(tileType.image){
                                var sprite = new render.Sprite(tileType.image, position);
                                renderer.addPrimitive(sprite);
                            }
                        }
                    }
                }
            }
        }
    }

    class OneDimensionTileTerrain extends components.Component{
        constructor(tiles, columnsCount, tileWidth, tileHeight, tileTypes){
            super();
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.coulumnsCount = columnsCount;
            this.rowsCount = tiles.length / columnsCount;
            this.tiles = tiles;
            this.tileTypes = tileTypes;
            this.width = this.coulumnsCount * tileWidth;
            this.height = this.rowsCount * tileHeight;
        }
    }

    class OneDimensionTileTerrainDrawer extends components.RenderingComponent{
        constructor(cameraDirection = new primitives.Point3D(-1, -1, 0)) {
            super();
            this.cameraDirection = cameraDirection;
            this.startPoint = new primitives.Point2D();
            this.drawOffset = new primitives.Point2D();
        }

        render(entity, renderer){
            var terrain = entity.getComponent(OneDimensionTileTerrain);
            if(terrain){
                let halfWidth = terrain.width / 2;
                let halfHeight = terrain.height / 2;
                let tileHalfWidth = terrain.tileWidth / 2;
                let tileHalfHeight = terrain.tileHeight / 2;

                algorithms.Array2D.getCornerCoordsByVector(this.drawOffset, terrain.coulumnsCount, terrain.rowsCount, this.cameraDirection, this.startPoint);

                algorithms.Array2D.iterateByDiagonal(terrain.tiles, new primitives.Point2D(),
                    terrain.coulumnsCount, terrain.rowsCount, this.startPoint, (tileCode, j, i) => {
                        let tileType = terrain.tileTypes.get(tileCode);
                        if(tileType){

                            let x = j * terrain.tileWidth + tileHalfWidth - halfWidth;
                            let y = i * terrain.tileHeight + tileHalfHeight - halfHeight;
                            let position = new primitives.Point3D(x, y);

                            if(tileType.image){
                                var sprite = new render.Sprite(tileType.image, position);
                                renderer.addPrimitive(sprite);
                            }
                        }
                    });
            }
        }
    }

    return {
        TileType,
        TileTerrainComponent,
        TileTerrainDrawer,
        OneDimensionTileTerrain,
        OneDimensionTileTerrainDrawer
    }
});