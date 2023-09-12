import React, {useRef, useState} from 'react';
import {
  Animated,
  Button,
  Image,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ROW_LENGTH = 8;
const COLUMN_LENGTH = 8;
const COLUMN_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

type FenPosition =
  | 'P'
  | 'p'
  | 'R'
  | 'r'
  | 'N'
  | 'n'
  | 'B'
  | 'b'
  | 'Q'
  | 'q'
  | 'K'
  | 'k'
  | '8';

const Pieces: {
  P: ImageSourcePropType;
  p: ImageSourcePropType;
  R: ImageSourcePropType;
  r: ImageSourcePropType;
  N: ImageSourcePropType;
  n: ImageSourcePropType;
  B: ImageSourcePropType;
  b: ImageSourcePropType;
  Q: ImageSourcePropType;
  q: ImageSourcePropType;
  K: ImageSourcePropType;
  k: ImageSourcePropType;
  8: ImageSourcePropType;
} = {
  P: require('../../assets/wp.png'),
  p: require('../../assets/bp.png'),
  R: require('../../assets/wr.png'),
  r: require('../../assets/br.png'),
  N: require('../../assets/wn.png'),
  n: require('../../assets/bn.png'),
  B: require('../../assets/wb.png'),
  b: require('../../assets/bb.png'),
  Q: require('../../assets/wq.png'),
  q: require('../../assets/bq.png'),
  K: require('../../assets/wk.png'),
  k: require('../../assets/bk.png'),
  // 8 is an empty space and should never show
  8: require('../../assets/wp.png'),
};

const Chessboard = () => {
  const board = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({square: `${COLUMN_LABELS[j]}${8 - i}`});
    }
    board.push(rows);
  }

  // write a function to convert fen string to 2d array
  const fenTo2dArray = (fen: string): FenPosition[][] => {
    const fenArray = fen.split(' ');
    const fenBoard = fenArray[0].split('/');
    const board = [];
    for (let i = 0; i < fenBoard.length; i++) {
      const rows = [];
      for (let j = 0; j < fenBoard[i].length; j++) {
        if (isNaN(parseInt(fenBoard[i][j]))) {
          rows.push(fenBoard[i][j]);
        } else {
          for (let k = 0; k < parseInt(fenBoard[i][j]); k++) {
            rows.push('8');
          }
        }
      }
      board.push(rows);
    }
    return board as FenPosition[][];
  };

  // Fen starting position => rnbqkbnr / pppppppp / 8 / 8 / 8 / 8 / PPPPPPPP / RNBQKBNR;
  const [boardState, setBoardState] = useState<FenPosition[][]>([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);

  const pans = useRef(
    board.map((row, index) => {
      return row.map((square, idx) => {
        return useRef(new Animated.ValueXY()).current;
      });
    }),
  ).current;

  const panResponders = useRef(
    pans.map((row, index) => {
      return row.map((square, idx) => {
        return PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderMove: Animated.event(
            [null, {dx: pans[index][idx].x, dy: pans[index][idx].y}],
            {useNativeDriver: false},
          ),
          onPanResponderRelease: () => {
            console.log('first');
            pans[index][idx].extractOffset();
          },
        });
      });
    }),
  ).current;

  return (
    <View style={styles.container}>
      {board.map((row, index) => {
        return (
          <View
            key={index}
            style={{...styles.chessboard, position: 'relative', zIndex: 150}}>
            {row.map((square, idx) => {
              if (boardState[index][idx] === '8') {
                return (
                  <View
                    key={square.square}
                    style={{
                      ...dynamicStyles(index, square).chessSquare,
                      position: 'relative',
                      height: 50,
                      width: 50,
                      // opacity: 0.2,
                    }}
                  />
                );
              } else {
                return (
                  <View
                    key={square.square}
                    style={{
                      ...dynamicStyles(index, square).chessSquare,
                      zIndex: 10000,
                      position: 'relative',
                    }}>
                    <Animated.Image
                      key={square.square}
                      source={Pieces[boardState[index][idx]]}
                      style={{
                        zIndex: 20,
                        transform: [
                          {translateX: pans[index][idx].x},
                          {translateY: pans[index][idx].y},
                        ],
                        width: 40,
                        height: 40,
                        // position: 'absolute',
                        // top: 20,
                      }}
                      {...panResponders[index][idx].panHandlers}
                    />
                  </View>
                );
              }
            })}
          </View>
        );
      })}
      <Button
        title="Reset"
        onPress={
          () => {
            const res = fenTo2dArray(
              'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2',
            );
            console.log(res);
          }
          // setBoardState([
          //   ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
          //   ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
          //   ['8', '8', '8', '8', '8', '8', '8', '8'],
          //   ['8', '8', '8', '8', '8', '8', '8', '8'],
          //   ['8', '8', '8', '8', '8', '8', '8', '8'],
          //   ['8', '8', '8', '8', '8', '8', '8', '8'],
          //   ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
          //   ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
          // ])
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  chessboard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chessPiece: {
    width: 40,
    height: 40,
  },
});

const dynamicStyles = (index: number, square: {square: string}) =>
  StyleSheet.create({
    chessSquare: {
      width: 50,
      height: 50,
      zIndex: 1,
      backgroundColor:
        (index + 1) % 2 === 0
          ? square.square.charCodeAt(0) % 2 === 0
            ? 'gray'
            : 'white'
          : square.square.charCodeAt(0) % 2 === 0
          ? 'white'
          : 'gray',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Chessboard;
