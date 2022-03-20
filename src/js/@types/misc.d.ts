type states = "CONNECTING" | "USING" | "NOCONSENT"

type globals = {
  error: string
  state: states
  user: UserData
  request: boolean
  consent: CookieConsentInterface
}

type RootState = {
  globals: globals
  cdir: directory[]
  path: string
  movePath: string
  progress: progress
  itemmenu: itemMenu
}

type creds = {
  host: string
  user: string
  password: string
  secure: boolean
  port: string
}

type directory = {
  name: string
  modify: number
  size: string
  type: 'file' | 'dir'
  mime: string
}

type filelink = {
  url: string
  mime: string | false
}

type progress = {
  title: string,
  percentage: number
  speed: string
}

type Action<T> = {
  type: string,
  payload: T
}

type Credentials = {
  name: string
  host: string
  username: string
  password: string
  secure: boolean
  port: number
}

type UserData = {
  username: string
  credentials: Credentials[]
}

type LoginInput = {
  user: string
  password: string
  repeat: string
}

type ProfileRequests = "DEL" | "CUN" | "CPW"

type GuideState = number | "done"

interface itemMenu {
  x: number
  y: number
  item: directory
}

interface TextTheme {
  name: string
  id: string
}

interface ProfileInput {
  new: string
  cpwd: string
}

interface Files extends File {
  path: string
}

interface CookieConsentInterface {
  consent: boolean
  states: boolean
  creds: boolean
  connectionSession: boolean
  connectionCookie: boolean
  jwtCookie: boolean
}

interface ConsentMap {
  key: string,
  value: boolean
}