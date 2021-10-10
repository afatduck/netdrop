export const sortDirs = (d: directory[]): directory[] =>
  d.sort((a, b) => (a.type == "dir" ? 0 : 1) - (b.type == "dir" ? 0 : 1))

export const pathChange = (p: string, n: string | 0): string =>
  n == 0 ?
    p.substr(0, p.lastIndexOf('/'))
    :
    p += '/' + n

const bytes: string[] = ['B', 'KB', 'MB', 'GB']

export const filesize = (s: number): string => {

  for (let b of bytes) {
    if (b == 'GB' || s < 1024) { return Math.round(s * 10) / 10 + b }
    s /= 1024
  }

}
