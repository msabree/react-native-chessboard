import React from 'react';
import {Text, View} from 'react-native';

const ROW_LENGTH = 8;
const COLUMN_LENGTH = 8;
const COLUMN_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const Chessboard = () => {
  const board = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({square: `${COLUMN_LABELS[j]}${j + 1}`});
    }
    board.push(rows);
  }

  return (
    <View>
      {board.map((row, index) => {
        return (
          <View key={COLUMN_LABELS[index]}>
            {row.map(square => {
              return <Text key={square.square}>{square.square}</Text>;
            })}
          </View>
        );
      })}
    </View>
  );
};

export default Chessboard;
