import * as primitives from "./primitives";

export class Array2D{
    static getItem(array, x, y){
        return array[y * array.length + x];
    }

    static getCornerCoordsByVector(offset, width, height, vector, result = new primitives.Point2D()){
        let maxX = width - 1;
        let maxY = height - 1;
        result.x = ((maxX + vector.x*maxX) / 2) + offset.x;
        result.y = ((maxY + vector.y*maxY) / 2) + offset.y;

        return result;
    }

    static iterateByDiagonal(array, offset, width, height, startPoint, callback){
        let maxX = (width - 1) + offset.x;
        let maxY = (height - 1) + offset.y;

        let dx1, dy1, dx2, dy2;
        let extremumX, extremumY;
        if(startPoint.x == offset.x && startPoint.y == offset.y) {
            dx1 = 0; dy1 = 1; dx2 = 1; dy2 = 0;
            extremumX = maxX; extremumY = maxY;
        }
        else if(startPoint.x == offset.x && startPoint.y == maxY){
            dx1 = 1; dy1 = 0; dx2 = 0; dy2 = -1;
            extremumX = maxX; extremumY = offset.y;
        }
        else if(startPoint.x == maxX && startPoint.y == maxY){
            dx1 = 0; dy1 = -1; dx2 = -1; dy2 = 0;
            extremumX = offset.x; extremumY = offset.y;
        }
        else if(startPoint.x == maxX && startPoint.y == offset.y){
            dx1 = -1; dy1 = 0; dx2 = 0; dy2 = 1;
            extremumX = offset.x; extremumY = maxY;
        }

        let diagonalDirX = dx1 > dx2 ? -1 : 1;
        let diagonalDirY = dy1 > dy2 ? -1 : 1;
        let x1 = startPoint.x, y1 = startPoint.y, x2 = startPoint.x, y2 = startPoint.y;
        let x, y;

        for(let i = 0, l = width + height - 1; i < l; i++){
            x = x1; y = y1;

            let item = array[y * width + x];
            callback(item, x, y);

            while(x != x2 && y != y2){
                x += diagonalDirX; y += diagonalDirY;

                let item = array[y * width + x];
                callback(item, x, y);
            }

            if((dx1 !== 0 && x1 == extremumX) || (dy1 !== 0 && y1 == extremumY)){
                let ndx = dy1, ndy = -dx1;
                dx1 = ndx; dy1 = ndy;
            }
            if((dx2 !== 0 && x2 == extremumX) || (dy2 !== 0 && y2 == extremumY)){
                let ndx = -dy2, ndy = dx2;
                dx2 = ndx; dy2 = ndy;
            }

            x1 += dx1; y1 += dy1;
            x2 += dx2; y2 += dy2;
        }
    }
}