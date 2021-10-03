export const sortDirs = (d: directory[]): directory[] =>
  d.sort((a, b) => (a.type == "dir" ? 0 : 1) - (b.type == "dir" ? 0 : 1))

export const styleModifyDate = (m: string): string =>
  `
  ${m.substr(0, 4)}/${m.substr(4, 2)}/${m.substr(6, 2)} ${m.substr(8, 2)}:${m.substr(10, 2)}
  `

export const pathChange = (p: string, n: string | 0): string =>
  n == 0 ?
    p.substr(0, p.lastIndexOf('/'))
    :
    p += '/' + n
