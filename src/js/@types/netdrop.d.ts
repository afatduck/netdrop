type levels = "HOST" | "LOGIN" | 'BROWSE'

type globals = {
  error: string
  level: levels
}

type RootState = {
  globals: globals
  cdir: directory[]
  path: string
}

type creds = {
  uname: string
  pword: string
}

type directory = {
  name: string
  modify: string
  perm: string
  type: 'file' | 'dir'
}

type filelink = {
  url: string
  mime: string | false
}
