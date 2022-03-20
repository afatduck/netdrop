interface BaseResponse {
    result: boolean
    errors: string[]
  }
  
  interface LoginResponse extends BaseResponse {
    userData: UserData
  }
  
  interface ListDirRespone extends BaseResponse {
    dirList: directory[]
    connection: string
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

  interface ContactResponse {
    connectionFound: boolean
    host: string
    username: string
    password: string
    secure: boolean
    port: number
    path: string
  }
  
  interface BaseFtpRequest {
    Host: string
    Username: string
    Password: string
    Secure: boolean
    Port: number
    Save: boolean
  }

  interface ListDirRequest extends BaseFtpRequest {
    Connection: string
  }
  