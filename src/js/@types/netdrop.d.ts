type states = "CONNECTING" | "USING"

type globals = {
  error: string
  state: states
  user: UserData
  request: boolean
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
  modify: string
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

interface BaseResponse {
  result: boolean
  errors: string[]
}

interface LoginResponse extends BaseResponse {
  userData: UserData
}

interface ListDirRespone extends BaseResponse {
  dirList: directory[]
}

interface DownloadFileResponse extends BaseResponse {
  url: string
  mime: string
  size: number
}

interface ProgressResponse extends BaseResponse {
  done: number
  speed: number
  complete: boolean
}

interface UploadResponse extends BaseResponse {
  code: string
}

interface ViewResponse extends BaseResponse {
  url: string
}

interface Files extends File {
  path: string
}

interface BaseFtpRequest {
  Host: string
  Username: string
  Password: string
  Secure: boolean
  Port: number
}

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
