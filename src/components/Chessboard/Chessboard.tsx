import React from 'react';
import {useSharedValue} from 'react-native-reanimated';
import ChessSquare from '../ChessPiece/ChessPiece';
import {FenPosition} from '../../types';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  COLUMN_LABELS,
  COLUMN_LENGTH,
  MARGIN,
  ROW_LENGTH,
} from '../../constants';
import {getPosition} from '../../utils';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const Chessboard = () => {
  const board: {square: string}[][] = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({square: `${COLUMN_LABELS[j]}${8 - i}`});
    }
    board.push(rows);
  }

  // Fen starting position => rnbqkbnr / pppppppp / 8 / 8 / 8 / 8 / PPPPPPPP / RNBQKBNR;
  const boardState = useSharedValue<FenPosition[][]>([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);

  const squareToHighlight = useSharedValue<number>(-1);

  // const chessSquare = useAnimatedStyle((index: any) => {
  //   const zIndex = isDragging.value ? 100 : 1;
  //   const borderColor = isDragging.value ? 'red' : 'black';
  //   const backgroundColor = isHovered.value ? 'green' : 'transparent';

  //   return {
  //     position: 'absolute',
  //     margin: MARGIN * 2,
  //     borderWidth: 1,
  //     borderColor,
  //     width: SIZE,
  //     height: SIZE,
  //     // backgroundColor,
  //     // transform: [{translateX: position.x}, {translateY: position.y}],
  //     zIndex: 1,
  //   };
  // });

  return (
    <>
      {/* Underlay of chessboard */}
      {board.map((row, index) =>
        row.map((square, idx) => {
          const position = getPosition(index * COLUMN_LENGTH + idx);
          return (
            <View
              key={square.square}
              style={styles(idx, index, position).chessSquare}
            />
          );
        }),
      )}
      {/* Overlay of chess pieces */}
      {boardState.value.map((row, index) =>
        row.map((square, idx) => (
          <ChessSquare
            key={`${square}${index}${idx}`}
            board={board}
            boardState={boardState}
            row={index}
            col={idx}
            squareToHighlight={squareToHighlight}
            value={square}
            trueIndex={index * COLUMN_LENGTH + idx}
          />
        )),
      )}

      <Pressable
        style={{position: 'absolute', bottom: 0, right: 200}}
        onPress={() => {
          boardState.value = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['8', '8', '8', '8', '8', '8', '8', '8'],
            ['8', '8', '8', '8', '8', '8', '8', '8'],
            ['8', '8', '8', '8', '8', '8', '8', '8'],
            ['8', '8', '8', '8', '8', '8', '8', '8'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
          ];
        }}>
        <Text>Reset</Text>
      </Pressable>
    </>
  );
};

export default Chessboard;

const styles = (idx: number, index: number, position: {x: number; y: number}) =>
  StyleSheet.create({
    chessSquare: {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
      backgroundColor: (idx + index) % 2 === 0 ? 'white' : 'black',
      transform: [{translateX: position.x}, {translateY: position.y}],
    },
  });