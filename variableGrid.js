var gridSize = 5;
var winnerHorizTemp = [];
var winnerVertTemp = [];
var winnerLeftDiagTemp = [];
var winnerRightDiagTemp = [];
var winner = [];
var x= 0;

for( i = 1; i<= gridSize*gridSize; i++){
	winnerHorizTemp.push(i)
	if( i % gridSize == 0 ){
		winner.push(winnerHorizTemp);
		winnerHorizTemp = [];
	}

}

for ( i = 1; i <= gridSize; i++){
	for(x = 0; x < gridSize; x++){
		winnerVertTemp.push(x * gridSize + i);
	}
	winner.push(winnerVertTemp);
	winnerVertTemp = [];
}

for(i = 1; i <= gridSize; i++){
	winnerLeftDiagTemp.push(i + (i-1) * (gridSize));
	winnerRightDiagTemp.push( (i * gridSize) - (i-1) )
}

winner.push(winnerRightDiagTemp);
console.log(winnerRightDiagTemp);
winner.push(winnerLeftDiagTemp);
console.log(winnerLeftDiagTemp);
