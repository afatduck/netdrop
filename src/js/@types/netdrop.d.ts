type states = "CONNECTING" | "USING"

type globals = {
  error: string
  state: states
  user: UserData
}

type RootState = {
  globals: globals
  cdir: directory[]
  path: string
  progress: progress
}

type creds = {
  host: string
  user: string
  password: string
  secure: boolean
}

type directory = {
  name: string
  modify: string
  size: string
  type: 'file' | 'dir'
}

type filelink = {
  url: string
  mime: string | false
}

type progress = {
  title: string,
  percentage: number
}

type Action<T> = {
  type: string,
  payload: T
}

type Credentials = {
  id: number
  host: string
  username: string
  password: string
  secure: boolean
}

type UserData = {
  username: string
  credentials: Credential[]
}

type LoginInput = {
  user: string
  password: string
  repeat: string
}

type LoginResponse = {
  result: boolean
  userData: UserData
  errors: string[]
}

type ListDirRespone = {
  result: boolean
  errors: string[]
  dirList: directory[]
}
