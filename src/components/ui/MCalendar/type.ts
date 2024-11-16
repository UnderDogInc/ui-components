interface IDataValue {
  startDate: Date,
  finishDate: Date,
}

interface ICurrentDate {
  mouthNow: number,
  yaerNow: number,
}

type ModelValue = {
  title: string,
  value: string,
  isDate?: boolean,
}

interface Point {
  x: number
  y: number
}

export type {
  ModelValue,
  IDataValue,
  ICurrentDate,
  Point
}