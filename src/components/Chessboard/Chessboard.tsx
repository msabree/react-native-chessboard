import React, {useState} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import ChessPiece from '../ChessPiece/ChessPiece';
import {FenPosition, Square} from '../../types';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  COLUMN_LABELS,
  COLUMN_LENGTH,
  MARGIN,
  ROW_LENGTH,
} from '../../constants';
import {fenTo2dArray, getPosition} from '../../utils';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const Chessboard = ({
  startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  onPieceDrop,
}: ChessBoardProps) => {
  const board: {square: string}[][] = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({square: `${COLUMN_LABELS[j]}${8 - i}`});
    }
    board.push(rows);
  }

  const [boardState, setBoardState] = useState<FenPosition[][]>(
    fenTo2dArray(startingFen),
  );

  const squareToHighlight = useSharedValue<number>(-1);

  return (
    <GestureHandlerRootView>
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
      {boardState.map((row, index) =>
        row.map((square, idx) => (
          <ChessPiece
            key={`${square}${index}${idx}`}
            board={board}
            boardState={boardState}
            row={index}
            col={idx}
            squareToHighlight={squareToHighlight}
            value={square}
            trueIndex={index * COLUMN_LENGTH + idx}
            onPieceDrop={onPieceDrop}
            position={getPosition(index * COLUMN_LENGTH + idx)}
          />
        )),
      )}

      <Pressable
        style={{position: 'absolute', bottom: 0, right: 200}}
        onPress={() => {
          'worklet';

          console.log('clicked');
          setBoardState(fenTo2dArray(startingFen));
        }}>
        <Text>Reset</Text>
      </Pressable>
    </GestureHandlerRootView>
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

type ChessBoardProps = {
  startingFen?: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
};
