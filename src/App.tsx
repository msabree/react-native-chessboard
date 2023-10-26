import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Chessboard from 'react-native-chessboardjs';
import {Chess, Square} from 'chess.js';
import {Piece} from 'react-native-chessboardjs/lib/typescript/src/@types';

function App(): JSX.Element {
  const [chessGame] = useState(new Chess());
  const [optionSquares, setOptionSquares] = useState({});
  const [moveFrom, setMoveFrom] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const resetFirstMove = (square: Square) => {
    const hasOptions = getMoveOptions(square);
    if (hasOptions) {
      setMoveFrom(square);
    }
  };

  const getMoveOptions = (square: Square) => {
    const moves = chessGame.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }

    const newSquares = {} as any;
    moves.map(move => {
      newSquares[move.to] = {
        backgroundColor: 'green',
        height: 15,
        width: 15,
        borderRadius: 50,
      };
      return move;
    });
    setOptionSquares(newSquares);
    return true;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Chessboard
          customDarkSquareStyle={styles.customDarkSquareStyle}
          customLightSquareStyle={styles.customLightSquareStyle}
          position={chessGame.fen()}
          customSquareStyles={{
            ...optionSquares,
          }}
          onPieceDrop={(
            sourceSquare: Square,
            targetSquare: Square,
            piece: Piece,
          ) => {
            try {
              chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece?.[1] ?? 'q',
              });
              setMoveFrom('');
              setOptionSquares({});
              return true;
            } catch (e) {}
            return false;
          }}
          onSquareClick={(square: Square) => {
            if (!moveFrom) {
              resetFirstMove(square);
              return false;
            }

            try {
              chessGame.move({
                from: moveFrom,
                to: square,
                // use 'q' if not using selection modal
                promotion: 'q', // this is handled by drop event if onPromotionCheck is set
              });
              setMoveFrom('');
              setOptionSquares({});
              return true;
            } catch (e) {
              // invalid move
              resetFirstMove(square);
            }
            return false;
          }}
          isDraggablePiece={({piece}) => {
            return chessGame.turn() === piece[0];
          }}
          onPromotionCheck={(_startingSquareName, targetSquare, piece) => {
            // do nothing on opponent turn
            if (chessGame.turn() !== piece[0]) {
              return false;
            }

            const moveFromPiece = chessGame.get(moveFrom as Square);
            if (
              (targetSquare[1] === '8' || targetSquare[1] === '1') &&
              (piece[1] === 'p' || moveFromPiece?.type === 'p')
            ) {
              return true;
            }
            return false;
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customDarkSquareStyle: {
    backgroundColor: '#D2691E',
  },
  customLightSquareStyle: {
    backgroundColor: '#DEB887',
  },
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
