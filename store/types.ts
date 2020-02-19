export interface AppState {
  castId: string

  /**
   * Main Video
   */
  mainVideo?: VideoStream

  /**
   * User Video
   */
  userVideos: VideoStream[]


}

export interface VideoStream {
  stream: MediaStream
}