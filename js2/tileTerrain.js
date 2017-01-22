define(['primitives', 'components', 'render', 'algorithms', 'scene'], function(primitives, components, render, algorithms, scenes){
    class TileType{
        constructor(image){
            this.image = image;
        }
    }

    class TileTerrain extends components.Component{
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

    class TileTerrainDrawer extends components.rendering.RenderingComponent{
        render(entity, renderer){
            var terrain = entity.getComponent(TileTerrain);
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
                                renderer.addPrimitive(entity, sprite);
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

    class OneDimensionTileTerrainDrawer extends components.rendering.RenderingComponent{
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
                                renderer.addPrimitive(entity, sprite);
                            }
                        }
                    });
            }
        }
    }

    class TerrainDefinition{
        constructor(tiles, columnsCount, tileWidth, tileHeight, tileTypes){
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

    class TerrainFactory{
        static build(terrainDefinition, terrainEntity, z = 0){
            let halfWidth = terrainDefinition.width / 2;
            let halfHeight = terrainDefinition.height / 2;
            let tileHalfWidth = terrainDefinition.tileWidth / 2;
            let tileHalfHeight = terrainDefinition.tileHeight / 2;

            let tiles = terrainDefinition.tiles;
            let columnsCount = terrainDefinition.coulumnsCount;
            let tileTypes = terrainDefinition.tileTypes;
            for(let i = 0, l = tiles.length; i < l; i++){
                let x = i % columnsCount;
                let y = i / columnsCount;
                let tileCode = tiles[i];
                let tileType = tileTypes.get(tileCode);

                if(tileType){
                    let dx = x * terrainDefinition.tileWidth + tileHalfWidth - halfWidth;
                    let dy = y * terrainDefinition.tileHeight + tileHalfHeight - halfHeight;
                    let transformation = primitives.Matrix3D.translate(dx, dy, z);
                    let entity;

                    if(tileType.image){
                        entity = new scenes.SpriteEntity(tileType.image, transformation);
                    }
                    else {
                        entity = new scenes.TransformableEntity();
                    }

                    terrainEntity.addChild(entity);
                }
            }
        }
    }

    return {
        TileType,
        TileTerrain,
        TileTerrainDrawer,
        OneDimensionTileTerrain,
        OneDimensionTileTerrainDrawer,
        TerrainDefinition,
        TerrainFactory
    }
});