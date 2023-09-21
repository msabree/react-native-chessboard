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
import {flipBoard} from '../../utils/flipBoard';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const Chessboard = ({
  position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  orientation = 'w',
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
    fenTo2dArray(position),
  );

  const squareToHighlight = useSharedValue<number>(-1);
  const boardOriented = orientation === 'w' ? board : flipBoard(board);
  const boardStateOriented =
    orientation === 'w' ? boardState : flipBoard(boardState);

  return (
    <GestureHandlerRootView>
      {/* Underlay of chessboard */}
      {boardOriented.map((row, index) =>
        row.map((square, idx) => {
          const chessPiecePosition = getPosition(index * COLUMN_LENGTH + idx);
          return (
            <View
              key={square.square}
              style={styles(idx, index, chessPiecePosition).chessSquare}
            />
          );
        }),
      )}
      {/* Overlay of chess pieces */}
      {boardStateOriented.map((row, index) =>
        row.map((square, idx) => (
          <ChessPiece
            key={`${square}${index}${idx}`}
            board={boardOriented}
            boardState={boardStateOriented}
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
        style={mainStyles.resetButton}
        onPress={() => {
          'worklet';

          console.log('clicked');
          setBoardState(fenTo2dArray(position));
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

const mainStyles = StyleSheet.create({
  resetButton: {position: 'absolute', bottom: 0, right: 200},
});

type ChessBoardProps = {
  position?: string;
  orientation?: 'w' | 'b';
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
};
