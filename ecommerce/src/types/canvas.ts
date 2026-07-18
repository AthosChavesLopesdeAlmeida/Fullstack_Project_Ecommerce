enum Size {
  'A0',
  'A1',
  'A2',
  'A3',
  'A4',
  'A5'
}

enum Material {
  'Madeira',
  'MDF',
  'Alumínio'
}

export interface Canvas {
  id: string,
  imageUrl: string,
  artistName: string,
  paintingName: string,
  stock: number,
  frameMaterial: Material,
  size: Size
}